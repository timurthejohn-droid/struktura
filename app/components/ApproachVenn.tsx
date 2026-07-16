"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from "framer-motion";

/*
 * Scroll-схема алгоритмического подхода. Сториборд (прогресс секции 0 → 1):
 *   1. Каркасная сфера в центре вращается по мере скролла.
 *   2. Из сферы четыре меридиана раскрываются в круги и разлетаются
 *      по местам — собирается диаграмма пересечения.
 *   3. На кругах появляются подписи принципов.
 *   4. Укрупнение — залетаем в «звезду» пересечения: её контур ярко
 *      светится оранжевым, всё остальное уходит за границы экрана,
 *      в центре появляется STRUKTURA+ и под ним четыре принципа.
 */

const R = 200; // радиус круга (viewBox 1000×1000)
const D_VENN = 145; // смещение центров кругов в собранной схеме
const TIP = 137.75; // острия звезды (пересечение противоположных пар кругов)
const COR = 48.92; // «талия» звезды (углы центральной области)

// Фазы прогресса
const SPIN_END = 0.3; // конец вращения сферы
const ASM_END = 0.52; // схема собрана
const SPIN_TURNS = 1.1; // обороты меридианов за фазу вращения (×π)

// Направления разлёта: верх / право / низ / лево
const CIRCLES: { dir: [number, number]; label: string; lx: number; ly: number }[] = [
  { dir: [0, -1], label: "Детерминированность", lx: 500, ly: 208 },
  { dir: [1, 0], label: "Конечность", lx: 768, ly: 506 },
  { dir: [0, 1], label: "Массовость", lx: 500, ly: 806 },
  { dir: [-1, 0], label: "Дискретность", lx: 232, ly: 506 },
];

// «Звезда» — область, где пересекаются минимум три круга: 8 дуг радиуса R,
// острия на осях (N/E/S/W), «талия» — углы центральной области. Все вершины
// лежат ровно на кругах (см. расчёт), обход по часовой, sweep=1.
const STAR_PATH = [
  `M 500 ${500 - TIP}`,
  `A ${R} ${R} 0 0 1 ${500 + COR} ${500 - COR}`,
  `A ${R} ${R} 0 0 1 ${500 + TIP} 500`,
  `A ${R} ${R} 0 0 1 ${500 + COR} ${500 + COR}`,
  `A ${R} ${R} 0 0 1 500 ${500 + TIP}`,
  `A ${R} ${R} 0 0 1 ${500 - COR} ${500 + COR}`,
  `A ${R} ${R} 0 0 1 ${500 - TIP} 500`,
  `A ${R} ${R} 0 0 1 ${500 - COR} ${500 - COR}`,
  `A ${R} ${R} 0 0 1 500 ${500 - TIP}`,
  "Z",
].join(" ");

// Параллели каркасной сферы (стилизованные)
const PARALLELS = [
  { cy: 388, rx: 158, ry: 36 },
  { cy: 500, rx: 200, ry: 48 },
  { cy: 612, rx: 158, ry: 36 },
];

const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/** Меридиан сферы, раскрывающийся в круг схемы */
function SphereCircle({ progress, i }: { progress: MotionValue<number>; i: number }) {
  const { dir } = CIRCLES[i];
  const phase = (i * Math.PI) / 4;

  const spinRx = (p: number) =>
    R * Math.abs(Math.cos(Math.PI * SPIN_TURNS * (Math.min(p, SPIN_END) / SPIN_END) + phase));

  const rx = useTransform(progress, (p) => {
    if (p < SPIN_END) return Math.max(spinRx(p), 0.5);
    const t = smooth((p - SPIN_END) / (ASM_END - SPIN_END));
    return spinRx(SPIN_END) + (R - spinRx(SPIN_END)) * t;
  });
  const move = useTransform(progress, (p) =>
    p < SPIN_END ? 0 : smooth((p - SPIN_END) / (ASM_END - SPIN_END)) * D_VENN
  );
  const cx = useTransform(move, (v) => 500 + dir[0] * v);
  const cy = useTransform(move, (v) => 500 + dir[1] * v);
  const opacity = useTransform(
    progress,
    [0.01 + i * 0.015, 0.06 + i * 0.015, 0.8, 0.96],
    [0, 1, 1, 0.06]
  );

  return (
    <motion.ellipse cx={cx} cy={cy} rx={rx} ry={R} fill="none" stroke="#1a1a1a" strokeWidth={0.9} style={{ opacity }} />
  );
}

/** Статичная версия для prefers-reduced-motion */
function StaticVenn() {
  return (
    <section className="py-24 md:py-36" style={{ background: "var(--paper)", borderTop: "1px solid var(--line-light)" }}>
      <div className="container-x flex justify-center">
        <svg viewBox="0 0 1000 1000" style={{ width: "min(92vw, 700px)", height: "auto" }} aria-label="Схема алгоритмического подхода">
          {CIRCLES.map((c) => (
            <circle
              key={c.label}
              cx={500 + c.dir[0] * D_VENN}
              cy={500 + c.dir[1] * D_VENN}
              r={R}
              fill="none"
              stroke="#1a1a1a"
              strokeOpacity={0.4}
              strokeWidth={0.9}
            />
          ))}
          <path d={STAR_PATH} fill="none" stroke="var(--orange)" strokeWidth={1.4} />
          {CIRCLES.map((c) => (
            <text
              key={c.label}
              x={c.lx}
              y={c.ly}
              textAnchor="middle"
              fontFamily="'CoFo Sans Mono', monospace"
              fontSize={20}
              fill="#1a1a1a"
              fillOpacity={0.75}
            >
              {c.label}
            </text>
          ))}
          <text
            x={500}
            y={506}
            textAnchor="middle"
            fontFamily="'CoFo Sans Mono', monospace"
            fontWeight={500}
            fontSize={16}
            letterSpacing="0.6"
            fill="#1a1a1a"
          >
            STRUKTURA<tspan fill="#ff5a00">+</tspan>
          </text>
        </svg>
      </div>
    </section>
  );
}

export default function ApproachVenn() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });

  // Сфера: обводка и параллели уходят, когда круги разлетаются
  const sphereOpacity = useTransform(scrollYProgress, [0.01, 0.06, SPIN_END, SPIN_END + 0.1], [0, 0.75, 0.75, 0]);
  // Фаза 4: укрупнение — залетаем в сердцевину
  const scale = useTransform(scrollYProgress, [0.64, 0.98], [1, 4.6], { ease: smooth });
  // Подписи: появляются на собранной схеме, уходят при укрупнении
  const labelOpacity = useTransform(scrollYProgress, [0.54, 0.62, 0.68, 0.76], [0, 1, 1, 0]);
  // Звезда: контур обводится и разгорается оранжевым свечением
  const starDraw = useTransform(scrollYProgress, [0.62, 0.8], [0, 1]);
  const starOpacity = useTransform(scrollYProgress, [0.6, 0.64], [0, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0.72, 0.92], [0, 0.75]);
  // Финал: логотип и принципы под ним
  const logoOpacity = useTransform(scrollYProgress, [0.83, 0.91], [0, 1]);
  const logoY = useTransform(scrollYProgress, [0.83, 0.91], [16, 0]);

  if (reduced) return <StaticVenn />;

  return (
    <section ref={wrapRef} style={{ height: "480vh", background: "var(--paper)", borderTop: "1px solid var(--line-light)" }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute top-24 left-0 right-0 pointer-events-none">
          <div className="container-x">
            <span className="eyebrow text-ink/50">Схема подхода</span>
          </div>
        </div>

        <motion.svg
          viewBox="0 0 1000 1000"
          style={{ width: "min(92vw, 86vh)", height: "min(92vw, 86vh)", scale }}
          aria-label="Схема алгоритмического подхода: четыре принципа, сходящиеся в ядро STRUKTURA+"
        >
          <defs>
            <filter id="starGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>

          {/* Каркасная сфера: обводка + параллели (меридианы — ниже, они же круги схемы) */}
          <motion.g style={{ opacity: sphereOpacity }}>
            <circle cx={500} cy={500} r={R} fill="none" stroke="#1a1a1a" strokeWidth={0.9} />
            {PARALLELS.map((p) => (
              <ellipse
                key={p.cy}
                cx={500}
                cy={p.cy}
                rx={p.rx}
                ry={p.ry}
                fill="none"
                stroke="#1a1a1a"
                strokeWidth={0.7}
                strokeOpacity={0.55}
              />
            ))}
          </motion.g>

          {CIRCLES.map((_, i) => (
            <SphereCircle key={i} progress={scrollYProgress} i={i} />
          ))}

          {/* Свечение контура звезды */}
          <motion.path
            d={STAR_PATH}
            fill="none"
            stroke="var(--orange)"
            strokeWidth={6}
            filter="url(#starGlow)"
            style={{ opacity: glowOpacity }}
          />
          {/* Сам контур — обводится по мере приближения */}
          <motion.path
            d={STAR_PATH}
            fill="none"
            stroke="var(--orange)"
            strokeWidth={1.6}
            strokeLinecap="round"
            style={{ pathLength: starDraw, opacity: starOpacity }}
          />

          {CIRCLES.map((c) => (
            <motion.text
              key={c.label}
              x={c.lx}
              y={c.ly}
              textAnchor="middle"
              fontFamily="'CoFo Sans Mono', monospace"
              fontSize={20}
              fill="#1a1a1a"
              fillOpacity={0.75}
              style={{ opacity: labelOpacity }}
            >
              {c.label}
            </motion.text>
          ))}
        </motion.svg>

        {/* Финал внутри звезды: только логотип — принципы идут дальше по вёрстке */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: logoOpacity, y: logoY }}
        >
          <div className="flex items-baseline select-none">
            <span className="font-mono font-medium tracking-[0.04em] text-ink" style={{ fontSize: "clamp(30px, 4.4vw, 60px)" }}>
              STRUKTURA
            </span>
            <span className="font-mono text-orange" style={{ fontSize: "clamp(22px, 3.2vw, 44px)", marginLeft: 4 }}>
              +
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
