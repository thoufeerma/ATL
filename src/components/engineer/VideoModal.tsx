'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrainingItem } from '@/lib/training';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: TrainingItem;
}

export default function VideoModal({ isOpen, onClose, item }: VideoModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isOpen) return null;

  const { videoUrl, uploadedVideo, title } = item;
  
  let embedUrl = '';
  
  if (videoUrl) {
    const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
    const isVimeo = videoUrl.includes('vimeo.com');

    if (isYouTube) {
      // Handle various YouTube formats including youtu.be, /watch?v=, /embed/, and query params like ?si=
      const videoIdMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^"&?\/\s]{11})/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      } else {
        embedUrl = videoUrl; // fallback
      }
    } else if (isVimeo) {
      const vimeoMatch = videoUrl.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
      const vimeoId = vimeoMatch ? vimeoMatch[1] : null;
      if (vimeoId) {
        embedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
      } else {
        embedUrl = videoUrl; // fallback
      }
    } else {
      embedUrl = videoUrl;
    }
  }

  // Priority Logic
  const hasExternalEmbed = !!videoUrl && !!embedUrl;
  const hasUploadedMp4 = !hasExternalEmbed && !!uploadedVideo;

  if (!hasExternalEmbed && !hasUploadedMp4) {
    return null; // hide player
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="relative w-full aspect-video bg-black">
          {hasExternalEmbed ? (
            <iframe
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : hasUploadedMp4 ? (
            <video 
              src={uploadedVideo} 
              controls 
              autoPlay 
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          ) : null}
        </div>
      </div>
    </div>
  );
}
