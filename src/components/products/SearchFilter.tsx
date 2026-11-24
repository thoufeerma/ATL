"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

// Product search for the toolbar: updates the results as you type (debounced).
export function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Follow the URL (chip removed, "Clear all"), but never overwrite what the visitor is typing.
  useEffect(() => {
    if (document.activeElement === inputRef.current) return;
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // Drop a pending search when leaving the page.
  useEffect(() => () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  }, []);

  function apply(value: string) {
    // Read the URL at apply time: filters may have changed while the visitor was typing.
    const params = new URLSearchParams(window.location.search);
    if (value.trim()) params.set("q", value.trim());
    else params.delete("q");
    params.delete("page");
    router.push(`?${params.toString()}`, { scroll: false });
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => apply(value), 450);
  }

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        apply(query);
      }}
      className="relative flex h-11 w-full items-center rounded-xl border border-secondary/15 bg-white transition-colors focus-within:border-secondary/40 hover:border-secondary/30"
    >
      <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={onChange}
        placeholder="Search products, models or brands…"
        aria-label="Search products"
        className="h-full w-full bg-transparent pl-10 pr-10 text-sm text-secondary outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            setQuery("");
            apply("");
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          className="absolute right-2 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-secondary"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
