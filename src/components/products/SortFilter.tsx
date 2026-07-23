"use client";

import { useFilterState } from "./FilterProvider";

const SORT_OPTIONS = [
  { label: "Featured", value: "" }, // Default/empty
  { label: "Newest", value: "date-desc" },
  { label: "Price Low → High", value: "price-asc" },
  { label: "Price High → Low", value: "price-desc" },
  { label: "Name A → Z", value: "title-asc" },
];

export function SortFilter() {
  const { getParam, setParam, removeParam } = useFilterState();
  const currentSort = getParam("sort") || "";

  const handleSort = (val: string) => {
    if (!val) {
      removeParam("sort");
    } else {
      setParam("sort", val);
    }
  };

  return (
    <div className="pt-4 border-t border-border">
      <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider mb-3">
        Sort By
      </h4>
      <div className="space-y-1.5">
        {SORT_OPTIONS.map((opt) => {
          const isActive = currentSort === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => handleSort(opt.value)}
              className="flex items-center gap-3 w-full text-left group"
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors border ${isActive ? "border-primary bg-white" : "border-muted-foreground/40 bg-white group-hover:border-primary/50"}`}>
                {isActive && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <span className={`text-sm ${isActive ? "text-primary font-semibold" : "text-muted-foreground group-hover:text-foreground"}`}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
