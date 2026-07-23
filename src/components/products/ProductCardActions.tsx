"use client";

import { useState } from "react";
import { Heart, BarChart2 } from "lucide-react";

export function ProductCardActions({ productId }: { productId: number }) {
  // Normally you would sync this state with localStorage or a context/Zustand store
  // For now, keeping it localized to demonstrate the client boundary
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCompared, setIsCompared] = useState(false);

  return (
    <div className="absolute top-3 right-3 flex gap-2">
      <button
        onClick={() => setIsWishlisted(!isWishlisted)}
        className={`w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-colors ${isWishlisted ? "bg-primary border-primary text-white" : "bg-white/80 border-white/50 text-foreground hover:bg-primary hover:text-white"}`}
      >
        <Heart className="w-4 h-4" />
      </button>
      <button
        onClick={() => setIsCompared(!isCompared)}
        className={`w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-colors ${isCompared ? "bg-primary border-primary text-white" : "bg-white/80 border-white/50 text-foreground hover:bg-primary hover:text-white"}`}
      >
        <BarChart2 className="w-4 h-4" />
      </button>
    </div>
  );
}
