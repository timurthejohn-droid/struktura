"use client";

import { motion, useReducedMotion } from "framer-motion";
import { growthStats, growthYears } from "./growthData";

const EASE = [0.23, 1, 0.32, 1] as const;
const DRAW = 1.6; // с — линия роста прорисовывается слева направо

// Положение узлов: x — равный шаг по годам, y — сколько компетенций накоплено к году.
const totals = growthStats.map((s) => s.total);
const minT = Math.min(...totals);
const maxT = Math.max(...totals);
const nodes = growthYears.map((y, i) => ({
  y,
  x: 3 + (i * 94) / (growthYears.length - 1),
  top: 88 - ((growthStats[i].total - minT) / (maxT - minT)) * 62,
  fresh: growthStats[i].fresh.size,
  total: growthStats[i].total,
}));
const linePath = nodes.map((n, i) => `${i ? "L" : "M"}${n.x} ${n.top}`).join(" ");

/**
 * Первый экран V3: заголовок «История нашего роста» и сразу шкала лет.
 * Линия роста построена по данным: высота узла = число компетенций, накопленных к году
 * (из слайда «История нашего роста»). Клик по году — переход к главе.
 */
export default function GrowthHero() {
  const reduced = useReducedMotion();

  const go = (id: string) =>
    document.getElementById(`year-${id}`)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });

  return (
    <section className="bg-coal text-white">
      {/* Отступы и кегль привязаны к высоте экрана: заголовок и вся шкала лет — на первом экране */}
      <div
        className="container-x flex min-h-[100svh] flex-col"
        style={{ paddingTop: "clamp(100px, 15svh, 150px)", paddingBottom: "clamp(20px, 4svh, 48px)" }}
      >
        <div className="rise-in" style={{ animationDelay: "0.1s" }}>
          <div className="eyebrow text-orange">О компании</div>
          <h1
            className="mt-[clamp(16px,3svh,32px)] whitespace-nowrap font-mono uppercase text-white"
            style={{ fontSize: "clamp(34px, min(9.4vw, 11.5svh), 132px)", lineHeight: 0.94, letterSpacing: "-0.01em" }}
          >
            История нашего
            <br />
            <span className="text-orange">роста</span>
          </h1>
          <p
            className="mt-[clamp(16px,3svh,32px)] max-w-[600px] font-body text-white/70"
            style={{ fontSize: "clamp(17px, 1.4vw, 21px)", lineHeight: 1.5 }}
          >
            Лучшие проекты, на которых мы нарастили компетенции и опыт, — год за годом.
          </p>
        </div>

        {/* Линия роста — она же навигация по годам */}
        <div className="mt-auto pt-[clamp(24px,5svh,56px)]">
          <div className="flex items-end justify-between gap-6 border-b border-white/10 pb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">
            <span>Компетенции, накопленные к году</span>
            <span className="text-white/70">
              {minT} <span className="text-orange">→</span> {maxT}
            </span>
          </div>

          <div className="no-scrollbar -mx-6 overflow-x-auto px-6 md:mx-0 md:overflow-visible md:px-0">
            <div className="relative h-[230px] min-w-[760px] md:h-[min(280px,23svh)] md:min-w-0">
              <motion.div
                className="absolute inset-0"
                initial={reduced ? false : { clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: DRAW, ease: EASE, delay: 0.35 }}
              >
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
                  {nodes.map((n) => (
                    <line
                      key={n.y.id}
                      x1={n.x}
                      y1={n.top}
                      x2={n.x}
                      y2={100}
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth={1}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                  <path d={linePath} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
                </svg>
              </motion.div>

              {nodes.map((n, i) => (
                <motion.button
                  key={n.y.id}
                  type="button"
                  onClick={() => go(n.y.id)}
                  aria-label={`${n.y.period}: ${n.y.label}`}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 p-3"
                  style={{ left: `${n.x}%`, top: `${n.top}%` }}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.35 + (DRAW * (n.x / 100)) * 0.9 }}
                >
                  <span className="block h-2.5 w-2.5 border border-white bg-coal transition-colors duration-300 group-hover:border-orange group-hover:bg-orange" />
                  <span
                    className={`absolute bottom-full left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[13px] tracking-[0.06em] transition-colors group-hover:text-orange md:text-[15px] ${
                      i === nodes.length - 1 ? "text-orange" : "text-white"
                    }`}
                  >
                    {n.y.period === "2013 — 2014" ? "2013—14" : n.y.year}
                  </span>
                  <span className="absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap font-mono text-[10px] tracking-[0.12em] text-white/40 transition-colors group-hover:text-white/70">
                    {i === 0 ? n.total : `+${n.fresh}`}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="mt-[clamp(12px,2.5svh,24px)] flex items-center justify-end gap-6 sm:justify-between">
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-white/35 sm:inline">
              {growthYears.length} глав · нажмите на год
            </span>
            <a
              href="#history"
              className="flex shrink-0 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white"
            >
              Листайте
              <span className="flex h-10 w-10 items-center justify-center border border-white/20 text-orange">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
