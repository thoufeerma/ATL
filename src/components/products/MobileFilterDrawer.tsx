"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useFilterState, countActiveFilters } from "./FilterProvider";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

// Phone and tablet filters: a button in the toolbar opens a full-height drawer.
export function MobileFilterDrawer({ children, resultCount }: { children: React.ReactNode; resultCount: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const { clearFilters } = useFilterState();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const activeCount = countActiveFilters(new URLSearchParams(searchParams.toString()));

  // While open: lock page scroll, move focus in and keep Tab inside, close on Escape or when the
  // screen becomes wide enough for the sidebar (e.g. a tablet rotated to landscape).
  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const trigger = triggerRef.current;
    root.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setIsOpen(false);
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null && !el.closest(".invisible"),
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = () => wide.matches && setIsOpen(false);

    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      trigger?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="flex h-11 flex-shrink-0 items-center gap-2 rounded-xl border border-secondary/15 bg-white px-3.5 text-sm font-semibold text-secondary transition-colors hover:border-secondary/30 lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {activeCount > 0 && (
          <span className="rounded-full bg-primary px-1.5 py-px text-[11px] font-bold tabular-nums text-white">{activeCount}</span>
        )}
      </button>

      {/* Portalled to <body>: the toolbar's backdrop blur would otherwise trap this fixed panel inside it. */}
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex" role="dialog" aria-modal="true" aria-label="Filters">
            <div className="absolute inset-0 bg-[#080c15]/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

            <div
              ref={panelRef}
              className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-2xl animate-in slide-in-from-left-full duration-300"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h2 className="text-lg font-semibold text-secondary">
                  Filters
                  {activeCount > 0 && <span className="ml-2 text-sm font-normal text-muted-foreground">{activeCount} active</span>}
                </h2>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close filters"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-secondary hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="thin-scrollbar flex-1 overflow-y-auto overscroll-contain px-5">{children}</div>

              <div className="flex items-center gap-3 border-t border-border p-4">
                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={activeCount === 0}
                  className="h-12 rounded-full border border-secondary/15 px-5 text-sm font-semibold text-secondary transition-colors hover:bg-muted disabled:opacity-40"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="h-12 flex-1 rounded-full bg-primary text-sm font-semibold text-white transition-colors hover:bg-[#c00510]"
                >
                  Show {resultCount} {resultCount === 1 ? "product" : "products"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
