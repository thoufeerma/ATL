import { FileText, FileArchive, Video, Image as ImageIcon, File } from 'lucide-react';
import { TrainingFile } from '@/lib/explorer';

interface FileRowProps {
  file: TrainingFile;
}

function formatBytes(bytes: number | null) {
  if (!bytes || bytes === 0) return 'Unknown size';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateStr: string) {
  if (!dateStr) return 'Unknown date';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }); // e.g., 20 Jul 2026
}

export function FileRow({ file }: FileRowProps) {
  const getIcon = () => {
    switch (file.resourceType) {
      case 'pdf': return <FileText className="w-6 h-6 text-red-500" />;
      case 'zip': return <FileArchive className="w-6 h-6 text-yellow-500" />;
      case 'video': return <Video className="w-6 h-6 text-blue-500" />;
      case 'image': return <ImageIcon className="w-6 h-6 text-green-500" />;
      default: return <File className="w-6 h-6 text-zinc-400" />;
    }
  };

  const isVideo = file.resourceType === 'video';

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-b-0 group">
      <div className="shrink-0">
        {getIcon()}
      </div>
      
      <div className="flex-grow min-w-0">
        <h3 className="font-medium text-zinc-900 truncate pr-4">
          {file.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
          <span className="uppercase font-medium tracking-wide">
            {file.resourceType === 'file' ? (file.fileExt || 'Unknown') : file.resourceType}
          </span>
          {file.fileSize && (
            <>
              <span className="w-1 h-1 rounded-full bg-zinc-300" />
              <span>{formatBytes(file.fileSize)}</span>
            </>
          )}
          {file.date && (
            <>
              <span className="w-1 h-1 rounded-full bg-zinc-300" />
              <span>{formatDate(file.date)}</span>
            </>
          )}
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {file.fileUrl && (
          <a
            href={file.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
          >
            {isVideo ? 'Watch' : 'Open'}
          </a>
        )}
        {file.fileUrl && !isVideo && !file.fileUrl.match(/(youtube\.com|vimeo\.com|youtu\.be)/i) && (
          <a
            href={file.fileUrl}
            download
            className="px-4 py-1.5 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors"
          >
            Download
          </a>
        )}
      </div>
    </div>
  );
}
