"use client";

import { useRef } from "react";

// A soft radial light that follows the cursor across the card.
export default function SpotlightCard({
  children,
  className,
  color = "rgba(227, 6, 19, 0.16)",
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  }

  return (
    <div ref={ref} onPointerMove={onMove} className={`group/spot relative isolate overflow-hidden ${className ?? ""}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${color}, transparent 65%)`,
        }}
      />
      {children}
    </div>
  );
}
