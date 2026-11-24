"use client";

import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { useFilterState } from "./FilterProvider";
import { FilterSection } from "./FilterSection";

export function PriceFilter({ bounds }: { bounds: { min: number; max: number } }) {
  const { setParams, getParam } = useFilterState();
  const urlMin = getParam("min_price");
  const urlMax = getParam("max_price");

  const defaultMin = urlMin ? parseInt(urlMin, 10) : bounds.min;
  const defaultMax = urlMax ? parseInt(urlMax, 10) : bounds.max;

  const [values, setValues] = useState<number[]>([defaultMin, defaultMax]);
  const [inputMin, setInputMin] = useState(defaultMin.toString());
  const [inputMax, setInputMax] = useState(defaultMax.toString());

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Follow external URL changes (chip removed, "Clear All", category switch) without
  // remounting, so the inputs keep focus while the user is typing.
  useEffect(() => {
    if (document.activeElement?.closest("[data-price-filter]")) return;
    setValues([defaultMin, defaultMax]);
    setInputMin(defaultMin.toString());
    setInputMax(defaultMax.toString());
  }, [defaultMin, defaultMax]);

  // Sync inputs when slider changes
  const handleSliderChange = (newValues: number | readonly number[]) => {
    const vals = Array.isArray(newValues) || (newValues as any)?.length !== undefined ? [...(newValues as number[])] : [newValues as number, newValues as number];
    setValues(vals);
    setInputMin(vals[0].toString());
    setInputMax(vals[1].toString());

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      applyFilters(vals[0], vals[1]);
    }, 500);
  };

  // Sync slider when inputs change
  const handleInputChange = (index: 0 | 1, val: string) => {
    if (index === 0) setInputMin(val);
    else setInputMax(val);
    
    const numVal = parseInt(val, 10);
    if (!isNaN(numVal)) {
      const newValues = [...values];
      newValues[index] = numVal;
      // Ensure min doesn't exceed max, etc.
      if (index === 0 && numVal > newValues[1]) newValues[1] = numVal;
      if (index === 1 && numVal < newValues[0]) newValues[0] = numVal;
      
      setValues(newValues);

      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        applyFilters(newValues[0], newValues[1]);
      }, 500);
    }
  };

  // One URL update for both values (two separate updates would overwrite each other).
  const applyFilters = (min: number, max: number) => {
    setParams({
      min_price: min > bounds.min ? min.toString() : null,
      max_price: max < bounds.max ? max.toString() : null,
    });
  };

  return (
    <FilterSection title="Price" activeCount={urlMin || urlMax ? 1 : 0}>
      <div data-price-filter>
        <div className="mb-5 px-2 pt-2">
          <Slider min={bounds.min} max={bounds.max} step={10} value={values} onValueChange={handleSliderChange} />
        </div>

        <div className="flex items-center gap-2">
          <label className="flex-1">
            <span className="mb-1 block text-xs text-muted-foreground">Min</span>
            <span className="flex items-center rounded-lg border border-border bg-white px-2.5 focus-within:border-secondary/40">
              <span className="text-sm text-muted-foreground">₹</span>
              <input
                type="number"
                min={bounds.min}
                max={bounds.max}
                value={inputMin}
                aria-label="Minimum price"
                onChange={(e) => handleInputChange(0, e.target.value)}
                className="w-full bg-transparent px-1.5 py-2 text-sm tabular-nums outline-none"
              />
            </span>
          </label>
          <span aria-hidden className="mt-5 text-muted-foreground">–</span>
          <label className="flex-1">
            <span className="mb-1 block text-xs text-muted-foreground">Max</span>
            <span className="flex items-center rounded-lg border border-border bg-white px-2.5 focus-within:border-secondary/40">
              <span className="text-sm text-muted-foreground">₹</span>
              <input
                type="number"
                min={bounds.min}
                max={bounds.max}
                value={inputMax}
                aria-label="Maximum price"
                onChange={(e) => handleInputChange(1, e.target.value)}
                className="w-full bg-transparent px-1.5 py-2 text-sm tabular-nums outline-none"
              />
            </span>
          </label>
        </div>
      </div>
    </FilterSection>
  );
}
