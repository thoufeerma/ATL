import { getExplorerContents, getRootFolders } from '@/lib/explorer';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { ExplorerList } from '@/components/engineer/explorer/ExplorerList';
import { ExplorerBreadcrumbs } from '@/components/engineer/explorer/ExplorerBreadcrumbs';

export default async function FolderPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug || [];
  
  const isRoot = slugPath.length === 0;

  let currentFolder = null;
  let breadcrumbs: any[] = [];
  let childFolders: any[] = [];
  let files: any[] = [];

  if (isRoot) {
    childFolders = await getRootFolders();
  } else {
    const explorerData = await getExplorerContents(slugPath);
    if (!explorerData.currentFolder && slugPath.length > 0) {
      notFound();
    }
    currentFolder = explorerData.currentFolder;
    breadcrumbs = explorerData.breadcrumbs;
    childFolders = explorerData.childFolders;
    files = explorerData.files;
  }

  // Calculate current path base for child folders
  const currentPath = isRoot ? '/engineer/folder' : `/engineer/folder/${slugPath.join('/')}`;

  return (
    <main className="min-h-screen bg-zinc-50">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-8 pt-24 pb-12">
        <div className="mb-8">
          <ExplorerBreadcrumbs breadcrumbs={breadcrumbs} />
          
          <h1 className="text-3xl font-bold text-zinc-900">
            {isRoot ? 'Root Folders' : currentFolder?.name}
          </h1>
          {currentFolder && currentFolder.count > 0 && (
            <p className="text-zinc-500 mt-2">
              {currentFolder.count} items inside
            </p>
          )}
        </div>

        <ExplorerList 
          folders={childFolders} 
          files={files} 
          currentPath={currentPath}
        />
      </div>
    </main>
  );
}
