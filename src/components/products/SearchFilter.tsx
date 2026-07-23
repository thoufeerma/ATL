"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (newQuery) {
        params.set("q", newQuery);
      } else {
        params.delete("q");
      }
      
      router.push(`?${params.toString()}`, { scroll: false });
    }, 500);
  };

  return (
    <div className="relative w-full">
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        value={query}
        onChange={handleChange}
        placeholder="Search products..."
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white outline-none focus:ring-2 focus:ring-primary/30 text-sm font-medium"
      />
    </div>
  );
}
