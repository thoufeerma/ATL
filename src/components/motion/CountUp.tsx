"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

// Counts from 0 to `to` when scrolled into view, using Indian digit grouping (1,00,000).
export default function CountUp({
  to,
  suffix = "",
  duration = 1.8,
  grouping = true,
  className,
}: {
  to: number;
  suffix?: string;
  duration?: number;
  grouping?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const format = (n: number) =>
    (grouping ? Math.round(n).toLocaleString("en-IN") : String(Math.round(n))) + suffix;

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduce) {
      ref.current.textContent = format(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(v);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, to, duration, reduce]);

  // Server render shows the final number, so there is no flash of "0" without JS.
  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {format(to)}
    </span>
  );
}
