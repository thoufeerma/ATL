"use client";

import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { useFilterState } from "./FilterProvider";

export function PriceFilter({ bounds }: { bounds: { min: number; max: number } }) {
  const { setParam, removeParam, getParam } = useFilterState();
  const urlMin = getParam("min_price");
  const urlMax = getParam("max_price");

  const defaultMin = urlMin ? parseInt(urlMin, 10) : bounds.min;
  const defaultMax = urlMax ? parseInt(urlMax, 10) : bounds.max;

  const [values, setValues] = useState<number[]>([defaultMin, defaultMax]);
  const [inputMin, setInputMin] = useState(defaultMin.toString());
  const [inputMax, setInputMax] = useState(defaultMax.toString());

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const applyFilters = (min: number, max: number) => {
    if (min > bounds.min) {
      setParam("min_price", min.toString());
    } else {
      removeParam("min_price");
    }

    if (max < bounds.max) {
      setParam("max_price", max.toString());
    } else {
      removeParam("max_price");
    }
  };

  return (
    <div className="pt-4 border-t border-border">
      <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider mb-4">
        Price
      </h4>

      <div className="px-2 mb-6">
        <Slider
          min={bounds.min}
          max={bounds.max}
          step={10}
          value={values}
          onValueChange={handleSliderChange}
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Min (₹)</label>
          <input
            type="number"
            min={bounds.min}
            max={bounds.max}
            value={inputMin}
            onChange={(e) => handleInputChange(0, e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg border border-border bg-white text-sm outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Max (₹)</label>
          <input
            type="number"
            min={bounds.min}
            max={bounds.max}
            value={inputMax}
            onChange={(e) => handleInputChange(1, e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg border border-border bg-white text-sm outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>
    </div>
  );
}
