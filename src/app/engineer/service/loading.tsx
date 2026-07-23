import Navbar from '@/components/layout/Navbar';
import { ChevronRight } from 'lucide-react';

export default function ServiceLoading() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <Navbar />
      
      <div className="bg-zinc-900 pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-4">
            <span className="w-20 h-4 bg-zinc-800 rounded animate-pulse" />
            <ChevronRight className="w-4 h-4" />
            <span className="w-24 h-4 bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8 space-y-12">
        <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
          <div className="w-full max-w-2xl space-y-3">
            <div className="w-1/3 h-10 bg-zinc-200 rounded-md animate-pulse" />
            <div className="w-2/3 h-6 bg-zinc-200 rounded-md animate-pulse" />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="w-full md:w-64 h-10 bg-zinc-200 rounded-md animate-pulse" />
            <div className="w-40 h-10 bg-zinc-200 rounded-md animate-pulse" />
          </div>
        </div>

        {[1, 2].map(row => (
          <div key={row} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-48 h-8 bg-zinc-200 rounded-md animate-pulse" />
              <div className="h-px bg-zinc-200 flex-grow" />
            </div>
            <div className="flex overflow-hidden gap-6">
              {[1, 2, 3, 4].map(card => (
                <div key={card} className="w-[300px] sm:w-[350px] flex-none h-[400px] bg-white rounded-2xl border border-zinc-200 animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
