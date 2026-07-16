"use client";
import { useEffect, useRef } from "react";

// Hero-визуал раздела «Материалы»: поле линий, которое непрерывно
// трансформируется — лист → рельеф → двойная кривизна → оболочка.
// Масштаб «дышит»: форма растёт и сжимается. Canvas, 60fps.
// prefers-reduced-motion — статичный кадр.

const LINES = 26;
const SEGS = 90;

// параметры формы: [amp1, freq1, amp2, freq2, twist, envelope, scale]
// twist — сдвиг фазы по линиям (даёт гипар/кручение),
// envelope — выпуклость по вертикали (оболочка), scale — общий масштаб.
type Shape = [number, number, number, number, number, number, number];

const SHAPES: Shape[] = [
  [0.006, 1.0, 0.0, 0.0, 0.0, 0.0, 0.94], // лист — почти плоский
  [0.05, 1.15, 0.012, 3.0, 0.35, 0.1, 1.0], // рельеф — мягкая волна
  [0.075, 0.85, 0.045, 2.2, 1.9, 0.22, 1.12], // двойная кривизна — гипар
  [0.04, 0.6, 0.02, 1.4, 0.7, 0.55, 1.22], // оболочка — выпуклая, крупнее
];

const HOLD = 1.1; // сек удержания формы
const MORPH = 2.6; // сек перехода

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function shapeAt(time: number): Shape {
  const period = HOLD + MORPH;
  const total = SHAPES.length * period;
  const t = ((time % total) + total) % total;
  const i = Math.floor(t / period);
  const local = t - i * period;
  const a = SHAPES[i];
  const b = SHAPES[(i + 1) % SHAPES.length];
  const k = local < HOLD ? 0 : easeInOut((local - HOLD) / MORPH);
  return a.map((v, j) => v + (b[j] - v) * k) as Shape;
}

export default function HeroFormAnim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let W = 0;
    let H = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (ms: number) => {
      const time = ms / 1000;
      const [amp1, freq1, amp2, freq2, twist, env, scale] = shapeAt(time);
      const drift = time * 0.55; // лёгкое течение волны даже в удержании

      ctx.clearRect(0, 0, W, H);
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, "#ff7a2e");
      grad.addColorStop(0.55, "#ff5a00");
      grad.addColorStop(1, "#7a2c00");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.1;

      const cx = W / 2;
      const cy = H / 2;
      const spanY = H * 0.82 * scale;

      for (let li = 0; li < LINES; li++) {
        const v = li / (LINES - 1); // 0..1 по вертикали
        const bell = Math.sin(v * Math.PI); // прозрачность и объём к центру
        // выпуклость оболочки: линии расходятся от центра
        const bulge = env * H * 0.28 * Math.sin(v * Math.PI - Math.PI / 2);
        const baseY = cy + (v - 0.5) * spanY + bulge * 0;

        ctx.globalAlpha = 0.14 + 0.66 * bell;
        ctx.beginPath();
        for (let si = 0; si <= SEGS; si++) {
          const u = si / SEGS; // 0..1 по горизонтали
          const x = cx + (u - 0.5) * W * 1.04 * scale;
          const w1 = Math.sin(u * Math.PI * 2 * freq1 + v * twist * Math.PI + drift);
          const w2 = Math.sin(u * Math.PI * 2 * freq2 - v * twist * 2.4 - drift * 1.4);
          const envelope = Math.sin(u * Math.PI); // гасим к краям
          const y =
            baseY +
            (w1 * amp1 + w2 * amp2) * H * envelope * (0.35 + 0.65 * bell) -
            env * H * 0.16 * envelope * Math.cos(v * Math.PI);
          if (si === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduced) {
      // статичный кадр двойной кривизны
      draw((2 * (HOLD + MORPH) + 0.01) * 1000);
    } else {
      const loop = (ms: number) => {
        draw(ms);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
}
