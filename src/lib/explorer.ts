import { getWordPressApiUrl } from './wordpress';
import { unstable_cache } from 'next/cache';
import { cookies } from 'next/headers';

export interface TrainingFolder {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
  fullPath?: string;
}

export interface TrainingFile {
  id: number;
  title: string;
  slug: string;
  description: string;
  folderIds: number[];
  featured: boolean;
  displayOrder: number;
  relatedProducts: number[];
  date: string;
  // Dynamic fields
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null; // bytes
  fileExt: string | null;
  mimeType: string | null;
  resourceType: 'pdf' | 'zip' | 'video' | 'image' | 'file';
}

export interface ExplorerResponse {
  currentFolder: TrainingFolder | null;
  breadcrumbs: TrainingFolder[];
  childFolders: TrainingFolder[];
  files: TrainingFile[];
}

/**
 * Normalizes raw WordPress taxonomy term into a TrainingFolder
 */
function normalizeFolder(raw: any): TrainingFolder {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    parent: raw.parent,
    count: raw.count || 0,
  };
}

/**
 * Infers resource type from extension or mime type
 */
function getResourceType(ext: string, mime: string, url: string): TrainingFile['resourceType'] {
  const isVideoUrl = url.match(/(youtube\.com|youtu\.be|vimeo\.com)/i);
  if (isVideoUrl) return 'video';
  
  if (ext === 'pdf' || mime === 'application/pdf') return 'pdf';
  if (ext === 'zip' || ext === 'rar' || ext === '7z') return 'zip';
  if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(ext) || mime.startsWith('video/')) return 'video';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext) || mime.startsWith('image/')) return 'image';
  return 'file';
}

/**
 * Normalizes a raw WordPress post into a TrainingFile
 */
async function normalizeFile(raw: any): Promise<TrainingFile> {
  const acf = raw.acf || {};
  let fileUrl = null;
  let fileName = null;
  let fileSize = null;
  let fileExt = null;
  let mimeType = null;

  if (acf.external_url) {
    fileUrl = acf.external_url;
    fileName = 'External Link';
  } else if (acf.uploaded_file) {
    const fileData = acf.uploaded_file;
    if (typeof fileData === 'object' && fileData.url) {
      // Correct File Array format
      fileUrl = fileData.url;
      fileName = fileData.filename;
      fileSize = fileData.filesize; // bytes
      fileExt = fileData.subtype || fileUrl?.split('.').pop()?.toLowerCase();
      mimeType = fileData.mime_type;
    } else if (typeof fileData === 'string') {
      // Fallback if they set Return Format to File URL
      fileUrl = fileData;
      fileExt = fileUrl.split('.').pop()?.toLowerCase() || '';
    } else if (typeof fileData === 'number') {
      // Fallback if they set Return Format to File ID. 
      try {
        const media = await fetchAuth(`/wp-json/wp/v2/media/${fileData}`);
        fileUrl = media.source_url || media.guid?.rendered;
        fileExt = fileUrl?.split('.').pop()?.toLowerCase() || '';
        mimeType = media.mime_type;
        fileName = media.slug || fileUrl?.split('/').pop() || 'File';
        fileSize = media.media_details?.filesize || null;
      } catch (e) {
        console.warn(`Failed to fetch media ID ${fileData}`, e);
      }
    }
  }

  const resourceType = fileUrl ? getResourceType(fileExt || '', mimeType || '', fileUrl) : 'file';

  const getStr = (field: any) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (typeof field.rendered === 'string') return field.rendered;
    return '';
  };

  return {
    id: raw.id,
    title: getStr(raw.title),
    slug: raw.slug,
    description: getStr(raw.content),
    folderIds: raw['training-folders'] || [],
    featured: !!acf.featured,
    displayOrder: parseInt(acf.display_order, 10) || 9999,
    relatedProducts: Array.isArray(acf.related_product) ? acf.related_product : (acf.related_product ? [acf.related_product] : []),
    date: raw.date,
    fileUrl,
    fileName,
    fileSize,
    fileExt,
    mimeType,
    resourceType,
  };
}

/**
 * Fetch with Authentication Helper
 */
async function fetchAuth(endpoint: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('wp_jwt')?.value;

  if (!token) {
    throw new Error('Not authenticated');
  }

  const baseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL?.replace(/\/$/, '') || '';
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 300 } // 5 mins cache
  });

  if (response.status === 401 || response.status === 403) {
    // We cannot easily delete cookies in a Server Component render phase without throwing.
    // And if we throw a redirect() here, the try/catch in getAllFolders will swallow it 
    // and crash Next.js. So we just throw a normal error.
    throw new Error('Authentication expired or invalid');
  }

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch all folders
 */
export async function getAllFolders() {
  try {
    // Fetch all training-folders from WP. We use per_page=100 for now.
    const rawFolders = await fetchAuth('/wp-json/wp/v2/training-folders?per_page=100');
    return rawFolders.map(normalizeFolder) as TrainingFolder[];
  } catch (e) {
    console.error('Failed to fetch training folders', e);
    return [];
  }
}

/**
 * Build the tree structure to resolve paths to folder objects
 */
export async function getExplorerContents(folderSlugPath: string[]): Promise<ExplorerResponse> {
  const allFolders = await getAllFolders();
  
  let currentFolder: TrainingFolder | null = null;
  const breadcrumbs: TrainingFolder[] = [];

  // 1. Resolve path hierarchy
  if (folderSlugPath.length > 0) {
    let parentId = 0;
    for (let i = 0; i < folderSlugPath.length; i++) {
      const slug = folderSlugPath[i];
      const match = allFolders.find(f => f.slug === slug && f.parent === parentId);
      if (!match) {
        // Path is invalid, return empty state
        return { currentFolder: null, breadcrumbs: [], childFolders: [], files: [] };
      }
      breadcrumbs.push(match);
      parentId = match.id;
      if (i === folderSlugPath.length - 1) {
        currentFolder = match;
      }
    }
  }

  // 2. Find child folders of the current folder
  const currentFolderId = currentFolder ? currentFolder.id : 0;
  const childFolders = allFolders.filter(f => f.parent === currentFolderId);

  // 3. Fetch files for the current folder
  let files: TrainingFile[] = [];
  try {
    let endpoint = '/wp-json/wp/v2/training-files?per_page=100';
    if (currentFolderId > 0) {
      endpoint += `&training-folders=${currentFolderId}`;
    } else {
      // If root, we only want files that have NO folder? Or maybe root has no files.
      // Usually, we shouldn't show files in root if they belong to a folder.
      // Wait, WP doesn't have a simple "has no terms" query. We'll skip fetching files in root for now,
      // or fetch all and filter locally for those with empty folderIds.
      // Let's fetch files assigned to NO folder (if possible) or just skip for root.
      // We will skip fetching files at the root level, only root folders.
      // If they want files at root, they can be fetched without a taxonomy filter.
    }
    
    if (currentFolderId > 0) {
      const rawFiles = await fetchAuth(endpoint);
      const normalized = await Promise.all(rawFiles.map((f: any) => normalizeFile(f)));
      files = normalized.sort((a: TrainingFile, b: TrainingFile) => {
        if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    }
  } catch (e) {
    console.error('Failed to fetch files for folder', e);
  }

  return {
    currentFolder,
    breadcrumbs,
    childFolders,
    files
  };
}

export async function getRootFolders(): Promise<TrainingFolder[]> {
  const allFolders = await getAllFolders();
  return allFolders.filter(f => f.parent === 0);
}

export async function searchExplorer(query: string): Promise<TrainingFile[]> {
  if (!query) return [];
  try {
    const rawFiles = await fetchAuth(`/wp-json/wp/v2/training-files?search=${encodeURIComponent(query)}&per_page=50`);
    return Promise.all(rawFiles.map((f: any) => normalizeFile(f)));
  } catch (e) {
    console.error('Search failed', e);
    return [];
  }
}

export async function getRecentFiles(limit: number = 5): Promise<TrainingFile[]> {
  try {
    const rawFiles = await fetchAuth(`/wp-json/wp/v2/training-files?per_page=${limit}&orderby=date&order=desc`);
    return Promise.all(rawFiles.map((f: any) => normalizeFile(f)));
  } catch (e) {
    console.error('Failed to fetch recent files', e);
    return [];
  }
}

export async function getFeaturedFiles(limit: number = 5): Promise<TrainingFile[]> {
  try {
    // In WP REST API, we can't natively filter by ACF featured boolean easily without a custom endpoint or passing meta query.
    // For now, we fetch latest 50 and filter locally.
    const rawFiles = await fetchAuth(`/wp-json/wp/v2/training-files?per_page=50`);
    const mapped = await Promise.all(rawFiles.map((f: any) => normalizeFile(f)));
    return mapped.filter((f: TrainingFile) => f.featured).slice(0, limit);
  } catch (e) {
    console.error('Failed to fetch featured files', e);
    return [];
  }
}
