import { cookies } from 'next/headers';
import { getRootFolders, getRecentFiles } from '@/lib/explorer';
import { logoutAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { LogOut, Folder, Clock, Search, FolderOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { FolderRow } from '@/components/engineer/explorer/FolderRow';
import { FileRow } from '@/components/engineer/explorer/FileRow';

export default async function EngineerDashboard() {
  const cookieStore = await cookies();
  const userName = cookieStore.get('wp_user_display_name')?.value || 'Engineer';

  const [rootFolders, recentFiles] = await Promise.all([
    getRootFolders(),
    getRecentFiles(5),
  ]);

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
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Continue Browsing */}
          <Link href="/engineer/folder" className="group">
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 hover:border-blue-500 hover:shadow-md transition-all h-full flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FolderOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">Continue Browsing</h3>
                  <p className="text-sm text-zinc-500">Open the file explorer</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </Link>

          {/* Quick Search */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <Search className="w-5 h-5 text-zinc-400" />
              <h3 className="text-lg font-bold text-zinc-900">Quick Search</h3>
            </div>
            <form action="/engineer/search" className="relative block">
              <input 
                type="text" 
                name="q"
                placeholder="Search folders and files..." 
                className="w-full pl-4 pr-12 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                required
              />
              <button type="submit" className="absolute right-3 top-2.5 p-0.5 text-zinc-400 hover:text-blue-500 transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Root Folders */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Folder className="w-5 h-5 text-zinc-400" />
                <h2 className="text-xl font-bold text-zinc-900">Root Folders</h2>
              </div>
              <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
                <div className="flex flex-col">
                  {rootFolders.map(folder => (
                    <FolderRow key={folder.id} folder={folder} currentPath="/engineer/folder" />
                  ))}
                  {rootFolders.length === 0 && (
                    <div className="p-8 text-center text-zinc-500">No root folders found.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Files */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-zinc-400" />
                <h2 className="text-xl font-bold text-zinc-900">Recent Files</h2>
              </div>
              <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
                <div className="flex flex-col">
                  {recentFiles.map(file => (
                    <FileRow key={file.id} file={file} />
                  ))}
                  {recentFiles.length === 0 && (
                    <div className="p-8 text-center text-zinc-500">No recent files found.</div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
              <h3 className="font-bold text-zinc-900 mb-4">Recently Updated</h3>
              <div className="text-sm text-zinc-500">
                Tracking recently modified folders and files will appear here.
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
