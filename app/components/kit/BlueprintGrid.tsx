"use client";
import { useEffect, useRef } from "react";

// Чертёжная сетка на canvas: тонкая координатная сетка, узлы вспыхивают
// оранжевым рядом с курсором. Основа «инженерного» фона под hero.
// prefers-reduced-motion: рисуем один статичный кадр без реакции на мышь.

export default function BlueprintGrid({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const GAP = 34;
    const R = 130;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const r = cv.getBoundingClientRect();
      w = r.width;
      h = r.height;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    const onMove = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    cv.addEventListener("mousemove", onMove);
    cv.addEventListener("mouseleave", onLeave);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= w; x += GAP) {
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += GAP) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(w, y + 0.5);
        ctx.stroke();
      }
      for (let x = 0; x <= w; x += GAP) {
        for (let y = 0; y <= h; y += GAP) {
          const d = Math.hypot(x - mouse.x, y - mouse.y);
          if (d < R) {
            const a = 1 - d / R;
            ctx.fillStyle = `rgba(255,90,0,${a * 0.9})`;
            const s = 2 + a * 3;
            ctx.fillRect(x - s / 2, y - s / 2, s, s);
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    if (reduce) draw();
    else raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      cv.removeEventListener("mousemove", onMove);
      cv.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className={className} style={{ width: "100%", height: "100%", display: "block" }} />;
}
