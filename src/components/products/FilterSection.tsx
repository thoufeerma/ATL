"use client";

import { useEffect, useId, useState } from "react";
import { ChevronDown } from "lucide-react";

// One collapsible filter group. Opens by itself when it has an active filter, and shows
// how many of its options are selected while closed.
export function FilterSection({
  title,
  activeCount = 0,
  defaultOpen = false,
  children,
}: {
  title: string;
  activeCount?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen || activeCount > 0);
  const id = useId();

  useEffect(() => {
    if (activeCount > 0) setOpen(true);
  }, [activeCount]);

  return (
    <section className="border-t border-border first:border-t-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-2 py-3.5 text-left text-[15px] font-semibold text-secondary outline-none focus-visible:text-primary"
        >
          <span className="flex-1">{title}</span>
          {activeCount > 0 && (
            <span className="rounded-full bg-primary px-1.5 py-px text-[11px] font-bold tabular-nums text-white">{activeCount}</span>
          )}
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
      </h3>
      {/* Height animates via grid rows, so nothing needs measuring */}
      <div
        id={id}
        className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className={`pb-4 ${open ? "" : "invisible"}`}>{children}</div>
        </div>
      </div>
    </section>
  );
}
