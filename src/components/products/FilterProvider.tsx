"use client";

import { createContext, useContext, ReactNode, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterContextType {
  setParam: (key: string, value: string) => void;
  setParams: (updates: Record<string, string | null>) => void;
  removeParam: (key: string) => void;
  toggleMultiParam: (key: string, value: string) => void;
  clearAll: () => void;
  getParam: (key: string) => string | null;
  getMultiParam: (key: string) => string[];
  isActive: (key: string, value: string) => boolean;
}

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateUrl = useCallback((params: URLSearchParams) => {
    // We use scroll: false to prevent jumping to the top of the page on filter click
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router]);

  const setParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    updateUrl(params);
  }, [searchParams, updateUrl]);

  const setParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    updateUrl(params);
  }, [searchParams, updateUrl]);

  const removeParam = useCallback((key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    updateUrl(params);
  }, [searchParams, updateUrl]);

  // For multi-select attributes (e.g. capacity=5kg,10kg)
  const toggleMultiParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(key);
    
    if (!current) {
      params.set(key, value);
    } else {
      const values = current.split(",");
      if (values.includes(value)) {
        const newValues = values.filter(v => v !== value);
        if (newValues.length > 0) {
          params.set(key, newValues.join(","));
        } else {
          params.delete(key);
        }
      } else {
        params.set(key, [...values, value].join(","));
      }
    }
    updateUrl(params);
  }, [searchParams, updateUrl]);

  const clearAll = useCallback(() => {
    updateUrl(new URLSearchParams());
  }, [updateUrl]);

  const getParam = useCallback((key: string) => {
    return searchParams.get(key);
  }, [searchParams]);

  const getMultiParam = useCallback((key: string) => {
    const current = searchParams.get(key);
    return current ? current.split(",") : [];
  }, [searchParams]);

  const isActive = useCallback((key: string, value: string) => {
    const values = getMultiParam(key);
    return values.includes(value);
  }, [getMultiParam]);

  return (
    <FilterContext.Provider
      value={{
        setParam,
        setParams,
        removeParam,
        toggleMultiParam,
        clearAll,
        getParam,
        getMultiParam,
        isActive
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterState() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilterState must be used within a FilterProvider");
  }
  return context;
}
