"use client";
import { useEffect, useRef } from "react";

/**
 * Шар из точек для карточки «Цифровая среда» (блок «Формула» на главной).
 * Фирменная геометрия без свечения: точки — маленькие квадраты, как узлы и метки айдентики;
 * часть точек — оранжевые узлы. Объём передаётся размером и яркостью по глубине.
 * Под курсором точки окрашиваются в оранжевый. Canvas 2D, рисуется только когда виден.
 */

const N = 820; // точек на сфере
const NODE_SHARE = 0.07; // доля оранжевых узлов
const SPIN = 0.22; // рад/с
const TILT = 0.38; // наклон оси

type Pt = { x: number; y: number; z: number; node: boolean };

function fibonacciSphere(n: number): Pt[] {
  const pts: Pt[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    // детерминированная «случайность» для узлов
    const h = Math.sin(i * 12.9898) * 43758.5453;
    pts.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r, node: h - Math.floor(h) < NODE_SHARE });
  }
  return pts;
}

export default function DotSphere({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pts = fibonacciSphere(N);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let angle = 0.6;
    let last = performance.now();
    const pointer = { x: -9999, y: -9999, inside: false };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // ~60% ширины карточки: при увеличении на hover остаётся воздух по краям
      const R = Math.min(w * 0.29, h * 0.215);
      const cx = w / 2;
      const cy = h * 0.355;
      const ca = Math.cos(angle);
      const sa = Math.sin(angle);
      const ct = Math.cos(TILT);
      const st = Math.sin(TILT);

      // сначала задние точки, потом передние
      const proj = pts.map((p) => {
        const x1 = p.x * ca + p.z * sa;
        const z1 = -p.x * sa + p.z * ca;
        const y2 = p.y * ct - z1 * st;
        const z2 = p.y * st + z1 * ct;
        const persp = 1 / (1.9 - z2 * 0.55);
        return { sx: cx + x1 * R * persp * 1.9, sy: cy + y2 * R * persp * 1.9, z: z2, node: p.node };
      });
      proj.sort((a, b) => a.z - b.z);

      const hoverR = R * 0.42;
      for (const q of proj) {
        const depth = (q.z + 1) / 2; // 0 — дальняя сторона, 1 — ближняя
        let s = (q.node ? 2.6 : 1.5) * (0.55 + 0.75 * depth);
        let near = 0;
        if (pointer.inside && depth > 0.45) {
          const d = Math.hypot(q.sx - pointer.x, q.sy - pointer.y);
          near = Math.max(0, 1 - d / hoverR);
        }
        if (near > 0) s *= 1 + near * 0.6;
        const a = 0.12 + 0.88 * depth * depth;
        if (q.node || near > 0.15) {
          ctx.fillStyle = `rgba(255,90,0,${Math.min(1, a + near * 0.4)})`;
        } else {
          ctx.fillStyle = `rgba(255,255,255,${a * 0.85})`;
        }
        ctx.fillRect(q.sx - s / 2, q.sy - s / 2, s, s);
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      angle += dt * SPIN;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduced || raf || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // курсор слушаем на родителе: поверх канваса лежат текст и ссылка карточки
    const host = canvas.parentElement?.closest("a") ?? canvas.parentElement;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.inside = true;
      if (reduced) draw();
    };
    const onLeave = () => {
      pointer.inside = false;
      if (reduced) draw();
    };
    host?.addEventListener("pointermove", onMove as EventListener);
    host?.addEventListener("pointerleave", onLeave);

    resize();
    start();
    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      host?.removeEventListener("pointermove", onMove as EventListener);
      host?.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
