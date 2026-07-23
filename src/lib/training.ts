import { fetchWordPress, getWordPressApiUrl } from './wordpress';
import { unstable_cache } from 'next/cache';

export interface TrainingItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  department: string;
  category: string;
  featured: boolean;
  displayOrder: number;
  videoUrl?: string;
  uploadedVideo?: string;
  pdf?: string;
  relatedProducts: number[];
  thumbnail?: string;
  publishedAt: string;
  external_link?: string;
}

// Cached Taxonomy Fetchers
export const getTrainingDepartments = unstable_cache(
  async () => {
    try {
      const depts = await fetchWordPress('wp/v2/training-department?per_page=100');
      const map: Record<number, string> = {};
      depts.forEach((d: any) => {
        map[d.id] = d.name;
      });
      return map;
    } catch (e) {
      console.error('Failed to fetch departments', e);
      return {};
    }
  },
  ['wp_training_departments'],
  { revalidate: 300 }
);

export const getTrainingCategories = unstable_cache(
  async () => {
    try {
      const cats = await fetchWordPress('wp/v2/training-category?per_page=100');
      const map: Record<number, string> = {};
      cats.forEach((c: any) => {
        map[c.id] = c.name;
      });
      return map;
    } catch (e) {
      console.error('Failed to fetch categories', e);
      return {};
    }
  },
  ['wp_training_categories'],
  { revalidate: 300 }
);

// Cached Media Fetcher
export const getMediaUrl = unstable_cache(
  async (mediaId: number | string | false | null | undefined): Promise<string | undefined> => {
    if (!mediaId) return undefined;
    if (typeof mediaId === 'string' && mediaId.startsWith('http')) return mediaId;
    try {
      const media = await fetchWordPress(`wp/v2/media/${mediaId}`);
      return media?.source_url || media?.guid?.rendered;
    } catch (e) {
      console.error(`Failed to fetch media ${mediaId}`, e);
      return undefined;
    }
  },
  ['wp_media_url'],
  { revalidate: 3600 }
);

const normalizeTrainingItem = async (
  raw: any, 
  deptMap: Record<number, string>, 
  catMap: Record<number, string>
): Promise<TrainingItem> => {
  const acf = raw.acf || {};
  
  // Resolve taxonomies
  const deptId = raw['training-department']?.[0];
  const catId = raw['training-category']?.[0];
  
  const department = deptId && deptMap[deptId] ? deptMap[deptId] : 'Uncategorized';
  const category = catId && catMap[catId] ? catMap[catId] : 'Uncategorized';

  // Resolve media (thumbnails, pdfs, videos if they are IDs)
  // Usually thumbnail might be returned as URL or ID. The user's JSON didn't show thumbnail, but showed pdf_document as ID.
  const [pdfUrl, uploadedVideoUrl, thumbnailUrl] = await Promise.all([
    getMediaUrl(acf.pdf_document),
    getMediaUrl(acf.video_upload),
    getMediaUrl(acf.thumbnail)
  ]);

  const getStr = (field: any) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (typeof field.rendered === 'string') return field.rendered;
    return '';
  };

  return {
    id: raw.id,
    slug: raw.slug,
    title: getStr(raw.title),
    description: getStr(raw.content),
    department,
    category,
    featured: !!acf.featured,
    displayOrder: typeof acf.display_order === 'number' ? acf.display_order : 9999,
    videoUrl: acf.video_url || undefined,
    uploadedVideo: uploadedVideoUrl,
    pdf: pdfUrl,
    relatedProducts: Array.isArray(acf.related_products) ? acf.related_products : [],
    thumbnail: thumbnailUrl,
    publishedAt: raw.date,
    external_link: acf.external_link || undefined,
  };
};

export const getTraining = async (): Promise<TrainingItem[]> => {
  const [rawItems, deptMap, catMap] = await Promise.all([
    fetchWordPress('wp/v2/training-content?per_page=100'),
    getTrainingDepartments(),
    getTrainingCategories(),
  ]);

  const normalized = await Promise.all(
    rawItems.map((item: any) => normalizeTrainingItem(item, deptMap, catMap))
  );

  return normalized;
};

export const getTrainingBySlug = async (slug: string): Promise<TrainingItem | null> => {
  const rawItems = await fetchWordPress(`wp/v2/training-content?slug=${slug}&per_page=1`);
  if (!rawItems || rawItems.length === 0) return null;

  const [deptMap, catMap] = await Promise.all([
    getTrainingDepartments(),
    getTrainingCategories(),
  ]);

  return normalizeTrainingItem(rawItems[0], deptMap, catMap);
};

export const getTrainingByDepartment = async (departmentName: string): Promise<TrainingItem[]> => {
  const allTraining = await getTraining();
  return allTraining.filter(item => item.department.toLowerCase() === departmentName.toLowerCase());
};

export const getTrainingByCategory = async (categoryName: string): Promise<TrainingItem[]> => {
  const allTraining = await getTraining();
  return allTraining.filter(item => item.category.toLowerCase() === categoryName.toLowerCase());
};

export const getFeaturedTraining = async (): Promise<TrainingItem[]> => {
  const allTraining = await getTraining();
  return allTraining.filter(item => item.featured).sort((a, b) => a.displayOrder - b.displayOrder);
};

export const getLatestTraining = async (): Promise<TrainingItem[]> => {
  const allTraining = await getTraining();
  return allTraining.sort((a, b) => {
    // 1. Featured
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    
    // 2. Display Order
    if (a.displayOrder !== b.displayOrder) {
      return a.displayOrder - b.displayOrder;
    }
    
    // 3. Date
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
};
