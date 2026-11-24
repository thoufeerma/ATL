"use client";

import { useSearchParams } from "next/navigation";
import { useFilterState } from "./FilterProvider";
import { X } from "lucide-react";
import { WooAttribute } from "@/lib/woocommerce-attributes";
import { formatINR } from "@/lib/product-utils";

export function ActiveFiltersGrouped({ attributes, categoryLabel }: { attributes: WooAttribute[]; categoryLabel?: string | null }) {
  const searchParams = useSearchParams();
  const { removeParam, setParams, toggleMultiParam, clearAll } = useFilterState();

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
    <div className="mb-5 flex flex-wrap items-center gap-2">
      
      {/* Search */}
      {q && (
        <div className="flex items-center gap-1.5 rounded-full border border-secondary/15 bg-white py-1 pl-3 pr-1.5 text-sm font-medium text-secondary">
          <span className="text-muted-foreground font-normal">Search</span> {q}
          <button onClick={() => removeParam("q")} aria-label={`Remove search "${q}"`} className="ml-0.5 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-secondary">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Category */}
      {activeCat && (
        <div className="flex items-center gap-1.5 rounded-full border border-secondary/15 bg-white py-1 pl-3 pr-1.5 text-sm font-medium text-secondary">
          <span className="text-muted-foreground font-normal">Category</span> 
          {categoryLabel || activeChild || activeSub || activeCat}
          <button onClick={() => setParams({ cat: null, sub: null, child: null })} aria-label="Remove category filter" className="ml-0.5 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-secondary">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Price */}
      {(minPrice || maxPrice) && (
        <div className="flex items-center gap-1.5 rounded-full border border-secondary/15 bg-white py-1 pl-3 pr-1.5 text-sm font-medium text-secondary">
          <span className="text-muted-foreground font-normal">Price</span> 
          {formatINR(Number(minPrice) || 0)} – {maxPrice ? formatINR(Number(maxPrice)) : "Any"}
          <button onClick={() => setParams({ min_price: null, max_price: null })} aria-label="Remove price filter" className="ml-0.5 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-secondary">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Dynamic Attributes */}
      {activeAttributes.map((attr, idx) => (
        <div key={`${attr.slug}-${idx}`} className="flex items-center gap-1.5 rounded-full border border-secondary/15 bg-white py-1 pl-3 pr-1.5 text-sm font-medium text-secondary">
          <span className="text-muted-foreground font-normal">{attr.label}</span> {attr.value}
          <button onClick={() => toggleMultiParam(attr.slug, attr.termSlug)} aria-label={`Remove ${attr.label} ${attr.value}`} className="ml-0.5 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-secondary">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}

      {/* Clear All */}
      <button 
        onClick={clearAll}
        className="ml-1 text-sm font-semibold text-primary hover:underline underline-offset-4"
      >
        Clear all
      </button>
    </div>
  );
}
