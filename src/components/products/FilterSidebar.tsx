"use client";

import { useFilterState } from "./FilterProvider";
import { CategoryNode } from "@/lib/category-data";
import { WooAttribute } from "@/lib/woocommerce-attributes";
import { ChevronRight, ChevronDown, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { GenericAttributeFilter } from "./GenericAttributeFilter";
import { PriceFilter } from "./PriceFilter";
import { SearchFilter } from "./SearchFilter";

import { SortFilter } from "./SortFilter";

export function FilterSidebar({ 
  categoryTree, 
  attributes, 
  priceBounds 
}: { 
  categoryTree: CategoryNode[];
  attributes: WooAttribute[];
  priceBounds: { min: number; max: number };
}) {
  const { getParam, setParam, removeParam, setParams } = useFilterState();
  
  const currentCat = getParam("cat");
  const currentSub = getParam("sub");
  const currentChild = getParam("child");

  // Keep track of which L1 and L2 are expanded
  const [expandedL1, setExpandedL1] = useState<string | null>(currentCat);
  const [expandedL2, setExpandedL2] = useState<string | null>(currentSub);

  // Sync expanded state with URL if changed externally
  useEffect(() => {
    if (currentCat) setExpandedL1(currentCat);
    if (currentSub) setExpandedL2(currentSub);
  }, [currentCat, currentSub]);

  const selectCat = (lvl1: string) => {
    setParams({
      cat: lvl1,
      sub: null,
      child: null
    });
  };

  const selectSub = (lvl1: string, lvl2: string) => {
    setParams({
      cat: lvl1,
      sub: lvl2,
      child: null
    });
  };

  const selectChild = (lvl1: string, lvl2: string, lvl3: string) => {
    setParams({
      cat: lvl1,
      sub: lvl2,
      child: lvl3
    });
  };

  const isSelected = (level: 1 | 2 | 3, slug: string) => {
    if (level === 1) return currentCat === slug && !currentSub && !currentChild;
    if (level === 2) return currentSub === slug && !currentChild;
    if (level === 3) return currentChild === slug;
    return false;
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-6 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-2 mb-2">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-foreground text-lg">Filters</h3>
      </div>

      {/* 1. Category Accordion */}
      <div>
        <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider mb-3">
          Category
        </h4>
        <div className="space-y-1">
          {categoryTree.map((lvl1) => {
            const isL1Expanded = expandedL1 === lvl1.slug;
            const hasL2 = lvl1.children && lvl1.children.length > 0;
            
            return (
              <div key={lvl1.slug} className="flex flex-col">
                <div className="flex items-center w-full group">
                  <button
                    onClick={() => {
                      if (hasL2) {
                        setExpandedL1(isL1Expanded ? null : lvl1.slug);
                        // Auto collapse L2 when collapsing L1
                        if (isL1Expanded) setExpandedL2(null);
                      } else {
                        selectCat(lvl1.slug);
                      }
                    }}
                    className="p-1.5 text-muted-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    {hasL2 ? (
                      isL1Expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                    ) : (
                      <span className="w-4 h-4 block" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setExpandedL1(lvl1.slug);
                      selectCat(lvl1.slug);
                    }}
                    className={`flex-1 text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${isSelected(1, lvl1.slug) ? "text-primary font-bold" : "text-foreground font-semibold hover:bg-muted"}`}
                  >
                    {lvl1.title}
                  </button>
                </div>

                {isL1Expanded && hasL2 && (
                  <div className="pl-6 space-y-1 mt-1 border-l border-muted ml-3">
                    <button
                      onClick={() => {
                        setExpandedL2(null);
                        selectCat(lvl1.slug);
                      }}
                      className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${isSelected(1, lvl1.slug) ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected(1, lvl1.slug) ? "bg-primary" : "bg-muted-foreground"}`} />
                      All {lvl1.title}
                    </button>

                    {lvl1.children!.map((lvl2) => {
                      const isL2Expanded = expandedL2 === lvl2.slug;
                      const hasL3 = lvl2.children && lvl2.children.length > 0;

                      return (
                        <div key={lvl2.slug} className="flex flex-col">
                          <div className="flex items-center w-full group">
                            <button
                              onClick={() => {
                                if (hasL3) {
                                  // Auto collapse other L2 siblings
                                  setExpandedL2(isL2Expanded ? null : lvl2.slug);
                                } else {
                                  selectSub(lvl1.slug, lvl2.slug);
                                }
                              }}
                              className="p-1 text-muted-foreground hover:bg-muted rounded-md transition-colors"
                            >
                              {hasL3 ? (
                                isL2Expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
                              ) : (
                                <span className="w-3.5 h-3.5 block" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setExpandedL2(lvl2.slug);
                                selectSub(lvl1.slug, lvl2.slug);
                              }}
                              className={`flex-1 text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${isSelected(2, lvl2.slug) ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                            >
                              {lvl2.title}
                            </button>
                          </div>

                          {isL2Expanded && hasL3 && (
                            <div className="pl-5 space-y-1 mt-1 mb-1">
                              <button
                                onClick={() => selectSub(lvl1.slug, lvl2.slug)}
                                className={`flex items-center gap-2 w-full text-left px-2 py-1 rounded-lg text-sm transition-colors ${isSelected(2, lvl2.slug) ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                              >
                                <div className={`w-1.5 h-1.5 rounded-full ${isSelected(2, lvl2.slug) ? "bg-primary" : "border border-muted-foreground"}`} />
                                All {lvl2.title}
                              </button>

                              {lvl2.children!.map((lvl3) => (
                                <button
                                  key={lvl3.slug}
                                  onClick={() => selectChild(lvl1.slug, lvl2.slug, lvl3.slug)}
                                  className={`flex items-center gap-2 w-full text-left px-2 py-1 rounded-lg text-sm transition-colors ${isSelected(3, lvl3.slug) ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                                >
                                  <div className={`w-1.5 h-1.5 rounded-full ${isSelected(3, lvl3.slug) ? "bg-primary" : "border border-transparent"}`} />
                                  {lvl3.title}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Search */}
      <div className="pt-4 border-t border-border">
        <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider mb-3">
          Search
        </h4>
        <SearchFilter />
      </div>

      {/* 3. Dynamic Attribute Filters (Brand, Capacity, etc.) */}
      {attributes.map(attr => (
        <GenericAttributeFilter key={attr.id} attribute={attr} />
      ))}

      {/* 4. Price Filter */}
      {priceBounds.min < priceBounds.max && (
        <PriceFilter bounds={priceBounds} />
      )}

      {/* 5. Sort Filter */}
      <SortFilter />
    </div>
  );
}
