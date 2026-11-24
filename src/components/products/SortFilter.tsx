"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useFilterState } from "./FilterProvider";

const SORT_OPTIONS = [
  { label: "Catalogue order", value: "" }, // Default: WooCommerce menu order
  { label: "Newest first", value: "date-desc" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
  { label: "Name: A to Z", value: "title-asc" },
];

// Sort dropdown for the products toolbar: a styled listbox (arrow keys, Enter, Escape, click outside).
export function SortFilter() {
  const { getParam, setParam, removeParam } = useFilterState();
  const current = getParam("sort") || "";
  const currentIndex = Math.max(0, SORT_OPTIONS.findIndex((o) => o.value === current));

  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(currentIndex);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    setHighlight(currentIndex);
    listRef.current?.focus();
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open, currentIndex]);

  function choose(i: number) {
    const value = SORT_OPTIONS[i].value;
    if (value) setParam("sort", value);
    else removeParam("sort");
    setOpen(false);
    buttonRef.current?.focus();
  }

  function onListKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % SORT_OPTIONS.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + SORT_OPTIONS.length) % SORT_OPTIONS.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setHighlight(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setHighlight(SORT_OPTIONS.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(highlight);
    } else if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
      if (e.key === "Escape") buttonRef.current?.focus();
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={`flex h-11 items-center gap-1.5 rounded-xl border bg-white pl-3.5 pr-3 text-sm transition-colors ${
          open ? "border-secondary/40" : "border-secondary/15 hover:border-secondary/30"
        }`}
      >
        <span className="hidden text-muted-foreground sm:inline">Sort:</span>
        <span className="font-semibold text-secondary">{SORT_OPTIONS[currentIndex].label}</span>
        <ChevronDown className={`ml-0.5 h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-label="Sort products"
            aria-activedescendant={`${listId}-${highlight}`}
            onKeyDown={onListKey}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full z-50 mt-2 w-60 origin-top-right rounded-2xl border border-secondary/10 bg-white p-1.5 shadow-[0_24px_60px_-20px_rgba(18,26,43,0.35)] outline-none"
          >
            {SORT_OPTIONS.map((o, i) => {
              const selected = i === currentIndex;
              return (
                <li
                  key={o.value || "default"}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={selected}
                  onPointerEnter={() => setHighlight(i)}
                  onClick={() => choose(i)}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    i === highlight ? "bg-muted" : ""
                  } ${selected ? "font-semibold text-secondary" : "text-secondary/75"}`}
                >
                  {o.label}
                  {selected && <Check className="h-4 w-4 text-primary" strokeWidth={2.5} />}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
