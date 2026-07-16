"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Technical crosshair guides scoped to the PARENT element (drop it as the first
 * child of any `relative` section). Vertical + horizontal hairlines, a ring and
 * live local X/Y coordinates trail the cursor while it's over that section.
 * mix-blend-difference keeps it legible; desktop / fine-pointer only.
 */
export default function CursorGuides() {
  const rootRef = useRef<HTMLDivElement>(null);
  const v = useRef<HTMLDivElement>(null);
  const h = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const root = rootRef.current;
    const parent = root?.parentElement;
    if (!root || !parent) return;
    setOn(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const t = { x: 0, y: 0 };
    const c = { x: 0, y: 0 };
    let raf = 0;
    let visible = false;

    const move = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect();
      t.x = e.clientX - r.left;
      t.y = e.clientY - r.top;
      if (!visible) {
        visible = true;
        root.style.opacity = "1";
      }
    };
    const leave = () => {
      visible = false;
      root.style.opacity = "0";
    };

    const tick = () => {
      raf = 0;
      const k = reduced ? 1 : 0.2;
      c.x += (t.x - c.x) * k;
      c.y += (t.y - c.y) * k;
      const rx = Math.round(c.x);
      const ry = Math.round(c.y);
      if (v.current) v.current.style.transform = `translateX(${rx}px)`;
      if (h.current) h.current.style.transform = `translateY(${ry}px)`;
      if (dot.current) dot.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      if (label.current) {
        label.current.style.transform = `translate(${rx + 16}px, ${ry + 16}px)`;
        label.current.textContent = `X ${String(Math.round(t.x)).padStart(4, "0")}  Y ${String(Math.round(t.y)).padStart(4, "0")}`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    parent.addEventListener("mousemove", move, { passive: true });
    parent.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      parent.removeEventListener("mousemove", move);
      parent.removeEventListener("mouseleave", leave);
    };
  }, []);

  if (!on) return null;
  return (
    <div
      ref={rootRef}
      className="absolute inset-0 pointer-events-none z-30 hidden md:block overflow-hidden"
      style={{ mixBlendMode: "difference", opacity: 0, transition: "opacity 0.3s ease" }}
      aria-hidden
    >
      <div ref={v} className="absolute top-0 left-0 h-full" style={{ width: 1, background: "rgba(255,255,255,0.5)" }} />
      <div ref={h} className="absolute top-0 left-0 w-full" style={{ height: 1, background: "rgba(255,255,255,0.5)" }} />
      <div ref={dot} className="absolute top-0 left-0" style={{ width: 7, height: 7, border: "1px solid #fff", borderRadius: "50%" }} />
      <div
        ref={label}
        className="absolute top-0 left-0 font-mono"
        style={{ color: "rgba(255,255,255,0.85)", fontSize: 9, letterSpacing: "0.18em", whiteSpace: "nowrap" }}
      />
    </div>
  );
}
