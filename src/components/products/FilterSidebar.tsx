"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useFilterState, countActiveFilters } from "./FilterProvider";
import { FilterSection } from "./FilterSection";
import { GenericAttributeFilter } from "./GenericAttributeFilter";
import { PriceFilter } from "./PriceFilter";
import type { CategoryNode } from "@/lib/category-data";
import type { WooAttribute, FacetCounts } from "@/lib/woocommerce-attributes";

// Filters only: category, attributes and price, each in a collapsible section.
// Search and sort live in the toolbar above the products.
export function FilterSidebar({
  categoryTree,
  attributes,
  facets,
  priceBounds,
  bare = false,
}: {
  categoryTree: CategoryNode[];
  attributes: WooAttribute[];
  facets?: FacetCounts;
  priceBounds: { min: number; max: number };
  /** Without the card frame and header (used inside the phone drawer). */
  bare?: boolean;
}) {
  const { getParam, setParams, clearFilters } = useFilterState();
  const searchParams = useSearchParams();

  const currentCat = getParam("cat");
  const currentSub = getParam("sub");
  const currentChild = getParam("child");
  const activeFilters = countActiveFilters(new URLSearchParams(searchParams.toString()));

  const [expandedL1, setExpandedL1] = useState<string | null>(currentCat);
  const [expandedL2, setExpandedL2] = useState<string | null>(currentSub);
  useEffect(() => {
    if (currentCat) setExpandedL1(currentCat);
    if (currentSub) setExpandedL2(currentSub);
  }, [currentCat, currentSub]);

  const select = (cat: string | null, sub: string | null = null, child: string | null = null) => setParams({ cat, sub, child });
  const isSelected = (level: 1 | 2 | 3, slug: string) =>
    level === 1 ? currentCat === slug && !currentSub && !currentChild : level === 2 ? currentSub === slug && !currentChild : currentChild === slug;

  const row = (on: boolean) =>
    `flex-1 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
      on ? "bg-primary/[0.08] font-semibold text-primary" : "text-secondary/80 hover:bg-muted/70 hover:text-secondary"
    }`;

  const body = (
    <>
      <FilterSection title="Category" activeCount={currentCat ? 1 : 0} defaultOpen>
        <ul className="space-y-0.5">
          <li>
            <button type="button" onClick={() => select(null)} className={`w-full ${row(!currentCat)}`}>
              All products
            </button>
          </li>
          {categoryTree.map((l1) => {
            const open = expandedL1 === l1.slug;
            const kids = l1.children ?? [];
            return (
              <li key={l1.slug}>
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedL1(l1.slug);
                      select(l1.slug);
                    }}
                    className={`${row(isSelected(1, l1.slug))} ${currentCat === l1.slug && !isSelected(1, l1.slug) ? "font-semibold text-secondary" : "font-medium"}`}
                  >
                    {l1.title}
                  </button>
                  {kids.length > 0 && (
                    <button
                      type="button"
                      aria-label={open ? `Hide ${l1.title} ranges` : `Show ${l1.title} ranges`}
                      aria-expanded={open}
                      onClick={() => setExpandedL1(open ? null : l1.slug)}
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-secondary"
                    >
                      <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
                    </button>
                  )}
                </div>

                {open && kids.length > 0 && (
                  <ul className="mb-1 ml-3 mt-0.5 space-y-0.5 border-l border-border pl-2">
                    {kids.map((l2) => {
                      const grandKids = l2.children ?? [];
                      const open2 = expandedL2 === l2.slug;
                      return (
                        <li key={l2.slug}>
                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                setExpandedL2(l2.slug);
                                select(l1.slug, l2.slug);
                              }}
                              className={row(isSelected(2, l2.slug))}
                            >
                              {l2.title}
                            </button>
                            {grandKids.length > 0 && (
                              <button
                                type="button"
                                aria-label={open2 ? `Hide ${l2.title} types` : `Show ${l2.title} types`}
                                aria-expanded={open2}
                                onClick={() => setExpandedL2(open2 ? null : l2.slug)}
                                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
                              >
                                <ChevronRight className={`h-3.5 w-3.5 transition-transform duration-200 ${open2 ? "rotate-90" : ""}`} />
                              </button>
                            )}
                          </div>
                          {open2 && grandKids.length > 0 && (
                            <ul className="ml-3 space-y-0.5 border-l border-border pl-2">
                              {grandKids.map((l3) => (
                                <li key={l3.slug}>
                                  <button
                                    type="button"
                                    onClick={() => select(l1.slug, l2.slug, l3.slug)}
                                    className={`w-full ${row(isSelected(3, l3.slug))}`}
                                  >
                                    {l3.title}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </FilterSection>

      {attributes.map((attr) => (
        <GenericAttributeFilter key={attr.id} attribute={attr} counts={facets?.[attr.slug]} />
      ))}

      {priceBounds.min < priceBounds.max && <PriceFilter key={`${priceBounds.min}-${priceBounds.max}`} bounds={priceBounds} />}
    </>
  );

  if (bare) return <div>{body}</div>;

  return (
    <div className="flex max-h-[calc(100vh-7rem)] flex-col rounded-2xl border border-secondary/10 bg-white">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="font-semibold text-secondary">
          Filters
          {activeFilters > 0 && <span className="ml-2 text-sm font-normal text-muted-foreground">{activeFilters} active</span>}
        </h2>
        {activeFilters > 0 && (
          <button type="button" onClick={clearFilters} className="text-sm font-semibold text-primary hover:underline underline-offset-4">
            Clear all
          </button>
        )}
      </div>
      {/* Scrolls on its own, so every filter is reachable without scrolling the page */}
      <div className="thin-scrollbar flex-1 overflow-y-auto overscroll-contain px-5">{body}</div>
    </div>
  );
}
