'use client';

import { useState, useMemo } from 'react';
import { TrainingItem } from '@/lib/training';
import EngineerCard from './EngineerCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TrainingContentLayoutProps {
  initialContent: TrainingItem[];
  title: string;
  description: string;
}

export default function TrainingContentLayout({ initialContent, title, description }: TrainingContentLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('display_order');

  const filteredAndSortedContent = useMemo(() => {
    let result = [...initialContent];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => {
        const titleMatch = (item.title || '').toLowerCase().includes(q);
        const contentMatch = (item.description || '').toLowerCase().includes(q);
        const catMatch = (item.category || '').toLowerCase().includes(q);
        const deptMatch = (item.department || '').toLowerCase().includes(q);
        return titleMatch || contentMatch || catMatch || deptMatch;
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'oldest':
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'display_order':
        default:
          return a.displayOrder - b.displayOrder;
      }
    });

    return result;
  }, [initialContent, searchQuery, sortBy]);

  // Group by Category for Netflix style
  const groupedByCategory = useMemo(() => {
    const groups: Record<string, TrainingItem[]> = {};
    filteredAndSortedContent.forEach(item => {
      const cat = item.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [filteredAndSortedContent]);

  const categories = Object.keys(groupedByCategory).sort();

  return (
    <div className="py-8">
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-end justify-between">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-2">{title}</h1>
          <p className="text-zinc-500 text-lg">{description}</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input 
              type="text" 
              placeholder="Search content..." 
              className="pl-9 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="w-40">
            <Select value={sortBy} onValueChange={(val) => setSortBy(val || 'display_order')}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="display_order">Display Order</SelectItem>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 text-zinc-400 mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">No Training Content Found</h3>
          <p className="text-zinc-500">Try adjusting your search terms or filters.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map(category => (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-zinc-900">{category}</h2>
                <div className="h-px bg-zinc-200 flex-grow"></div>
              </div>
              
              {/* Horizontal Scroll Area (Netflix Style) */}
              <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-6 snap-x">
                {groupedByCategory[category].map(item => (
                  <div key={item.id} className="w-[300px] sm:w-[350px] flex-none snap-start">
                    <EngineerCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
