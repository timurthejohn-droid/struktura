"use client";

import { useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import SectionHead from "./SectionHead";
import type { DigitalStage } from "./DigitalStages";

/* ── per-stage brand graphic (abstract, our visual language) ── */
function StageGraphic({ index }: { index: number }) {
  const O = "#ff5a00";
  const W = "rgba(255,255,255,0.55)";
  const D = "rgba(255,255,255,0.22)";
  const common = {
    viewBox: "0 0 220 180",
    fill: "none" as const,
    className: "sc-svg",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (index) {
    case 0: // Предпроект — концепт-рамка, ограничения
      return (
        <svg {...common}>
          <rect x="34" y="30" width="152" height="120" stroke={D} strokeWidth="1" strokeDasharray="4 5" />
          <path d="M34 30 L186 150" stroke={D} strokeWidth="1" />
          <path d="M34 46 L34 30 L50 30" stroke={W} strokeWidth="1.5" />
          <path d="M170 150 L186 150 L186 134" stroke={W} strokeWidth="1.5" />
          <rect x="96" y="76" width="28" height="28" stroke={O} strokeWidth="1.5" transform="rotate(45 110 90)" />
          <circle cx="110" cy="90" r="3" fill={O} />
        </svg>
      );
    case 1: // R&D — параметрическая сеть узлов
      return (
        <svg {...common}>
          {[
            [46, 58], [110, 38], [176, 66], [70, 120], [140, 128], [110, 90],
          ].map((p, i) => (
            <g key={i}>
              {i < 5 && (
                <line
                  x1={p[0]}
                  y1={p[1]}
                  x2={110}
                  y2={90}
                  stroke={D}
                  strokeWidth="1"
                />
              )}
            </g>
          ))}
          <line x1="46" y1="58" x2="176" y2="66" stroke={D} strokeWidth="1" />
          <line x1="70" y1="120" x2="140" y2="128" stroke={D} strokeWidth="1" />
          {[[46, 58], [110, 38], [176, 66], [70, 120], [140, 128]].map((p, i) => (
            <rect key={i} x={p[0] - 5} y={p[1] - 5} width="10" height="10" stroke={W} strokeWidth="1.4" transform={`rotate(45 ${p[0]} ${p[1]})`} />
          ))}
          <rect x="102" y="82" width="16" height="16" fill={O} transform="rotate(45 110 90)" />
        </svg>
      );
    case 2: // Проектирование — слои чертежей + размерная линия
      return (
        <svg {...common}>
          <rect x="52" y="44" width="120" height="86" stroke={D} strokeWidth="1" />
          <rect x="44" y="52" width="120" height="86" stroke={D} strokeWidth="1" />
          <rect x="36" y="60" width="120" height="86" stroke={W} strokeWidth="1.5" />
          <line x1="36" y1="60" x2="156" y2="60" stroke={O} strokeWidth="1.5" />
          <line x1="36" y1="146" x2="156" y2="146" stroke={O} strokeWidth="1.5" strokeDasharray="3 4" />
          <path d="M180 60 L180 146 M176 66 L180 60 L184 66 M176 140 L180 146 L184 140" stroke={O} strokeWidth="1.2" />
          <circle cx="96" cy="103" r="10" stroke={W} strokeWidth="1.2" />
        </svg>
      );
    case 3: // Производство — ЧПУ-траектория и «голова»
      return (
        <svg {...common}>
          <rect x="40" y="34" width="140" height="112" stroke={D} strokeWidth="1" />
          <path
            d="M56 50 H164 M164 50 V72 M164 72 H56 M56 72 V94 M56 94 H164 M164 94 V116 M164 116 H56 M56 116 V132"
            stroke={W}
            strokeWidth="1.4"
          />
          <rect x="96" y="86" width="16" height="16" fill={O} />
          <path d="M104 78 V86 M104 102 V110" stroke={O} strokeWidth="1.4" />
        </svg>
      );
    case 4: // Логистика — маршрут с точками и стрелкой
      return (
        <svg {...common}>
          <path d="M34 132 C 70 132, 74 60, 110 60 S 150 120, 186 60" stroke={W} strokeWidth="1.5" strokeDasharray="5 6" />
          {[[34, 132], [110, 60], [186, 60]].map((p, i) => (
            <rect key={i} x={p[0] - 5} y={p[1] - 5} width="10" height="10" stroke={O} strokeWidth="1.5" transform={`rotate(45 ${p[0]} ${p[1]})`} />
          ))}
          <path d="M178 52 L186 60 L178 68" stroke={O} strokeWidth="1.5" />
          <rect x="96" y="112" width="26" height="20" stroke={D} strokeWidth="1.2" />
          <path d="M96 118 H122" stroke={D} strokeWidth="1.2" />
        </svg>
      );
    default: // Монтаж — сборочная сетка фасада
      return (
        <svg {...common}>
          {Array.from({ length: 3 }).map((_, r) =>
            Array.from({ length: 4 }).map((__, c) => (
              <rect
                key={`${r}-${c}`}
                x={44 + c * 34}
                y={40 + r * 34}
                width="30"
                height="30"
                stroke={D}
                strokeWidth="1"
              />
            ))
          )}
          <rect x="78" y="74" width="30" height="30" stroke={O} strokeWidth="1.6" fill="rgba(255,90,0,0.12)" />
          <rect x="112" y="74" width="30" height="30" stroke={O} strokeWidth="1.6" fill="rgba(255,90,0,0.12)" />
          <path d="M150 89 H128 M134 83 L128 89 L134 95" stroke={O} strokeWidth="1.4" />
        </svg>
      );
  }
}

function StageSlide({
  stage,
  index,
  count,
  open,
  onToggle,
}: {
  stage: DigitalStage;
  index: number;
  count: number;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="sc-slide">
      <div className={`sc-card ${open ? "risks-open" : ""}`}>
        <div className="sc-left">
          <div className="sc-eyebrow">
            <span className="sc-eyebrow-idx">{stage.n}</span>
            <span>STRUKTURA+ / Решение</span>
          </div>
          <h3 className="sc-title">{stage.title}</h3>

          <div className="sc-sol">
            <span className="sc-sol-cap">Что делает STRUKTURA+</span>
            <ul>
              {stage.solution.map((s) => (
                <li key={s}>
                  <b>+</b>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <button type="button" className="sc-risk-btn" onClick={onToggle} aria-expanded={open}>
            <span>{open ? "Скрыть риски этапа" : "Риски этапа"}</span>
            <i className="sc-risk-count">{String(stage.problems.length).padStart(2, "0")}</i>
            <i className={`sc-risk-plus ${open ? "on" : ""}`} aria-hidden>
              +
            </i>
          </button>
        </div>

        <div className="sc-right" aria-hidden={false}>
          <span className="sc-bignum" aria-hidden>
            {stage.n}
          </span>
          <div className="sc-graphic">
            <StageGraphic index={index} />
          </div>

          {/* risks slide-out */}
          <div className="sc-risks" role="region" aria-label={`Риски этапа ${stage.title}`}>
            <div className="sc-risks-head">
              <span>Риски рынка на этапе</span>
              <span>
                {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
            </div>
            <ul>
              {stage.problems.map((p) => (
                <li key={p}>
                  <b>—</b>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DigitalStageCards({ stages }: { stages: DigitalStage[] }) {
  const count = stages.length;
  const [active, setActive] = useState(0);
  const [risksOpen, setRisksOpen] = useState(false);

  const go = (next: number) => {
    const clamped = Math.min(count - 1, Math.max(0, next));
    if (clamped !== active) {
      setRisksOpen(false);
      setActive(clamped);
    }
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70 || info.velocity.x < -400) go(active + 1);
    else if (info.offset.x > 70 || info.velocity.x > 400) go(active - 1);
  };

  return (
    <section className="sc-section bg-coal text-white" aria-label="Решения STRUKTURA по этапам">
      <div className="container-x">
        <SectionHead index="03" kicker="Решения по этапам" theme="dark" />
        <p className="sc-intro">
          Листайте этапы. Слева — что делает STRUKTURA+ на этом шаге, справа — как это выглядит
          в нашей работе. Риски рынка — по кнопке.
        </p>

        <div className="sc-viewport">
          <motion.div
            className="sc-track"
            animate={{ x: `-${active * 100}%` }}
            transition={{ type: "spring", stiffness: 260, damping: 34 }}
            drag="x"
            dragElastic={0.14}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={onDragEnd}
          >
            {stages.map((stage, i) => (
              <StageSlide
                key={stage.slug}
                stage={stage}
                index={i}
                count={count}
                open={risksOpen && i === active}
                onToggle={() => setRisksOpen((v) => !v)}
              />
            ))}
          </motion.div>
        </div>

        <div className="sc-nav">
          <button
            type="button"
            className="sc-arrow"
            onClick={() => go(active - 1)}
            disabled={active === 0}
            aria-label="Предыдущий этап"
          >
            ←
          </button>

          <div className="sc-dots" role="tablist" aria-label="Этапы">
            {stages.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={s.title}
                className={`sc-dot ${i === active ? "on" : ""}`}
                onClick={() => go(i)}
              >
                <i />
              </button>
            ))}
          </div>

          <span className="sc-index">
            <b>{String(active + 1).padStart(2, "0")}</b> / {String(count).padStart(2, "0")}
          </span>

          <button
            type="button"
            className="sc-arrow"
            onClick={() => go(active + 1)}
            disabled={active === count - 1}
            aria-label="Следующий этап"
          >
            →
          </button>
        </div>
      </div>

      <style jsx global>{`
        .sc-section {
          padding: clamp(64px, 9vh, 120px) 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .sc-intro {
          max-width: 620px;
          margin: -6px 0 clamp(34px, 5vh, 56px);
          font-family: "Onest", sans-serif;
          font-size: clamp(14px, 1.15vw, 17px);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.55);
        }

        .sc-viewport {
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: #131313;
        }
        .sc-track {
          display: flex;
          cursor: grab;
        }
        .sc-track:active {
          cursor: grabbing;
        }
        .sc-slide {
          flex: 0 0 100%;
          min-width: 0;
        }
        .sc-card {
          display: grid;
          grid-template-columns: 1.02fr 0.98fr;
          min-height: 420px;
        }

        /* left */
        .sc-left {
          display: flex;
          flex-direction: column;
          padding: clamp(26px, 3.4vw, 52px);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }
        .sc-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
        }
        .sc-eyebrow-idx {
          color: #ff5a00;
        }
        .sc-title {
          margin-top: 16px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: clamp(26px, 2.9vw, 44px);
          font-weight: 400;
          line-height: 0.98;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }
        .sc-sol {
          margin-top: clamp(22px, 3vw, 34px);
        }
        .sc-sol-cap {
          display: block;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 90, 0, 0.85);
        }
        .sc-sol ul {
          margin-top: 14px;
          display: grid;
          gap: 7px;
          list-style: none;
        }
        .sc-sol li {
          display: grid;
          grid-template-columns: 18px 1fr;
          gap: 4px;
          font-family: "Onest", sans-serif;
          font-size: clamp(13px, 1vw, 15px);
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.82);
        }
        .sc-sol li b {
          font-family: "CoFo Sans Mono", monospace;
          font-weight: 400;
          color: #ff5a00;
        }
        .sc-risk-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: auto;
          padding-top: clamp(20px, 3vw, 30px);
          background: transparent;
          border: 0;
          cursor: pointer;
          text-align: left;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.62);
          transition: color 0.2s ease;
        }
        .sc-risk-btn:hover {
          color: #ffffff;
        }
        .sc-risk-count {
          font-style: normal;
          font-size: 9px;
          color: rgba(255, 255, 255, 0.3);
        }
        .sc-risk-plus {
          margin-left: auto;
          display: grid;
          place-items: center;
          width: 26px;
          height: 26px;
          border: 1px solid rgba(255, 90, 0, 0.5);
          color: #ff5a00;
          font-style: normal;
          font-size: 16px;
          transition: transform 0.3s ease, background 0.2s ease;
        }
        .sc-risk-btn:hover .sc-risk-plus {
          background: rgba(255, 90, 0, 0.1);
        }
        .sc-risk-plus.on {
          transform: rotate(45deg);
        }

        /* right */
        .sc-right {
          position: relative;
          overflow: hidden;
          display: grid;
          place-items: center;
          background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        .sc-bignum {
          position: absolute;
          right: clamp(10px, 2vw, 26px);
          bottom: -6px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: clamp(120px, 16vw, 210px);
          line-height: 0.8;
          color: rgba(255, 255, 255, 0.04);
          pointer-events: none;
        }
        .sc-graphic {
          position: relative;
          z-index: 1;
          width: min(78%, 340px);
        }
        .sc-svg {
          width: 100%;
          height: auto;
          display: block;
        }

        /* risks slide-out */
        .sc-risks {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          flex-direction: column;
          padding: clamp(24px, 3vw, 44px);
          background: #0b0b0b;
          border-left: 2px solid #ff5a00;
          transform: translateX(101%);
          transition: transform 0.44s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sc-card.risks-open .sc-risks {
          transform: translateX(0);
        }
        .sc-risks-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.42);
        }
        .sc-risks ul {
          margin-top: 18px;
          display: grid;
          gap: 9px;
          list-style: none;
          align-content: start;
          min-height: 0;
          overflow-y: auto;
        }
        .sc-risks li {
          display: grid;
          grid-template-columns: 18px 1fr;
          gap: 4px;
          font-family: "Onest", sans-serif;
          font-size: clamp(13px, 1vw, 15px);
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.62);
        }
        .sc-risks li b {
          font-family: "CoFo Sans Mono", monospace;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.32);
        }

        /* nav */
        .sc-nav {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-top: 24px;
        }
        .sc-arrow {
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease, opacity 0.2s ease;
        }
        .sc-arrow:hover:not(:disabled) {
          border-color: #ff5a00;
          background: rgba(255, 90, 0, 0.1);
        }
        .sc-arrow:disabled {
          opacity: 0.28;
          cursor: default;
        }
        .sc-dots {
          display: flex;
          gap: 9px;
        }
        .sc-dot {
          padding: 8px 2px;
          background: transparent;
          border: 0;
          cursor: pointer;
        }
        .sc-dot i {
          display: block;
          width: 8px;
          height: 8px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transform: rotate(45deg);
          transition: background 0.25s ease, border-color 0.25s ease;
        }
        .sc-dot.on i {
          background: #ff5a00;
          border-color: #ff5a00;
        }
        .sc-index {
          margin-left: auto;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.4);
        }
        .sc-index b {
          font-weight: 400;
          color: #ff5a00;
        }

        /* mobile */
        @media (max-width: 767px) {
          .sc-card {
            grid-template-columns: 1fr;
            min-height: 0;
          }
          .sc-left {
            border-right: 0;
            order: 1;
          }
          .sc-right {
            order: 0;
            min-height: 248px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          .sc-risk-btn {
            margin-top: 22px;
          }
          .sc-index {
            display: none;
          }
          .sc-nav {
            gap: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sc-risks {
            transition-duration: 0.001ms;
          }
        }
      `}</style>
    </section>
  );
}
