"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  EX_KEYFRAMES,
  EX_LAYERS,
  EX_STARTS,
  EX_STEPS,
  EX_ZONES,
  exLocal,
  exStepAt,
  type ExZone,
  type ZoneKey,
} from "./executionData";

type Pt = [number, number];
type Box = { x: number; y: number; w: number; h: number };
type Layout = {
  narrow: boolean;
  W: number;
  H: number;
  model: Box;
  frag: Box;
  layers: Box;
  layerH: number;
  layerGap: number;
  zone: (z: ExZone) => Box;
  /** Маршрут связи от модели к участнику. */
  link: (z: ExZone, zb: Box) => Pt[];
  lineGap: number;
  /** Физический путь детали: производство → комплектация → площадка. */
  trail: { x: number; segs: [number, number][]; from: number; to: number };
};

const WIDE: Layout = {
  narrow: false,
  W: 1200,
  H: 560,
  model: { x: 455, y: 14, w: 290, h: 532 },
  frag: { x: 482, y: 64, w: 236, h: 222 },
  layers: { x: 470, y: 314, w: 260, h: 212 },
  layerH: 36,
  layerGap: 8,
  zone: (z) => ({ x: z.side === "left" ? 20 : 930, y: [40, 225, 410][z.row], w: 250, h: 110 }),
  link: (z, b) => {
    const cy = b.y + b.h / 2;
    return z.side === "left" ? [[455, cy], [b.x + b.w, cy]] : [[745, cy], [b.x, cy]];
  },
  lineGap: 5,
  trail: { x: 1055, segs: [[150, 225], [335, 410]], from: 150, to: 410 },
};

const NARROW: Layout = {
  narrow: true,
  W: 390,
  H: 560,
  model: { x: 20, y: 0, w: 350, h: 222 },
  frag: { x: 112, y: 24, w: 166, h: 88 },
  layers: { x: 46, y: 120, w: 298, h: 96 },
  layerH: 16,
  layerGap: 4,
  zone: (z) => ({ x: z.side === "left" ? 0 : 225, y: [252, 356, 460][z.row], w: 165, h: 96 }),
  link: (z, b) => {
    const cy = b.y + b.h / 2;
    return z.side === "left"
      ? [[187, 222], [187, cy], [b.x + b.w, cy]]
      : [[203, 222], [203, cy], [b.x, cy]];
  },
  lineGap: 2.5,
  trail: { x: 307, segs: [[348, 356], [452, 460]], from: 348, to: 460 },
};

const INK = "#1a1a1a";
const ORANGE = "#ff5a00";

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const frac = (x: number) => x - Math.floor(x);
const pad = (n: number) => String(n).padStart(2, "0");

// ── геометрия ломаных ──
function normal(a: Pt, b: Pt): Pt {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = Math.hypot(dx, dy) || 1;
  return [-dy / l, dx / l];
}
function offsetPolyline(pts: Pt[], d: number): Pt[] {
  return pts.map((p, i) => {
    const n1 = i > 0 ? normal(pts[i - 1], p) : null;
    const n2 = i < pts.length - 1 ? normal(p, pts[i + 1]) : null;
    if (!n1) return [p[0] + n2![0] * d, p[1] + n2![1] * d];
    if (!n2) return [p[0] + n1[0] * d, p[1] + n1[1] * d];
    const mx = n1[0] + n2[0];
    const my = n1[1] + n2[1];
    const l = Math.hypot(mx, my) || 1;
    const nx = mx / l;
    const ny = my / l;
    const cos = nx * n1[0] + ny * n1[1] || 1;
    return [p[0] + (nx * d) / cos, p[1] + (ny * d) / cos];
  });
}
function pointAt(pts: Pt[], t: number): Pt {
  const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  let rest = clamp01(t) * lens.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lens.length; i++) {
    if (rest <= lens[i] || i === lens.length - 1) {
      const k = lens[i] ? rest / lens[i] : 0;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
    }
    rest -= lens[i];
  }
  return pts[pts.length - 1];
}
const toD = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
function arrowHead(pts: Pt[], size: number) {
  const b = pts[pts.length - 1];
  const a = pts[pts.length - 2];
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  const ux = (b[0] - a[0]) / l;
  const uy = (b[1] - a[1]) / l;
  const bx = b[0] - ux * size;
  const by = b[1] - uy * size;
  const w = size * 0.5;
  return `${b[0]},${b[1]} ${bx - uy * w},${by + ux * w} ${bx + uy * w},${by - ux * w}`;
}

/** Архитектурный фрагмент: криволинейная облицовка и оранжевая подсистема за ней. */
function Fragment({ b, heroAlert, heroFocus }: { b: Box; heroAlert: number; heroFocus: number }) {
  const COLS = 7;
  const ROWS = 5;
  const TH = 0.62;
  const cx = b.x + b.w / 2;
  const X = (th: number) => cx + ((b.w / 2) * Math.sin(th)) / Math.sin(TH);
  const lift = (th: number) => -((Math.cos(th) - Math.cos(TH)) / (1 - Math.cos(TH))) * b.h * 0.08;
  const Y = (th: number, v: number) => b.y + b.h * 0.1 + lift(th) + v * b.h * 0.86;
  const P = (th: number, v: number, dx = 0, dy = 0): Pt => [X(th) + dx, Y(th, v) + dy];
  const step = (2 * TH) / COLS;
  const so = b.w * 0.018;

  const sub: string[] = [];
  for (let c = 0; c <= COLS; c++) {
    const th = -TH + c * step;
    sub.push(toD([P(th, -0.04, so, so * 1.3), P(th, 1.04, so, so * 1.3)]));
  }
  for (let r = 0; r <= ROWS; r++) {
    const row: Pt[] = [];
    for (let k = 0; k <= 14; k++) row.push(P(-TH + (k * 2 * TH) / 14, r / ROWS, so, so * 1.3));
    sub.push(toD(row));
  }

  const panels: { d: string; hero: boolean }[] = [];
  const g = step * 0.06;
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const t0 = -TH + c * step + g;
      const t1 = -TH + (c + 1) * step - g;
      const v0 = r / ROWS + 0.014;
      const v1 = (r + 1) / ROWS - 0.014;
      panels.push({ d: toD([P(t0, v0), P(t1, v0), P(t1, v1), P(t0, v1)]) + " Z", hero: c === 4 && r === 2 });
    }
  }
  const hero = panels.find((p) => p.hero)!;

  return (
    <g>
      {sub.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={ORANGE} strokeWidth={b.w * 0.009} strokeLinecap="round" />
      ))}
      {panels.map((p, i) =>
        p.hero ? null : (
          <path key={i} d={p.d} fill="#fbfaf7" stroke="rgba(26,26,26,0.42)" strokeWidth={0.8} />
        ),
      )}
      <path
        d={hero.d}
        fill={heroAlert > 0 ? `rgba(255,90,0,${0.18 + heroAlert * 0.5})` : `rgba(255,90,0,${0.08 + heroFocus * 0.14})`}
        stroke={ORANGE}
        strokeWidth={1.6}
      />
    </g>
  );
}

export default function ExecutionSystem() {
  const sectionRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smoothP = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.35 });
  const [p, setP] = useState(0);
  useMotionValueEvent(smoothP, "change", (v) => setP(reduced ? EX_KEYFRAMES[exStepAt(v)] : v));
  useEffect(() => {
    if (reduced) setP(EX_KEYFRAMES[exStepAt(scrollYProgress.get())]);
  }, [reduced, scrollYProgress]);

  // масштаб схемы под доступное место
  const [fit, setFit] = useState<{ L: Layout; k: number; ox: number; oy: number } | null>(null);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const L = width < 760 ? NARROW : WIDE;
      const k = Math.min(width / L.W, height / L.H);
      setFit({ L, k, ox: (width - L.W * k) / 2, oy: (height - L.H * k) / 2 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [open, setOpen] = useState<ZoneKey | null>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const step = exStepAt(p);
  const t = exLocal(p, step);
  const S = EX_STEPS[step];
  const changing = step === 4;

  const goTo = (i: number) => {
    const s = sectionRef.current;
    if (!s) return;
    const top = s.getBoundingClientRect().top + window.scrollY;
    const travel = s.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + EX_KEYFRAMES[i] * travel, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section ref={sectionRef} id="execution-system" className="ex-section" aria-label="Единая система исполнения">
      <div className="ex-sticky">
        <div className="ex-grid container-x">
          <header className="ex-head">
            <div className="ex-meta">
              <span className="ex-meta-idx">Цифровая среда</span>
              <span>Модель как центр координации</span>
            </div>
            <h2 className="ex-title">
              Единая система <span className="text-orange">исполнения</span>
            </h2>
          </header>

          <div className="ex-cap" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="ex-cap-n">
                  <b>{pad(step + 1)}</b> / {pad(EX_STEPS.length)} · {S.label}
                </div>
                <h3 className="ex-cap-title">{S.title}</h3>
                <p className="ex-cap-text">{S.text}</p>
                <p className="ex-cap-outcome">{S.outcome}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="ex-stage-box" ref={boxRef}>
            {fit && (
              <Stage
                fit={fit}
                step={step}
                t={t}
                changing={changing}
                open={open}
                setOpen={setOpen}
              />
            )}
          </div>

          <nav className="ex-rail" aria-label="Сцены">
            <div className="ex-rail-track">
              <span className="ex-rail-base" aria-hidden />
              <span className="ex-rail-fill" style={{ width: `${clamp01(p) * 100}%` }} aria-hidden />
              {EX_STEPS.map((st, i) => (
                <button
                  key={st.key}
                  type="button"
                  className={`ex-rail-btn ${i === step ? "on" : ""} ${i < step ? "past" : ""}`}
                  style={{ left: `${EX_STARTS[i] * 100}%` }}
                  onClick={() => goTo(i)}
                  aria-current={i === step ? "step" : undefined}
                >
                  <i aria-hidden />
                  <span className="ex-rail-n">{pad(i + 1)}</span>
                  <span className="ex-rail-label">{st.label}</span>
                </button>
              ))}
            </div>
            <span className="ex-note">Нажмите на участника или связь — откроется карточка обмена</span>
          </nav>
        </div>
      </div>

      <style jsx global>{`
        .ex-section {
          position: relative;
          height: 560svh;
          background: var(--paper);
          color: var(--ink);
          border-top: 1px solid var(--line-light);
        }
        .ex-sticky {
          position: sticky;
          top: 72px;
          height: calc(100svh - 72px);
          min-height: 600px;
          overflow: hidden;
        }
        .ex-grid {
          height: 100%;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 560px);
          grid-template-rows: auto minmax(0, 1fr) auto;
          grid-template-areas: "head cap" "stage stage" "rail rail";
          column-gap: 48px;
          padding-top: clamp(20px, 3.6vh, 44px);
        }
        .ex-head {
          grid-area: head;
        }
        .ex-meta {
          display: flex;
          gap: 14px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-soft);
        }
        .ex-meta-idx {
          color: var(--orange);
        }
        .ex-title {
          margin-top: 14px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: clamp(24px, 3vw, 46px);
          line-height: 0.98;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }

        /* ── подпись сцены ── */
        .ex-cap {
          grid-area: cap;
          min-height: clamp(130px, 17vh, 160px);
        }
        .ex-cap-n {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-soft);
        }
        .ex-cap-n b {
          font-weight: 400;
          color: var(--orange);
        }
        .ex-cap-title {
          margin-top: 10px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: clamp(18px, 1.6vw, 24px);
          font-weight: 400;
          line-height: 1.08;
          text-transform: uppercase;
        }
        .ex-cap-text {
          margin-top: 10px;
          font-family: "Onest", sans-serif;
          font-size: clamp(13.5px, 1vw, 15px);
          line-height: 1.5;
          color: var(--ink-soft);
        }
        .ex-cap-outcome {
          margin-top: 12px;
          padding-left: 12px;
          border-left: 2px solid var(--orange);
          font-family: "Onest", sans-serif;
          font-size: 14px;
          line-height: 1.4;
        }

        /* ── схема ── */
        .ex-stage-box {
          grid-area: stage;
          position: relative;
          min-height: 0;
          margin: 10px 0 6px;
        }
        .ex-stage {
          position: absolute;
          left: 0;
          top: 0;
          transform-origin: 0 0;
        }
        .ex-stage svg {
          position: absolute;
          inset: 0;
          overflow: visible;
        }
        .ex-hit {
          cursor: pointer;
        }
        .ex-layer rect,
        .ex-layer text {
          transition: fill 0.35s ease, stroke 0.35s ease, opacity 0.35s ease;
        }

        .ex-zone {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          padding: 14px 16px;
          border: 1px solid rgba(26, 26, 26, 0.14);
          background: #fff;
          color: var(--ink);
          text-align: left;
          cursor: pointer;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s var(--ease-out);
        }
        .ex-zone::before {
          content: "";
          position: absolute;
          left: -1px;
          right: -1px;
          top: -1px;
          height: 2px;
          background: var(--orange);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s var(--ease-out);
        }
        .ex-zone.on {
          border-color: rgba(26, 26, 26, 0.55);
          box-shadow: 0 14px 34px -18px rgba(26, 26, 26, 0.35);
        }
        .ex-zone.on::before,
        .ex-zone.warn::before {
          transform: scaleX(1);
        }
        .ex-zone.warn {
          border-color: var(--orange);
        }
        @media (hover: hover) and (pointer: fine) {
          .ex-zone:hover {
            border-color: var(--ink);
          }
        }
        .ex-zone-name {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 13px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          line-height: 1.15;
        }
        .ex-zone-role {
          font-family: "Onest", sans-serif;
          font-size: 12.5px;
          line-height: 1.35;
          color: var(--ink-soft);
        }
        .ex-zone-io {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9.5px;
          line-height: 1.45;
          letter-spacing: 0.02em;
          color: var(--ink);
        }
        .ex-zone-io i {
          font-style: normal;
          color: var(--orange);
        }
        .ex-zone-status {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 7px 2px;
          border: 1px solid rgba(26, 26, 26, 0.12);
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-soft);
          transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
        .ex-zone-status i {
          width: 6px;
          height: 6px;
          background: rgba(26, 26, 26, 0.3);
        }
        .ex-zone-status.fresh {
          border-color: var(--orange);
          background: var(--orange);
          color: #fff;
        }
        .ex-zone-status.fresh i {
          background: #fff;
        }
        .ex-narrow .ex-zone {
          gap: 4px;
          padding: 9px 10px;
        }
        .ex-narrow .ex-zone-name {
          font-size: 10.5px;
          letter-spacing: 0.04em;
        }
        .ex-narrow .ex-zone-role {
          font-size: 10.5px;
        }
        .ex-narrow .ex-zone-status {
          font-size: 8.5px;
          padding: 2px 5px 1px;
          letter-spacing: 0.03em;
        }

        /* ── карточка обмена ── */
        .ex-card {
          position: absolute;
          z-index: 5;
          width: 300px;
          padding: 16px 18px 18px;
          border: 1px solid var(--ink);
          border-top: 3px solid var(--orange);
          background: #fff;
          box-shadow: 0 24px 50px -24px rgba(26, 26, 26, 0.45);
        }
        .ex-card header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 13px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .ex-card header button {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          border: 1px solid rgba(26, 26, 26, 0.2);
          background: none;
          font-size: 14px;
          line-height: 1;
          cursor: pointer;
        }
        .ex-card dl {
          display: grid;
          gap: 2px;
          margin-top: 12px;
        }
        .ex-card dt {
          margin-top: 8px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--orange);
        }
        .ex-card dd {
          font-family: "Onest", sans-serif;
          font-size: 13px;
          line-height: 1.4;
        }
        .ex-card-layer {
          margin-top: 14px;
          padding-top: 10px;
          border-top: 1px solid var(--line-light);
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-soft);
        }
        .ex-narrow .ex-card {
          width: 390px;
        }

        /* ── шкала сцен ── */
        .ex-rail {
          grid-area: rail;
          display: flex;
          align-items: flex-end;
          gap: 32px;
          padding-bottom: clamp(16px, 2.6vh, 28px);
        }
        .ex-rail-track {
          position: relative;
          flex: 1;
          height: 38px;
        }
        .ex-rail-base,
        .ex-rail-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 1px;
        }
        .ex-rail-base {
          right: 0;
          background: rgba(26, 26, 26, 0.16);
        }
        .ex-rail-fill {
          background: var(--orange);
        }
        .ex-rail-btn {
          position: absolute;
          top: -6px;
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 14px 10px 6px 0;
          background: none;
          border: 0;
          color: var(--ink-soft);
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.25s ease;
        }
        .ex-rail-btn i {
          position: absolute;
          left: -4px;
          top: 2px;
          width: 9px;
          height: 9px;
          border: 1px solid rgba(26, 26, 26, 0.4);
          background: var(--paper);
          transform: rotate(45deg);
          transition: border-color 0.25s ease, background 0.25s ease;
        }
        .ex-rail-btn.past i,
        .ex-rail-btn.on i {
          border-color: var(--orange);
        }
        .ex-rail-btn.on i {
          background: var(--orange);
        }
        .ex-rail-btn.on {
          color: var(--ink);
        }
        .ex-rail-n {
          color: var(--orange);
        }
        @media (hover: hover) and (pointer: fine) {
          .ex-rail-btn:hover {
            color: var(--ink);
          }
        }
        .ex-note {
          flex-shrink: 0;
          padding-bottom: 8px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(26, 26, 26, 0.4);
        }

        @media (max-width: 1023px) {
          .ex-grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 420px);
            column-gap: 32px;
          }
          .ex-note {
            display: none;
          }
        }
        @media (max-width: 767px) {
          .ex-section {
            height: 520svh;
          }
          .ex-sticky {
            min-height: 560px;
          }
          .ex-grid {
            grid-template-columns: minmax(0, 1fr);
            grid-template-rows: auto minmax(0, 1fr) auto auto;
            grid-template-areas: "head" "stage" "cap" "rail";
            padding-top: 18px;
          }
          .ex-meta span:last-child {
            display: none;
          }
          .ex-title {
            margin-top: 8px;
            font-size: clamp(20px, 6.4vw, 28px);
          }
          .ex-cap {
            min-height: 132px;
          }
          .ex-cap-title {
            margin-top: 6px;
            font-size: 17px;
          }
          .ex-cap-text {
            margin-top: 6px;
            font-size: 13px;
            line-height: 1.42;
          }
          .ex-cap-outcome {
            display: none;
          }
          .ex-rail-label {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}

function Stage({
  fit,
  step,
  t,
  changing,
  open,
  setOpen,
}: {
  fit: { L: Layout; k: number; ox: number; oy: number };
  step: number;
  t: number;
  changing: boolean;
  open: ZoneKey | null;
  setOpen: (k: ZoneKey | null) => void;
}) {
  const { L, k, ox, oy } = fit;
  const S = EX_STEPS[step];

  // готовая геометрия связей
  const links = useMemo(
    () =>
      EX_ZONES.map((z) => {
        const zb = L.zone(z);
        const pts = L.link(z, zb);
        const sgn = z.side === "left" ? 1 : -1;
        const outLine = offsetPolyline(pts, sgn * L.lineGap);
        const inLine = offsetPolyline(pts, -sgn * L.lineGap).reverse();
        return { z, zb, pts, outLine, inLine };
      }),
    [L],
  );

  // состояние каждой связи в текущем кадре
  const changeOrder: ZoneKey[] = ["design", "prod", "log", "site", "arch"];
  const linkState = (key: ZoneKey) => {
    const visited = EX_STEPS.slice(0, step).some((s) => s.active.includes(key));
    if (changing) {
      const j = changeOrder.indexOf(key);
      const warn = key === "site" ? smooth(0, 0.28, t) : 0;
      const out = j >= 0 ? smooth(0.48 + j * 0.08, 0.66 + j * 0.08, t) : 0;
      return { visited: true, draw: Math.max(warn, out), warn, out, change: j >= 0 && out > 0.05 };
    }
    const on = S.active.includes(key);
    const draw = on ? smooth(0.04, 0.4, t) : 0;
    return { visited, draw, warn: 0, out: draw, change: false };
  };

  const heroAlert = changing ? smooth(0.22, 0.32, t) * (1 - smooth(0.6, 0.85, t) * 0.6) : 0;
  const revB = changing && t > 0.38;
  const trailOn = step === 3 ? 1 : 0;
  const glyphY = L.trail.from + (L.trail.to - L.trail.from) * smooth(0.12, 0.88, t);

  const statusOf = (z: ExZone) => {
    let s: string | null = null;
    let fresh = false;
    for (let i = 0; i <= step; i++) {
      if (z.status[i]) {
        s = z.status[i];
        fresh = i === step;
      }
    }
    return { s, fresh };
  };

  const fs = L.narrow ? 0.8 : 1; // базовый множитель шрифта внутри SVG
  const openZone = open ? EX_ZONES.find((z) => z.key === open)! : null;
  const cardPos = (() => {
    if (!openZone) return null;
    if (L.narrow) return { left: 0, top: 0 };
    const zb = L.zone(openZone);
    const left = openZone.side === "left" ? zb.x + zb.w + 16 : zb.x - 316;
    return { left, top: Math.min(zb.y, L.H - 236) };
  })();

  return (
    <div
      className={`ex-stage ${L.narrow ? "ex-narrow" : ""}`}
      style={{ width: L.W, height: L.H, transform: `translate(${ox}px, ${oy}px) scale(${k})` }}
    >
      <svg
        width={L.W}
        height={L.H}
        viewBox={`0 0 ${L.W} ${L.H}`}
        onClick={() => setOpen(null)}
        role="img"
        aria-label="Схема: мастер-модель в центре, участники вокруг, двусторонние связи"
      >
        {/* модель */}
        <g>
          <rect
            x={L.model.x}
            y={L.model.y}
            width={L.model.w}
            height={L.model.h}
            fill="rgba(255,255,255,0.55)"
            stroke="rgba(26,26,26,0.16)"
          />
          {[
            [L.model.x, L.model.y, 1, 1],
            [L.model.x + L.model.w, L.model.y, -1, 1],
            [L.model.x, L.model.y + L.model.h, 1, -1],
            [L.model.x + L.model.w, L.model.y + L.model.h, -1, -1],
          ].map(([x, y, sx, sy], i) => (
            <path
              key={i}
              d={`M${x + sx * 12},${y} L${x},${y} L${x},${y + sy * 12}`}
              fill="none"
              stroke={INK}
              strokeWidth={1.4}
            />
          ))}
          <text
            x={L.model.x + 14}
            y={L.model.y + (L.narrow ? 15 : 26)}
            fontFamily="CoFo Sans Mono, monospace"
            fontSize={11 * fs}
            letterSpacing="0.14em"
            fill={INK}
          >
            МАСТЕР-МОДЕЛЬ
          </text>
          <text
            x={L.model.x + L.model.w - 14}
            y={L.model.y + (L.narrow ? 15 : 26)}
            textAnchor="end"
            fontFamily="CoFo Sans Mono, monospace"
            fontSize={10.5 * fs}
            letterSpacing="0.08em"
            fill={ORANGE}
          >
            {revB ? "P-042 · РЕД. A → B" : "P-042 · РЕД. A"}
          </text>
          <Fragment b={L.frag} heroAlert={heroAlert} heroFocus={step === 0 ? smooth(0.05, 0.4, t) : 1} />

          {EX_LAYERS.map((name, i) => {
            const y = L.layers.y + i * (L.layerH + L.layerGap);
            const lit = i < S.layersLit;
            const focus = S.layersFocus.includes(i);
            const changed = changing && focus && revB;
            return (
              <g key={name} className="ex-layer">
                <rect
                  x={L.layers.x}
                  y={y}
                  width={L.layers.w}
                  height={L.layerH}
                  style={{
                    fill: focus ? (changed ? "rgba(255,90,0,0.16)" : "rgba(255,90,0,0.08)") : lit ? "#fff" : "transparent",
                    stroke: focus ? "rgba(255,90,0,0.7)" : lit ? "rgba(26,26,26,0.16)" : "rgba(26,26,26,0.18)",
                  }}
                  strokeDasharray={lit ? undefined : "3 3"}
                />
                <rect
                  x={L.layers.x}
                  y={y}
                  width={3}
                  height={L.layerH}
                  style={{ fill: focus ? ORANGE : "transparent" }}
                />
                <text
                  x={L.layers.x + (L.narrow ? 10 : 14)}
                  y={y + L.layerH / 2 + 4 * fs}
                  fontFamily="CoFo Sans Mono, monospace"
                  fontSize={11 * fs}
                  letterSpacing="0.06em"
                  style={{ fill: INK, opacity: lit ? (focus ? 1 : 0.72) : 0.32 }}
                >
                  {pad(i + 1)}&nbsp;&nbsp;{name.toUpperCase()}
                </text>
                {changed && (
                  <text
                    x={L.layers.x + L.layers.w - 10}
                    y={y + L.layerH / 2 + 4 * fs}
                    textAnchor="end"
                    fontFamily="CoFo Sans Mono, monospace"
                    fontSize={10 * fs}
                    fill={ORANGE}
                  >
                    РЕД. B
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* физический путь детали */}
        {L.trail.segs.map(([a, b], i) => (
          <g key={i} style={{ opacity: 0.22 + trailOn * 0.78, transition: "opacity 0.4s ease" }}>
            <line x1={L.trail.x} y1={a} x2={L.trail.x} y2={b - 6} stroke={ORANGE} strokeWidth={2} strokeDasharray="4 4" />
            <polygon points={arrowHead([[L.trail.x, a], [L.trail.x, b]], 8)} fill={ORANGE} />
          </g>
        ))}
        {!L.narrow && (
          <text
            x={L.trail.x + 12}
            y={(L.trail.segs[0][0] + L.trail.segs[0][1]) / 2 + 4}
            fontFamily="CoFo Sans Mono, monospace"
            fontSize={10}
            letterSpacing="0.1em"
            fill={ORANGE}
            style={{ opacity: 0.35 + trailOn * 0.65, transition: "opacity 0.4s ease" }}
          >
            ПУТЬ ДЕТАЛИ
          </text>
        )}

        {/* связи модели с участниками */}
        {links.map(({ z, pts, outLine, inLine }) => {
          const st = linkState(z.key);
          const baseOp = st.visited ? 0.3 : 0.14;
          const outC = st.change ? ORANGE : INK;
          const inC = st.warn > 0 ? ORANGE : INK;
          const outDraw = changing ? st.out : st.draw;
          const inDraw = changing ? st.warn : st.draw;
          const outLabel = st.change && z.outChange ? z.outChange : z.out;
          const inLabel = st.warn > 0 ? "Обмер: отклонение +12 мм" : z.in;
          const cy = pts[pts.length - 1][1];
          const midX = (pts[0][0] + pts[pts.length - 1][0]) / 2;
          const dots = [0, 1, 2];
          return (
            <g key={z.key}>
              {[outLine, inLine].map((line, i) => (
                <g key={i}>
                  <path d={toD(line)} fill="none" stroke={INK} strokeOpacity={baseOp} strokeWidth={1} />
                  <polygon points={arrowHead(line, 7)} fill={INK} fillOpacity={baseOp} />
                </g>
              ))}
              <path
                d={toD(outLine)}
                fill="none"
                stroke={outC}
                strokeWidth={1.6}
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - outDraw}
              />
              <polygon points={arrowHead(outLine, 8)} fill={outC} opacity={smooth(0.85, 1, outDraw)} />
              <path
                d={toD(inLine)}
                fill="none"
                stroke={inC}
                strokeWidth={st.warn > 0 ? 2 : 1.6}
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - inDraw}
              />
              <polygon points={arrowHead(inLine, 8)} fill={inC} opacity={smooth(0.85, 1, inDraw)} />

              {dots.map((i) => {
                const a = pointAt(outLine, frac(t * 1.8 + i / 3));
                const b = pointAt(inLine, frac(t * 1.8 + i / 3 + 0.17));
                return (
                  <g key={i}>
                    <circle cx={a[0]} cy={a[1]} r={L.narrow ? 2.2 : 3} fill={st.change ? ORANGE : INK} opacity={smooth(0.6, 1, outDraw)} />
                    <circle cx={b[0]} cy={b[1]} r={L.narrow ? 2.2 : 3} fill={ORANGE} opacity={smooth(0.6, 1, inDraw)} />
                  </g>
                );
              })}

              {!L.narrow && (
                <>
                  <text
                    x={midX}
                    y={cy - L.lineGap - 8}
                    textAnchor="middle"
                    fontFamily="CoFo Sans Mono, monospace"
                    fontSize={10.5}
                    letterSpacing="0.04em"
                    fill={st.change ? ORANGE : INK}
                    opacity={Math.max(st.visited ? 0.5 : 0.34, outDraw)}
                  >
                    {outLabel.toUpperCase()}
                  </text>
                  <text
                    x={midX}
                    y={cy + L.lineGap + 16}
                    textAnchor="middle"
                    fontFamily="CoFo Sans Mono, monospace"
                    fontSize={10.5}
                    letterSpacing="0.04em"
                    fill={st.warn > 0 ? ORANGE : INK}
                    opacity={Math.max(st.visited ? 0.5 : 0.34, inDraw)}
                  >
                    {inLabel.toUpperCase()}
                  </text>
                </>
              )}

              <path
                className="ex-hit"
                d={toD(pts)}
                fill="none"
                stroke="transparent"
                strokeWidth={L.narrow ? 12 : 22}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(z.key);
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* участники */}
      {links.map(({ z, zb }) => {
        const st = linkState(z.key);
        const on = changing ? st.change || st.warn > 0 : S.active.includes(z.key);
        const { s, fresh } = statusOf(z);
        return (
          <button
            key={z.key}
            type="button"
            className={`ex-zone ${on ? "on" : ""} ${changing && st.warn > 0 ? "warn" : ""}`}
            style={{ left: zb.x, top: zb.y, width: zb.w, height: zb.h } as CSSProperties}
            onClick={() => setOpen(open === z.key ? null : z.key)}
            aria-expanded={open === z.key}
          >
            <span className="ex-zone-name">{z.name}</span>
            {L.narrow && on ? (
              <span className="ex-zone-io">
                <i>→</i> {st.change && z.outChange ? z.outChange : z.out}
                <br />
                <i>←</i> {changing && z.key === "site" ? "Обмер: +12 мм" : z.in}
              </span>
            ) : (
              <span className="ex-zone-role">{z.role}</span>
            )}
            {s && (
              <span className={`ex-zone-status ${fresh ? "fresh" : ""}`}>
                <i aria-hidden />
                {s}
              </span>
            )}
          </button>
        );
      })}

      {/* деталь P-042 в пути — поверх зон */}
      <svg width={L.W} height={L.H} style={{ pointerEvents: "none" }} aria-hidden>
        <g
          style={{ opacity: trailOn ? smooth(0.04, 0.12, t) * (1 - smooth(0.9, 0.98, t)) : 0 }}
          transform={`translate(${L.trail.x}, ${glyphY})`}
        >
          <rect x={-13} y={-9} width={26} height={18} fill="#fff" stroke={ORANGE} strokeWidth={1.6} />
          <path d="M-13,-9 L13,9" stroke={ORANGE} strokeWidth={0.8} opacity={0.5} />
          <text
            x={-20}
            y={4}
            textAnchor="end"
            fontFamily="CoFo Sans Mono, monospace"
            fontSize={L.narrow ? 9 : 10.5}
            letterSpacing="0.06em"
            fill={ORANGE}
          >
            P-042
          </text>
        </g>
      </svg>

      <AnimatePresence>
        {openZone && cardPos && (
          <motion.div
            key={openZone.key}
            className="ex-card"
            style={cardPos}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label={openZone.name}
          >
            <header>
              <span>{openZone.name}</span>
              <button type="button" onClick={() => setOpen(null)} aria-label="Закрыть">
                ×
              </button>
            </header>
            <dl>
              <dt>Модель передаёт</dt>
              <dd>{openZone.card.what}</dd>
              <dt>Кто использует</dt>
              <dd>{openZone.card.who}</dd>
              <dt>Что возвращается в модель</dt>
              <dd>{openZone.card.back}</dd>
            </dl>
            <p className="ex-card-layer">Слой модели: {EX_LAYERS[openZone.layer]}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
