"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useFilterState } from "./FilterProvider";
import { FilterSection } from "./FilterSection";
import { WooAttribute } from "@/lib/woocommerce-attributes";

const PREVIEW = 6;

export function GenericAttributeFilter({
  attribute,
  counts,
}: {
  attribute: WooAttribute;
  counts?: Record<string, number>;
}) {
  const { toggleMultiParam, isActive } = useFilterState();
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Only offer options that exist in the current results (selected ones always stay visible),
  // with the selected ones first.
  const available = (attribute.terms ?? [])
    .map((t) => ({ ...t, count: counts ? counts[t.slug] ?? 0 : t.count, checked: isActive(attribute.slug, t.slug) }))
    .filter((t) => t.count > 0 || t.checked)
    .sort((a, b) => Number(b.checked) - Number(a.checked));

  if (available.length === 0) return null;

  const activeCount = available.filter((t) => t.checked).length;
  const matching = available.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));
  const shown = showAll || search ? matching : matching.slice(0, PREVIEW);
  const hidden = matching.length - shown.length;

  return (
    <FilterSection title={attribute.name} activeCount={activeCount}>
      <fieldset>
        <legend className="sr-only">{attribute.name}</legend>

        {showAll && available.length > 10 && (
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Find a ${attribute.name.toLowerCase()}…`}
              aria-label={`Search ${attribute.name}`}
              className="w-full rounded-lg border border-border bg-muted/40 py-2 pl-9 pr-3 text-sm outline-none focus:border-secondary/40"
            />
          </div>
        )}

        <div className="space-y-0.5">
          {shown.map((term) => (
            <label
              key={term.id}
              className="group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/70 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/40"
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={term.checked}
                onChange={() => toggleMultiParam(attribute.slug, term.slug)}
              />
              <span
                aria-hidden
                className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
                  term.checked ? "border-primary bg-primary" : "border-secondary/25 bg-white group-hover:border-secondary/50"
                }`}
              >
                {term.checked && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className={`flex-1 text-sm ${term.checked ? "font-medium text-secondary" : "text-secondary/75 group-hover:text-secondary"}`}>
                {term.name}
              </span>
              <span className="text-xs tabular-nums text-muted-foreground">{term.count}</span>
            </label>
          ))}
          {matching.length === 0 && <p className="py-2 text-center text-xs text-muted-foreground">No matches.</p>}
        </div>

        {(hidden > 0 || (showAll && available.length > PREVIEW)) && (
          <button
            type="button"
            onClick={() => {
              setShowAll((s) => !s);
              setSearch("");
            }}
            className="mt-2 px-2 text-sm font-semibold text-primary hover:underline underline-offset-4"
          >
            {showAll ? "Show less" : `Show all ${available.length}`}
          </button>
        )}
      </fieldset>
    </FilterSection>
  );
}
