'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function EngineerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-zinc-200">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Something went wrong</h2>
          <p className="text-zinc-500 mb-8">
            {error.message || 'An unexpected error occurred while loading this page.'}
          </p>
          <Button 
            onClick={() => reset()} 
            className="w-full rounded-full h-12 text-lg font-bold"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Try again
          </Button>
        </div>
      </div>
    </main>
  );
}
