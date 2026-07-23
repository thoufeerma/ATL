"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function BrandFilter({ brands }: { brands: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentBrand = searchParams.get("brand") || "All";

  const handleSelect = (b: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (b === "All") {
      params.delete("brand");
    } else {
      params.set("brand", b);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (brands.length <= 1) return null; // No need to show brand filter if only "All" or 1 brand exists

  return (
    <div>
      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Brand</h4>
      <div className="space-y-2">
        {brands.map((b: string) => (
          <button
            key={b}
            onClick={() => handleSelect(b)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentBrand === b ? "bg-primary text-white" : "text-foreground hover:bg-muted"}`}
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  );
}
