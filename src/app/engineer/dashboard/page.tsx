import { cookies } from 'next/headers';
import { getTraining, getLatestTraining } from '@/lib/training';
import { logoutAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { LogOut, BookOpen, Wrench, Clock, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import EngineerCard from '@/components/engineer/EngineerCard';
import Navbar from '@/components/layout/Navbar';

export default async function EngineerDashboard() {
  const cookieStore = await cookies();
  const userName = cookieStore.get('wp_user_display_name')?.value || 'Engineer';

  const [allContent, latestUploadsFull] = await Promise.all([
    getTraining(),
    getLatestTraining(),
  ]);
  
  const salesCount = allContent.filter(c => c.department.toLowerCase() === 'sales').length;
  const serviceCount = allContent.filter(c => c.department.toLowerCase() === 'service').length;

  const latestUploads = latestUploadsFull.slice(0, 8);

  return (
    <main className="min-h-screen bg-zinc-50">
      <Navbar />
      
      <div className="bg-zinc-900 text-white pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-zinc-400 mb-2">Engineer Portal</p>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Welcome, {userName}</h1>
              <p className="text-zinc-300 max-w-2xl">
                Access your personalized training resources, product manuals, and service guides.
              </p>
            </div>
            <form action={logoutAction}>
              <Button type="submit" variant="outline" className="rounded-full bg-white/10 text-white border-white/20 hover:bg-white hover:text-zinc-900 border-none">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Link href="/engineer/sales" className="group block">
            <div className="bg-white rounded-2xl p-8 border border-zinc-200 hover:border-primary hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-3">Sales Training</h2>
              <div className="text-sm font-bold bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full mb-3">
                {salesCount} items
              </div>
              <p className="text-zinc-500 max-w-md">
                Access product brochures, pitch guides, and feature demonstrations for the sales team.
              </p>
            </div>
          </Link>

          <Link href="/engineer/service" className="group block">
            <div className="bg-white rounded-2xl p-8 border border-zinc-200 hover:border-primary hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wrench className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-3">Service Training</h2>
              <div className="text-sm font-bold bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full mb-3">
                {serviceCount} items
              </div>
              <p className="text-zinc-500 max-w-md">
                Find installation manuals, repair guides, and technical specifications for service engineers.
              </p>
            </div>
          </Link>
        </div>

        {/* Latest Uploads */}
        {latestUploads.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-zinc-400" />
              <h2 className="text-2xl font-bold text-zinc-900">Latest Uploads</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestUploads.map(item => (
                <EngineerCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
