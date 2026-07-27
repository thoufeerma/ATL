import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { TrainingFolder } from '@/lib/explorer';

interface ExplorerBreadcrumbsProps {
  breadcrumbs: TrainingFolder[];
}

export function ExplorerBreadcrumbs({ breadcrumbs }: ExplorerBreadcrumbsProps) {
  // Build the path progressively for each breadcrumb
  let cumulativePath = '/engineer/folder';
  
  return (
    <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-6 overflow-x-auto whitespace-nowrap pb-2">
      <Link 
        href="/engineer/dashboard" 
        className="hover:text-zinc-900 transition-colors flex items-center gap-1"
      >
        <Home className="w-4 h-4" />
        <span>Portal</span>
      </Link>
      
      {breadcrumbs.map((breadcrumb, index) => {
        cumulativePath += `/${breadcrumb.slug}`;
        const isLast = index === breadcrumbs.length - 1;
        
        return (
          <div key={breadcrumb.id} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-zinc-900">
                {breadcrumb.name}
              </span>
            ) : (
              <Link 
                href={cumulativePath}
                className="hover:text-zinc-900 transition-colors"
              >
                {breadcrumb.name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
