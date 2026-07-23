import { getTrainingByDepartment } from '@/lib/training';
import TrainingContentLayout from '@/components/engineer/TrainingContentLayout';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default async function SalesTrainingPage() {
  const salesContent = await getTrainingByDepartment('Sales');

  return (
    <main className="min-h-screen bg-zinc-50">
      <Navbar />
      
      <div className="bg-zinc-900 text-white pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-4">
            <Link href="/engineer/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-semibold">Sales Training</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <TrainingContentLayout 
          initialContent={salesContent} 
          title="Sales Training" 
          description="Browse and search all sales-related training materials, brochures, and pitch guides."
        />
      </div>
    </main>
  );
}
