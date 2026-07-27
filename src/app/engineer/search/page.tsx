import { getAllFolders, searchExplorer, TrainingFolder } from '@/lib/explorer';
import Navbar from '@/components/layout/Navbar';
import { ExplorerList } from '@/components/engineer/explorer/ExplorerList';
import { Search } from 'lucide-react';
import Link from 'next/link';

function buildFolderPath(folder: TrainingFolder, allFolders: TrainingFolder[]): string {
  const parts = [];
  let curr: TrainingFolder | undefined = folder;
  while(curr) {
    parts.unshift(curr.slug);
    curr = allFolders.find(f => f.id === curr?.parent);
  }
  return '/engineer/folder/' + parts.join('/');
}

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';

  const [allFolders, files] = await Promise.all([
    getAllFolders(),
    searchExplorer(q)
  ]);

  const lowerQ = q.toLowerCase();
  
  // Filter folders and compute fullPath so FolderRow links correctly
  const folders = allFolders
    .filter(f => f.name.toLowerCase().includes(lowerQ))
    .map(f => ({
      ...f,
      fullPath: buildFolderPath(f, allFolders)
    }));

  return (
    <main className="min-h-screen bg-zinc-50">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-8 pt-24 pb-12">
        <div className="mb-8">
          <Link href="/engineer/dashboard" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            &larr; Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-6 h-6 text-zinc-400" />
            <h1 className="text-3xl font-bold text-zinc-900">Search Results</h1>
          </div>
          <p className="text-zinc-500">
            Showing results for "{q}"
          </p>
        </div>

        {folders.length === 0 && files.length === 0 ? (
          <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
            <h3 className="text-lg font-bold text-zinc-900 mb-2">No results found</h3>
            <p className="text-zinc-500">
              We couldn't find anything matching "{q}". Try different keywords.
            </p>
          </div>
        ) : (
          <ExplorerList 
            folders={folders} 
            files={files} 
            currentPath="/engineer/folder" 
          />
        )}
      </div>
    </main>
  );
}
