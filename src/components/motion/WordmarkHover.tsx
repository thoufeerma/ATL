"use client";

import { useId, useRef, useState } from "react";

const W = 1200;
const H = 128;

// Giant outlined wordmark. The outline draws in as it scrolls into view, and a red gradient
// lights up the strokes around the cursor.
export default function WordmarkHover({ text, className }: { text: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<SVGSVGElement>(null);
  const [pos, setPos] = useState({ x: W / 2, y: H / 2 });
  const [hover, setHover] = useState(false);

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H });
  }

  const textProps = {
    x: W / 2,
    y: H * 0.8,
    textAnchor: "middle" as const,
    fontSize: 124,
    textLength: W - 8,
    lengthAdjust: "spacing" as const,
    style: { letterSpacing: "0" },
    className: "font-display",
  };

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={text}
      onPointerMove={onMove}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      className={`w-full h-auto select-none ${className ?? ""}`}
    >
      <defs>
        <linearGradient id={`${id}-grad`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={W} y2="0">
          <stop offset="0%" stopColor="#e30613" />
          <stop offset="50%" stopColor="#ff6b5e" />
          <stop offset="100%" stopColor="#e30613" />
        </linearGradient>
        <radialGradient id={`${id}-reveal`} gradientUnits="userSpaceOnUse" r="220" cx={pos.x} cy={pos.y}>
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
        <mask id={`${id}-mask`}>
          <rect x="0" y="0" width={W} height={H} fill={`url(#${id}-reveal)`} />
        </mask>
      </defs>

      {/* Strokes are drawn double width and then half-covered by a solid fill, so only the outer
          outline shows; the font's overlapping inner contours stay hidden. */}
      <text {...textProps} fill="none" stroke="rgba(255,255,255,0.24)" strokeWidth="2" vectorEffect="non-scaling-stroke" className="font-display wordmark-draw">
        {text}
      </text>
      <text
        {...textProps}
        fill="none"
        stroke={`url(#${id}-grad)`}
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
        mask={`url(#${id}-mask)`}
        style={{ letterSpacing: "0", opacity: hover ? 1 : 0, transition: "opacity 300ms" }}
      >
        {text}
      </text>
      <text {...textProps} fill="#0b101a">
        {text}
      </text>
      <text
        {...textProps}
        fill={`url(#${id}-grad)`}
        fillOpacity={0.14}
        mask={`url(#${id}-mask)`}
        style={{ letterSpacing: "0", opacity: hover ? 1 : 0, transition: "opacity 300ms" }}
      >
        {text}
      </text>
    </svg>
  );
}
