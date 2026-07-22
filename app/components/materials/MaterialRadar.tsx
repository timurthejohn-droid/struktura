"use client";
import { useEffect, useRef, useState } from "react";
import { CAPABILITIES } from "./materialsData";
import { CAP_SHORT, LEVEL_R, Level, levelFor, proofFor } from "./capabilityMatrix";

// Радар возможностей материала — 9 осей по числу возможностей каталога.
// Луч длиннее — сильнее позиция: можно разработать → стандартно → доказано проектом.
// Ось кликабельна: выбор возможности перестраивает правую панель.
// Форма профиля сама рассказывает характер материала: «универсал» даёт
// широкий многоугольник, «специалист» — узкий шип.

const CX = 240;
const CY = 198;
const R = 116;
const LABEL_R = 146;
const IDLE = 0.055; // культя вместо нуля, чтобы многоугольник не схлопывался в точку

type Props = {
  material: string;
  selected: string | null;
  onSelect: (slug: string) => void;
};

const ANGLES = CAPABILITIES.map((_, i) => ((i * 40 - 90) * Math.PI) / 180);

function pt(i: number, k: number) {
  return [CX + Math.cos(ANGLES[i]) * R * k, CY + Math.sin(ANGLES[i]) * R * k] as const;
}

function poly(ks: number[]) {
  return ks.map((k, i) => pt(i, k).join(",")).join(" ");
}

/** Плавный переход профиля при смене материала — 9 чисел, rAF, ease-out. */
function useProfileTween(target: number[]) {
  const [k, setK] = useState<number[]>(() => target.map(() => IDLE));
  const from = useRef(target.map(() => IDLE));
  const raf = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setK(target);
      from.current = target;
      return;
    }
    const start = performance.now();
    const a = from.current;
    const dur = 620;
    cancelAnimationFrame(raf.current);
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 4);
      const next = target.map((v, i) => (a[i] ?? IDLE) + (v - (a[i] ?? IDLE)) * e);
      setK(next);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.join(",")]);

  return k;
}

export default function MaterialRadar({ material, selected, onSelect }: Props) {
  const [hover, setHover] = useState<string | null>(null);

  const levels: (Level | null)[] = CAPABILITIES.map((c) => levelFor(material, c.slug));
  const target = levels.map((l) => (l ? LEVEL_R[l] : IDLE));
  const k = useProfileTween(target);

  const active = hover ?? selected;

  return (
    <svg
      viewBox="0 0 480 420"
      className="w-full h-auto"
      role="group"
      aria-label={`Профиль возможностей: ${material}`}
    >
      {/* сетка уровней */}
      {[LEVEL_R.possible, LEVEL_R.standard, LEVEL_R.proven].map((r, i) => (
        <polygon
          key={r}
          points={poly(CAPABILITIES.map(() => r))}
          fill="none"
          stroke="rgba(255,255,255,0.11)"
          strokeWidth={i === 2 ? 1 : 0.6}
          strokeDasharray={i === 2 ? undefined : "2 4"}
        />
      ))}

      {/* оси */}
      {CAPABILITIES.map((c, i) => {
        const [x, y] = pt(i, 1);
        const on = active === c.slug;
        return (
          <line
            key={c.slug}
            x1={CX}
            y1={CY}
            x2={x}
            y2={y}
            stroke={on ? "var(--orange)" : "rgba(255,255,255,0.10)"}
            strokeWidth={on ? 1.2 : 0.7}
          />
        );
      })}

      {/* профиль материала */}
      <polygon points={poly(k)} fill="rgba(255,90,0,0.17)" stroke="var(--orange)" strokeWidth={1.6} />

      {/* вершины */}
      {CAPABILITIES.map((c, i) => {
        const lvl = levels[i];
        const [x, y] = pt(i, k[i] ?? IDLE);
        const on = active === c.slug;
        if (!lvl)
          return (
            <circle key={c.slug} cx={x} cy={y} r={2} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={0.8} />
          );
        return (
          <g key={c.slug}>
            {on && <circle cx={x} cy={y} r={8} fill="none" stroke="var(--orange)" strokeWidth={1} opacity={0.6} />}
            <circle
              cx={x}
              cy={y}
              r={lvl === "proven" ? 4.6 : lvl === "standard" ? 3.4 : 2.6}
              fill={lvl === "proven" ? "var(--orange)" : "#101010"}
              stroke="var(--orange)"
              strokeWidth={1.4}
            />
          </g>
        );
      })}

      {/* подписи осей + зона клика */}
      {CAPABILITIES.map((c, i) => {
        const cos = Math.cos(ANGLES[i]);
        const sin = Math.sin(ANGLES[i]);
        const lx = CX + cos * LABEL_R;
        const ly = CY + sin * LABEL_R;
        const anchor = Math.abs(cos) < 0.3 ? "middle" : cos > 0 ? "start" : "end";
        const baseline = sin < -0.4 ? "auto" : sin > 0.4 ? "hanging" : "middle";
        const lvl = levels[i];
        const on = active === c.slug;
        const n = lvl === "proven" ? proofFor(material, c.slug).total : 0;

        return (
          <g
            key={c.slug}
            onClick={() => onSelect(c.slug)}
            onMouseEnter={() => setHover(c.slug)}
            onMouseLeave={() => setHover(null)}
            style={{ cursor: "pointer" }}
          >
            {/* невидимая мишень: половина луча + подпись */}
            <line
              x1={CX + cos * R * 0.35}
              y1={CY + sin * R * 0.35}
              x2={lx}
              y2={ly}
              stroke="transparent"
              strokeWidth={34}
            />
            <text
              x={lx}
              y={ly}
              textAnchor={anchor}
              dominantBaseline={baseline}
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fill: on ? "var(--orange)" : lvl ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.24)",
                transition: "fill 0.2s ease",
              }}
            >
              {CAP_SHORT[c.slug]}
              {n > 0 ? ` ${n}` : ""}
            </text>
          </g>
        );
      })}

      {/* центральная марка */}
      <circle cx={CX} cy={CY} r={2.2} fill="rgba(255,255,255,0.3)" />
    </svg>
  );
}
