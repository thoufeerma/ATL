import { TrainingFolder, TrainingFile } from '@/lib/explorer';
import { FolderRow } from './FolderRow';
import { FileRow } from './FileRow';

interface ExplorerListProps {
  folders: TrainingFolder[];
  files: TrainingFile[];
  currentPath?: string;
  emptyMessage?: string;
}

export function ExplorerList({ folders, files, currentPath = '/engineer/folder', emptyMessage = 'This folder is empty.' }: ExplorerListProps) {
  const hasContent = folders.length > 0 || files.length > 0;

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-zinc-500 bg-white rounded-xl border border-zinc-200">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
      <div className="flex flex-col">
        {folders.map(folder => (
          <FolderRow key={folder.id} folder={folder} currentPath={currentPath} />
        ))}
        {files.map(file => (
          <FileRow key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}
