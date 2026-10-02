"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { HologramLayout, PointerState } from "./HeroHologramScene";

// three.js и пост-обработка — только на клиенте и отдельным чанком
const HeroHologramScene = dynamic(() => import("./HeroHologramScene"), { ssr: false });

/**
 * Фон героблока «Цифровая среда»: голограмма мастер-модели в духе HUD.
 * Курсор слушаем на window — текст героя лежит поверх канваса и перехватил бы события.
 */
export default function HeroHologram({ layout = "hero" }: { layout?: HologramLayout }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const pointer = useRef<PointerState>({ x: 0, y: 0, inside: false, speed: 0, clicks: 0, fine: false });

  const [active, setActive] = useState(true);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: "120px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const p = pointer.current;
    p.fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let lastX = 0;
    let lastY = 0;
    let lastT = performance.now();
    let isMouse = false;

    const update = (cx: number, cy: number) => {
      const el = boxRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      p.x = ((cx - r.left) / r.width) * 2 - 1;
      p.y = -(((cy - r.top) / r.height) * 2 - 1);
      p.inside = isMouse && Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1;
    };
    const onMove = (e: PointerEvent) => {
      isMouse = e.pointerType === "mouse";
      const now = performance.now();
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      p.speed = Math.min(3, dist / Math.max(8, now - lastT));
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
      update(e.clientX, e.clientY);
    };
    const onScroll = () => update(lastX, lastY);
    const onLeave = () => {
      p.inside = false;
      p.speed = 0;
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && p.inside) p.clicks += 1;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <div ref={boxRef} aria-hidden className="hh-root pointer-events-none absolute inset-0">
      <HeroHologramScene pointer={pointer} reduced={reduced} active={active} layout={layout} />
      <div className={`hh-shade hh-shade--${layout}`} />

      <style jsx global>{`
        .hh-root canvas {
          display: block;
        }
        .hh-shade {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .hh-shade--hero {
          background: linear-gradient(90deg, rgba(24, 24, 24, 0.82) 0%, rgba(24, 24, 24, 0.4) 34%, rgba(24, 24, 24, 0) 56%),
            linear-gradient(0deg, rgba(24, 24, 24, 0.95) 0%, rgba(24, 24, 24, 0.6) 22%, rgba(24, 24, 24, 0) 48%),
            linear-gradient(180deg, rgba(24, 24, 24, 0.7) 0%, rgba(24, 24, 24, 0) 16%);
        }
        .hh-read {
          white-space: nowrap;
          opacity: 0;
          padding: 3px 8px 2px;
          border-left: 1px solid var(--orange);
          background: rgba(16, 16, 16, 0.78);
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          color: #ffd9c4;
        }
        /* текст сверху слева, переход в соседние тёмные секции сверху и снизу */
        .hh-shade--section {
          background: linear-gradient(180deg, rgba(24, 24, 24, 0.95) 0%, rgba(24, 24, 24, 0.55) 26%, rgba(24, 24, 24, 0) 46%),
            linear-gradient(90deg, rgba(24, 24, 24, 0.8) 0%, rgba(24, 24, 24, 0.3) 34%, rgba(24, 24, 24, 0) 52%),
            linear-gradient(0deg, rgba(24, 24, 24, 1) 0%, rgba(24, 24, 24, 0) 16%);
        }
        .hh-node {
          transform: translate(10px, -50%);
          white-space: nowrap;
          opacity: 0;
          padding: 2px 6px 1px;
          border-left: 1px solid var(--orange);
          background: rgba(16, 16, 16, 0.6);
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #ffd9c4;
        }
        @media (max-width: 767px) {
          .hh-node {
            display: none;
          }
          .hh-shade--section {
            background: linear-gradient(180deg, rgba(24, 24, 24, 0.97) 0%, rgba(24, 24, 24, 0.8) 40%, rgba(24, 24, 24, 0) 60%),
              linear-gradient(0deg, rgba(24, 24, 24, 1) 0%, rgba(24, 24, 24, 0) 14%);
          }
          .hh-shade--hero {
            background: linear-gradient(0deg, rgba(24, 24, 24, 0.96) 0%, rgba(24, 24, 24, 0.75) 40%, rgba(24, 24, 24, 0) 66%),
              linear-gradient(180deg, rgba(24, 24, 24, 0.7) 0%, rgba(24, 24, 24, 0) 16%);
          }
        }
      `}</style>
    </div>
  );
}
