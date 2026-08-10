"use client";

import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";

export type DigitalStage = {
  slug: string;
  n: string;
  title: string;
  process: string;
  problems: string[];
  solution: string[];
  actions?: { do: string; value: string }[];
};

function StageCard({
  stage,
  side,
  leftPct,
  revealed,
}: {
  stage: DigitalStage;
  side: "top" | "bottom";
  leftPct: number;
  revealed: boolean;
}) {
  return (
    <div className={`tl-card-pos ${side}`} style={{ left: `${leftPct}%` }}>
      <span className={`tl-stem ${revealed ? "on" : ""}`} aria-hidden />
      <span className={`tl-marker ${revealed ? "on" : ""}`} aria-hidden>
        <i />
      </span>

      <div className={`tl-card ${revealed ? "reveal-on" : ""}`}>
        <div className="tl-card-face">
          <span className="tl-card-num">{stage.n}</span>
          <h3 className="tl-card-title">{stage.title}</h3>
          <p className="tl-card-process">{stage.process}</p>
        </div>
      </div>
    </div>
  );
}

export default function DigitalStages({ stages }: { stages: DigitalStage[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const count = stages.length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress: MotionValue<number> = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 28,
    mass: 0.3,
  });

  // scroll 0→1 mapped onto the span between first and last marker (small tails)
  const eased = useTransform(progress, (v) => Math.min(1, Math.max(0, (v - 0.04) / 0.9)));
  const fillW = useTransform(eased, (v) => `${v * 100}%`);

  const [revealed, setRevealed] = useState(0);
  useMotionValueEvent(eased, "change", (v) => {
    let c = 0;
    for (let i = 0; i < count; i++) {
      if (v >= (i + 0.5) / count - 0.06) c = i + 1;
    }
    setRevealed(c);
  });

  const shownCount = reduced ? count : revealed;

  return (
    <section
      id="stages"
      ref={sectionRef}
      className="tl-section bg-coal-deep text-white"
      aria-label="Этапы цифровой среды"
      style={{ height: `${Math.max(230, count * 34 + 80)}svh` }}
    >
      <div className="tl-sticky">
        <span
          aria-hidden
          className="tl-grid"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="tl-header container-x">
          <div className="tl-meta">
            <span className="tl-meta-idx">02</span>
            <span>Этапы цифровой среды</span>
            <span className="tl-meta-mark" aria-hidden>
              STRUKTURA<i>+</i>
            </span>
          </div>
          <h2 className="tl-title">
            Путь проекта <span className="text-orange">в цифровой среде</span>
          </h2>
          <p className="tl-intro">
            Скролльте — этапы появляются вдоль линии по ходу процесса: от первого расчёта до
            монтажа.
          </p>
        </div>

        <div className="tl-timeline">
          <div className="tl-track container-x">
            <div className="tl-lines-wrap">
              <span className="tl-line-base" aria-hidden />
              <motion.span
                className="tl-line-fill"
                aria-hidden
                style={reduced ? { width: "100%" } : { width: fillW }}
              />
              {!reduced && (
                <motion.span className="tl-line-head" aria-hidden style={{ left: fillW }}>
                  <i />
                </motion.span>
              )}
              <span className="tl-line-arrow" aria-hidden />

              {stages.map((stage, i) => (
                <StageCard
                  key={stage.slug}
                  stage={stage}
                  side={i % 2 === 0 ? "top" : "bottom"}
                  leftPct={((i + 0.5) / count) * 100}
                  revealed={i < shownCount}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="tl-foot container-x">
          <span className="tl-progress-read">
            <b>{String(Math.min(count, Math.max(1, shownCount))).padStart(2, "0")}</b> /{" "}
            {String(count).padStart(2, "0")}
          </span>
          <span className="tl-hint" aria-hidden>
            scroll →
          </span>
        </div>
      </div>

      <style jsx global>{`
        .tl-section {
          position: relative;
          scroll-margin-top: 80px;
        }
        .tl-sticky {
          position: sticky;
          top: 72px;
          display: flex;
          flex-direction: column;
          height: calc(100svh - 72px);
          min-height: 600px;
          overflow: hidden;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }
        .tl-grid {
          position: absolute;
          inset: 0;
          opacity: 0.1;
          pointer-events: none;
        }

        /* ── header ── */
        .tl-header {
          position: relative;
          z-index: 3;
          width: 100%;
          padding-top: clamp(26px, 4.5vh, 54px);
        }
        .tl-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
        }
        .tl-meta-idx {
          color: #ff5a00;
        }
        .tl-meta-mark {
          margin-left: auto;
          letter-spacing: 0.3em;
          color: rgba(255, 255, 255, 0.16);
        }
        .tl-meta-mark i {
          font-size: 8px;
          vertical-align: super;
          font-style: normal;
        }
        .tl-title {
          margin-top: 16px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: clamp(26px, 3.4vw, 50px);
          line-height: 0.98;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }
        .tl-intro {
          max-width: 560px;
          margin-top: 14px;
          font-family: "Onest", sans-serif;
          font-size: clamp(13px, 1vw, 15px);
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.5);
        }

        /* ── timeline ── */
        .tl-timeline {
          position: relative;
          z-index: 2;
          flex: 1;
          display: flex;
          align-items: center;
          min-height: 0;
        }
        .tl-track {
          width: 100%;
        }
        .tl-lines-wrap {
          position: relative;
          height: min(360px, 46vh);
        }
        .tl-line-base,
        .tl-line-fill {
          position: absolute;
          top: 50%;
          left: 0;
          height: 1px;
          transform: translateY(-50%);
        }
        .tl-line-base {
          right: 0;
          background: rgba(255, 255, 255, 0.16);
        }
        .tl-line-fill {
          width: 0;
          background: #ff5a00;
          box-shadow: 0 0 14px rgba(255, 90, 0, 0.5);
        }
        .tl-line-head {
          position: absolute;
          top: 50%;
          width: 0;
          height: 0;
          transform: translate(-50%, -50%);
          z-index: 5;
        }
        .tl-line-head i {
          position: absolute;
          left: 0;
          top: 0;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #ff5a00;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 0 5px rgba(255, 90, 0, 0.12), 0 0 20px 3px rgba(255, 90, 0, 0.7);
        }
        .tl-line-arrow {
          position: absolute;
          top: 50%;
          right: -2px;
          width: 0;
          height: 0;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-left: 9px solid rgba(255, 255, 255, 0.4);
          transform: translateY(-50%);
        }

        /* ── stage marker + stem ── */
        .tl-card-pos {
          position: absolute;
          top: 0;
          bottom: 0;
          width: clamp(150px, 15vw, 208px);
          margin-left: calc(clamp(150px, 15vw, 208px) / -2);
        }
        .tl-marker {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 15px;
          height: 15px;
          transform: translate(-50%, -50%) rotate(45deg);
          border: 1px solid rgba(255, 255, 255, 0.34);
          background: #121212;
          z-index: 4;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
        }
        .tl-marker i {
          position: absolute;
          inset: 3px;
          background: rgba(255, 255, 255, 0.18);
          transition: background 0.3s ease;
        }
        .tl-marker.on {
          border-color: #ff5a00;
          background: rgba(255, 90, 0, 0.12);
          box-shadow: 0 0 0 6px rgba(255, 90, 0, 0.05), 0 0 20px rgba(255, 90, 0, 0.35);
        }
        .tl-marker.on i {
          background: #ff5a00;
        }
        .tl-stem {
          position: absolute;
          left: 50%;
          width: 1px;
          height: calc(50% - 7px);
          background: rgba(255, 255, 255, 0.12);
          transform: translateX(-50%);
          transition: background 0.35s ease;
        }
        .tl-card-pos.top .tl-stem {
          top: 0;
        }
        .tl-card-pos.bottom .tl-stem {
          bottom: 0;
        }
        .tl-stem.on {
          background: rgba(255, 90, 0, 0.4);
        }

        /* ── card (name + short process only) ── */
        .tl-card {
          position: absolute;
          left: 50%;
          width: 100%;
          opacity: 0;
          transform: translateX(-50%) translateY(var(--rev-y, 0));
          transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .tl-card-pos.top .tl-card {
          bottom: calc(50% + 30px);
          --rev-y: 14px;
        }
        .tl-card-pos.bottom .tl-card {
          top: calc(50% + 30px);
          --rev-y: -14px;
        }
        .tl-card.reveal-on {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        .tl-card-face {
          padding: 15px 15px 16px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-left: 2px solid rgba(255, 90, 0, 0.55);
          background: #131313;
        }
        .tl-card-num {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          color: #ff5a00;
        }
        .tl-card-title {
          margin-top: 8px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: clamp(15px, 1.3vw, 20px);
          font-weight: 400;
          line-height: 1.02;
          text-transform: uppercase;
        }
        .tl-card-process {
          margin-top: 9px;
          font-family: "Onest", sans-serif;
          font-size: 12px;
          line-height: 1.42;
          color: rgba(255, 255, 255, 0.56);
        }

        /* ── footer ── */
        .tl-foot {
          position: relative;
          z-index: 3;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: clamp(20px, 3vh, 34px);
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .tl-progress-read {
          color: rgba(255, 255, 255, 0.4);
        }
        .tl-progress-read b {
          font-weight: 400;
          color: #ff5a00;
        }
        .tl-hint {
          color: rgba(255, 255, 255, 0.3);
        }

        /* ── tablet ── */
        @media (max-width: 1023px) {
          .tl-card-pos {
            width: clamp(132px, 20vw, 180px);
            margin-left: calc(clamp(132px, 20vw, 180px) / -2);
          }
        }

        /* ── mobile: vertical stacked reveal ── */
        @media (max-width: 767px) {
          .tl-section {
            height: auto !important;
          }
          .tl-sticky {
            position: static;
            height: auto;
            min-height: 0;
            padding-bottom: 8px;
          }
          .tl-grid {
            display: none;
          }
          .tl-title {
            font-size: clamp(24px, 8vw, 34px);
          }
          .tl-timeline {
            display: block;
            padding-top: 34px;
          }
          .tl-lines-wrap {
            height: auto;
          }
          .tl-line-base,
          .tl-line-fill,
          .tl-line-head,
          .tl-line-arrow {
            display: none;
          }
          .tl-card-pos {
            position: relative;
            left: 0 !important;
            top: auto;
            bottom: auto;
            width: 100%;
            margin: 0 0 14px;
            padding-left: 30px;
          }
          .tl-marker {
            left: 8px;
            top: 22px;
          }
          .tl-stem {
            left: 8px;
            top: 22px !important;
            bottom: auto !important;
            width: 1px;
            height: calc(100% + 14px);
            background: rgba(255, 255, 255, 0.14);
          }
          .tl-card,
          .tl-card-pos.top .tl-card,
          .tl-card-pos.bottom .tl-card {
            position: relative;
            left: 0;
            top: auto;
            bottom: auto;
            width: 100%;
            opacity: 1 !important;
            transform: none !important;
          }
          .tl-card-face {
            padding: 14px 15px 15px;
          }
          .tl-card-process {
            font-size: 13px;
          }
          .tl-foot {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .tl-card {
            transition-duration: 0.001ms;
          }
        }
      `}</style>
    </section>
  );
}
