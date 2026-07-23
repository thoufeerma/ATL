'use client';

import { useState } from 'react';
import { TrainingItem } from '@/lib/training';
import { Play, Download, ExternalLink, FileText, ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import VideoModal from './VideoModal';

interface EngineerCardProps {
  item: TrainingItem;
}

export default function EngineerCard({ item }: EngineerCardProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  
  const hasVideo = !!item.videoUrl || !!item.uploadedVideo;
  const rawDesc = item.description || '';
  const cleanDesc = rawDesc.replace(/<[^>]+>/g, '');
  const shortDescription = cleanDesc.length > 100 ? cleanDesc.substring(0, 100) + '...' : cleanDesc;

  return (
    <>
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
        {/* Thumbnail Area */}
        <Link href={`/engineer/training/${item.slug}`} className="relative aspect-video bg-zinc-100 flex-shrink-0 block group/img">
          {item.thumbnail ? (
            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400">
              <Play className="w-12 h-12 opacity-20" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/10 group-hover/img:bg-transparent transition-colors" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 pointer-events-none">
            <span className="bg-zinc-900 text-white text-xs font-bold px-2 py-1 rounded-md">
              {item.department}
            </span>
            <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-md">
              {item.category}
            </span>
          </div>
          {item.featured && (
            <div className="absolute top-3 right-3 pointer-events-none">
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                Featured
              </span>
            </div>
          )}
        </Link>

        {/* Content Area */}
        <div className="p-5 flex flex-col flex-grow">
          <Link href={`/engineer/training/${item.slug}`} className="group/title">
            <h3 className="font-bold text-lg mb-2 text-zinc-900 line-clamp-2 group-hover/title:text-primary transition-colors">
              {item.title}
            </h3>
          </Link>
          <p className="text-zinc-500 text-sm mb-6 flex-grow">{shortDescription}</p>
          
          {/* Actions */}
          <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-zinc-100">
            {hasVideo && (
              <Button size="sm" onClick={() => setIsVideoModalOpen(true)} className="rounded-full gap-2 font-bold flex-1">
                <Play className="w-4 h-4" /> Watch
              </Button>
            )}
            
            {item.pdf && (
              <>
                <Button size="sm" variant="outline" asChild className="rounded-full gap-2 font-bold flex-1">
                  <a href={item.pdf} target="_blank" rel="noopener noreferrer">
                    <FileText className="w-4 h-4" /> Open
                  </a>
                </Button>
                <Button size="sm" variant="outline" asChild className="rounded-full font-bold px-3" title="Download PDF">
                  <a href={item.pdf} download>
                    <Download className="w-4 h-4" />
                  </a>
                </Button>
              </>
            )}

            {!hasVideo && !item.pdf && (
              <Button size="sm" variant="secondary" asChild className="rounded-full gap-2 font-bold w-full text-zinc-700 hover:text-zinc-900">
                <Link href={`/engineer/training/${item.slug}`}>
                  View Details <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            )}
          </div>
          
          {/* Secondary Actions */}
          {(item.relatedProducts.length > 0) && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-zinc-100">
              <Button size="sm" variant="ghost" asChild className="rounded-full gap-2 text-xs font-bold w-full text-zinc-600 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100">
                <Link href={`/products/${item.relatedProducts[0]}`}>
                  <ShoppingCart className="w-3 h-3" /> View Related Product
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {hasVideo && (
        <VideoModal 
          isOpen={isVideoModalOpen} 
          onClose={() => setIsVideoModalOpen(false)} 
          item={item}
        />
      )}
    </>
  );
}
