"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useFilterState } from "./FilterProvider";
import { WooAttribute } from "@/lib/woocommerce-attributes";

export function GenericAttributeFilter({ attribute }: { attribute: WooAttribute }) {
  const { toggleMultiParam, isActive } = useFilterState();
  const [search, setSearch] = useState("");

  if (!attribute.terms || attribute.terms.length === 0) return null;

  const showSearch = attribute.terms.length > 8;
  const filteredTerms = attribute.terms.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-4 border-t border-border">
      <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider mb-3">
        {attribute.name}
      </h4>
      
      {showSearch && (
        <div className="relative mb-3">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${attribute.name}...`}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-muted/30 text-xs outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      )}

      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
        {filteredTerms.map((term) => {
          const checked = isActive(attribute.slug, term.slug);
          return (
            <label
              key={term.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checked ? "bg-primary border-primary" : "border-muted-foreground/30 group-hover:border-primary/50 bg-white"}`}>
                {checked && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm flex-1 ${checked ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"}`}>
                {term.name}
              </span>
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                {term.count}
              </span>
            </label>
          );
        })}
        {filteredTerms.length === 0 && (
          <p className="text-xs text-muted-foreground py-2 text-center">No options found.</p>
        )}
      </div>
    </div>
  );
}
