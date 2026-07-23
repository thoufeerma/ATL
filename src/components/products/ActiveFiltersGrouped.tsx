"use client";

import { useSearchParams } from "next/navigation";
import { useFilterState } from "./FilterProvider";
import { X } from "lucide-react";
import { WooAttribute } from "@/lib/woocommerce-attributes";

export function ActiveFiltersGrouped({ attributes }: { attributes: WooAttribute[] }) {
  const searchParams = useSearchParams();
  const { removeParam, toggleMultiParam, clearAll } = useFilterState();

  // Determine active filters
  const activeCat = searchParams.get("cat");
  const activeSub = searchParams.get("sub");
  const activeChild = searchParams.get("child");
  const q = searchParams.get("q");
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");

  // Identify dynamic attributes
  const activeAttributes: { label: string; slug: string; value: string, termSlug: string }[] = [];
  attributes.forEach(attr => {
    const val = searchParams.get(attr.slug);
    if (val) {
      val.split(",").forEach(v => {
        const term = attr.terms.find(t => t.slug === v);
        activeAttributes.push({
          label: attr.name,
          slug: attr.slug,
          value: term ? term.name : v,
          termSlug: v
        });
      });
    }
  });

  const hasAnyFilter = activeCat || q || minPrice || maxPrice || activeAttributes.length > 0;

  if (!hasAnyFilter) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-white rounded-2xl border border-border shadow-sm">
      <span className="text-sm font-semibold text-foreground mr-2">Active Filters:</span>
      
      {/* Search */}
      {q && (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
          <span className="text-xs text-primary/70 uppercase">Search:</span> {q}
          <button onClick={() => removeParam("q")} className="hover:bg-primary/20 rounded-full p-0.5 ml-1 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Category */}
      {activeCat && (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
          <span className="text-xs text-primary/70 uppercase">Category:</span> 
          {activeChild || activeSub || activeCat}
          <button onClick={() => { removeParam("cat"); removeParam("sub"); removeParam("child"); }} className="hover:bg-primary/20 rounded-full p-0.5 ml-1 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Price */}
      {(minPrice || maxPrice) && (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
          <span className="text-xs text-primary/70 uppercase">Price:</span> 
          ₹{minPrice || "0"} – ₹{maxPrice || "Any"}
          <button onClick={() => { removeParam("min_price"); removeParam("max_price"); }} className="hover:bg-primary/20 rounded-full p-0.5 ml-1 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Dynamic Attributes */}
      {activeAttributes.map((attr, idx) => (
        <div key={`${attr.slug}-${idx}`} className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
          <span className="text-xs text-primary/70 uppercase">{attr.label}:</span> {attr.value}
          <button onClick={() => toggleMultiParam(attr.slug, attr.termSlug)} className="hover:bg-primary/20 rounded-full p-0.5 ml-1 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}

      {/* Clear All */}
      <button 
        onClick={clearAll}
        className="text-sm font-semibold text-muted-foreground hover:text-foreground underline underline-offset-4 ml-auto"
      >
        Clear All
      </button>
    </div>
  );
}
