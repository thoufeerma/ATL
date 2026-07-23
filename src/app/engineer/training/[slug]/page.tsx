import { getTrainingBySlug } from '@/lib/training';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { ChevronRight, Play, Download, FileText, ShoppingCart, ExternalLink, Calendar, Layers, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Metadata, ResolvingMetadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const item = await getTrainingBySlug(slug);
  
  if (!item) {
    return {
      title: 'Not Found | Engineer Portal',
    };
  }
  
  return {
    title: `${item.title} | Engineer Portal`,
    description: item.description.replace(/<[^>]+>/g, '').substring(0, 160),
  };
}

export default async function TrainingDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getTrainingBySlug(slug);

  if (!item) {
    notFound();
  }

  const { videoUrl, uploadedVideo, title } = item;
  
  let embedUrl = '';
  
  if (videoUrl) {
    const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
    const isVimeo = videoUrl.includes('vimeo.com');

    if (isYouTube) {
      const videoIdMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^"&?\/\s]{11})/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      } else {
        embedUrl = videoUrl;
      }
    } else if (isVimeo) {
      const vimeoMatch = videoUrl.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
      const vimeoId = vimeoMatch ? vimeoMatch[1] : null;
      if (vimeoId) {
        embedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
      } else {
        embedUrl = videoUrl;
      }
    } else {
      embedUrl = videoUrl;
    }
  }

  const hasExternalEmbed = !!videoUrl && !!embedUrl;
  const hasUploadedMp4 = !hasExternalEmbed && !!uploadedVideo;

  return (
    <main className="min-h-screen bg-zinc-50 pb-20">
      <Navbar />
      
      {/* Header Context */}
      <div className="bg-zinc-900 text-white pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400 mb-6">
            <Link href="/engineer/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-zinc-500">Training</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-semibold truncate max-w-[200px] sm:max-w-md">{item.title}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 max-w-4xl leading-tight">
            {item.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Layers className="w-4 h-4 text-zinc-300" />
              <span>{item.department}</span>
            </div>
            <div className="flex items-center gap-2 bg-primary/20 text-primary-50 rounded-full px-4 py-2 border border-primary/30">
              <Tag className="w-4 h-4" />
              <span>{item.category}</span>
            </div>
            {item.publishedAt && (
              <div className="flex items-center gap-2 text-zinc-400 ml-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Video Player */}
            {(hasExternalEmbed || hasUploadedMp4) ? (
              <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video relative border-4 border-white">
                {hasExternalEmbed ? (
                  <iframe
                    src={embedUrl}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0 absolute inset-0"
                  />
                ) : hasUploadedMp4 ? (
                  <video 
                    src={uploadedVideo} 
                    controls 
                    className="w-full h-full object-contain absolute inset-0"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : null}
              </div>
            ) : item.thumbnail ? (
              <div className="rounded-2xl overflow-hidden shadow-lg aspect-video border-4 border-white bg-zinc-100">
                <img src={item.thumbnail} alt={title} className="w-full h-full object-cover" />
              </div>
            ) : null}

            {/* Content Description */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-zinc-200">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6 pb-4 border-b border-zinc-100">About this training</h2>
              <div className="prose prose-zinc max-w-none" dangerouslySetInnerHTML={{ __html: item.description }} />
            </div>

          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            
            {/* Resources Card */}
            {(item.pdf || item.external_link) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200">
                <h3 className="font-bold text-lg text-zinc-900 mb-4">Resources</h3>
                <div className="space-y-3">
                  {item.pdf && (
                    <>
                      <Button asChild className="w-full justify-start gap-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl h-12">
                        <a href={item.pdf} target="_blank" rel="noopener noreferrer">
                          <FileText className="w-5 h-5 text-zinc-400" /> Open PDF Document
                        </a>
                      </Button>
                      <Button variant="outline" asChild className="w-full justify-start gap-3 rounded-xl h-12">
                        <a href={item.pdf} download>
                          <Download className="w-5 h-5 text-zinc-500" /> Download PDF
                        </a>
                      </Button>
                    </>
                  )}

                  {item.external_link && (
                    <Button variant="ghost" asChild className="w-full justify-start gap-3 rounded-xl h-12 bg-zinc-50 hover:bg-zinc-100">
                      <a href={item.external_link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-5 h-5 text-zinc-500" /> External Link
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Related Products Card */}
            {item.relatedProducts.length > 0 && (
              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                <h3 className="font-bold text-lg text-primary-900 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary" /> Related Products
                </h3>
                <p className="text-sm text-primary-900/70 mb-4">
                  This training is directly related to specific equipment or products.
                </p>
                <div className="space-y-3">
                  {item.relatedProducts.map(productId => (
                    <Button key={productId} variant="default" asChild className="w-full justify-between rounded-xl h-12 bg-white text-primary hover:bg-primary-50 border border-primary/20 shadow-sm">
                      <Link href={`/products/${productId}`}>
                        <span>View Product #{productId}</span>
                        <ChevronRight className="w-4 h-4 opacity-50" />
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
