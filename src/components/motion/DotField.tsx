"use client";

import { useEffect, useRef } from "react";

// A grid of faint dots on a canvas. Dots near the pointer brighten to red and are nudged
// away from it, like a sensor field reacting. It only animates while the pointer moves
// (and settles back afterwards); with reduced motion it stays a still grid.
export default function DotField({
  className,
  gap = 24,
  radius = 150,
}: {
  className?: string;
  gap?: number;
  radius?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let dots: { x: number; y: number; ox: number; oy: number; glow: number }[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    let frame = 0;

    function layout() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      const offsetX = (width % gap) / 2;
      const offsetY = (height % gap) / 2;
      for (let y = offsetY; y < height; y += gap) {
        for (let x = offsetX; x < width; x += gap) dots.push({ x, y, ox: x, oy: y, glow: 0 });
      }
      draw();
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      for (const d of dots) {
        const a = 0.13 + d.glow * 0.75;
        const r = 1 + d.glow * 1.1;
        // White dots that blend to the brand red as they light up.
        const red = Math.round(255 - d.glow * 28);
        const gb = Math.round(255 - d.glow * 245);
        ctx!.fillStyle = `rgba(${red},${gb},${Math.round(gb * 0.95)},${a})`;
        ctx!.beginPath();
        ctx!.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function step() {
      let moving = false;
      for (const d of dots) {
        const dx = d.ox - pointer.x;
        const dy = d.oy - pointer.y;
        const dist = Math.hypot(dx, dy);
        const influence = pointer.active ? Math.max(0, 1 - dist / radius) : 0;
        const push = influence * influence * 10;
        const tx = d.ox + (dist ? (dx / dist) * push : 0);
        const ty = d.oy + (dist ? (dy / dist) * push : 0);
        d.x += (tx - d.x) * 0.18;
        d.y += (ty - d.y) * 0.18;
        d.glow += (influence - d.glow) * 0.15;
        if (Math.abs(tx - d.x) > 0.05 || Math.abs(ty - d.y) > 0.05 || Math.abs(influence - d.glow) > 0.01) moving = true;
      }
      draw();
      frame = moving ? requestAnimationFrame(step) : 0;
    }

    function kick() {
      if (!frame && !reduce) frame = requestAnimationFrame(step);
    }

    // The canvas sits behind content, so listen on its parent section.
    const host = canvas.parentElement ?? canvas;
    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const rect = canvas!.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      kick();
    }
    function onLeave() {
      pointer.active = false;
      kick();
    }

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(canvas);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [gap, radius]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
