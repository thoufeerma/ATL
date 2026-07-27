import Link from 'next/link';
import { Folder } from 'lucide-react';
import { TrainingFolder } from '@/lib/explorer';

interface FolderRowProps {
  folder: TrainingFolder;
  currentPath: string; // the base path to append this folder's slug to
}

export function FolderRow({ folder, currentPath }: FolderRowProps) {
  // Ensure currentPath ends without a slash, and then append the slug
  const href = folder.fullPath || `${currentPath.replace(/\/$/, '')}/${folder.slug}`;

  return (
    <Link 
      href={href}
      className="flex items-center gap-4 p-4 hover:bg-zinc-100 transition-colors border-b border-zinc-100 last:border-b-0 group"
    >
      <div className="text-zinc-400 group-hover:text-blue-500 transition-colors">
        <Folder className="w-6 h-6 fill-current opacity-20" />
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="font-medium text-zinc-900 truncate group-hover:text-blue-600 transition-colors">
          {folder.name}
        </h3>
        {folder.count > 0 && (
          <p className="text-xs text-zinc-500 mt-0.5">
            {folder.count} item{folder.count !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </Link>
  );
}
