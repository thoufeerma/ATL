"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useFilterState } from "./FilterProvider";

export function MobileFilterDrawer({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const { clearAll } = useFilterState();

  // Calculate total active filters for the badge
  const activeCount = Array.from(searchParams.keys()).filter(k => 
    !['page', 'sort'].includes(k)
  ).length;

  // Close drawer on path change (or just when applying since applying updates URL)
  // But since we want "Apply" to close it:
  const handleApply = () => {
    setIsOpen(false);
  };

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center gap-2 bg-white border border-border px-4 py-2 rounded-xl shadow-sm text-foreground font-semibold hover:bg-muted transition-colors"
      >
        <Menu className="w-5 h-5" />
        Filters
        {activeCount > 0 && (
          <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative w-full max-w-xs bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-left-full duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border bg-secondary text-white">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Menu className="w-5 h-5" /> Filters
              </h2>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {children}
            </div>

            <div className="p-4 border-t border-border bg-white flex items-center gap-3">
              <button 
                onClick={() => {
                  clearAll();
                }} 
                className="flex-1 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors text-sm"
              >
                Reset
              </button>
              <button 
                onClick={handleApply} 
                className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors text-sm shadow-md"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
