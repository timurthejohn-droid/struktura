"use client";

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
    className: "stk-svg",
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
          {[[46, 58], [110, 38], [176, 66], [70, 120], [140, 128]].map((p, i) => (
            <line key={i} x1={p[0]} y1={p[1]} x2={110} y2={90} stroke={D} strokeWidth="1" />
          ))}
          <line x1="46" y1="58" x2="176" y2="66" stroke={D} strokeWidth="1" />
          <line x1="70" y1="120" x2="140" y2="128" stroke={D} strokeWidth="1" />
          {[[46, 58], [110, 38], [176, 66], [70, 120], [140, 128]].map((p, i) => (
            <rect key={`n${i}`} x={p[0] - 5} y={p[1] - 5} width="10" height="10" stroke={W} strokeWidth="1.4" transform={`rotate(45 ${p[0]} ${p[1]})`} />
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

function StackCard({
  stage,
  index,
  count,
}: {
  stage: DigitalStage;
  index: number;
  count: number;
}) {
  return (
    <article
      className="stk-card"
      style={{ ["--i" as string]: index, zIndex: index + 1 } as React.CSSProperties}
    >
      <div className="stk-tab">
        <span className="stk-tab-num">{stage.n}</span>
        <span className="stk-tab-title">{stage.title}</span>
        <span className="stk-tab-count">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
      </div>

      <div className="stk-body">
        <div className="stk-left">
          <span className="stk-eyebrow">STRUKTURA+ / Решение</span>
          <h3 className="stk-title">{stage.title}</h3>
          <p className="stk-process">{stage.process}</p>

          <div className="stk-sol">
            <span className="stk-sol-cap">Что делает STRUKTURA+</span>
            <ul>
              {(stage.actions ?? stage.solution.map((s) => ({ do: s, value: "" }))).map((a) => (
                <li key={a.do}>
                  <b>+</b>
                  <div className="stk-sol-txt">
                    <span className="stk-sol-do">{a.do}</span>
                    {a.value ? <span className="stk-sol-val">{a.value}</span> : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="stk-right">
          <span className="stk-bignum" aria-hidden>
            {stage.n}
          </span>
          <div className="stk-graphic">
            <StageGraphic index={index} />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function DigitalStageCards({ stages }: { stages: DigitalStage[] }) {
  const count = stages.length;

  return (
    <section className="stk-section bg-coal text-white" aria-label="Решения STRUKTURA по этапам">
      <div className="container-x">
        <SectionHead index="03" kicker="Решения по этапам" theme="dark" />
        <p className="stk-intro">
          Скролльте — карточки этапов накатываются друг на друга. Слева — что делает STRUKTURA+
          на этом шаге, справа — как это выглядит в нашей работе.
        </p>
      </div>

      <div className="stk-cards container-x">
        {stages.map((stage, i) => (
          <StackCard key={stage.slug} stage={stage} index={i} count={count} />
        ))}
      </div>

      <style jsx global>{`
        .stk-section {
          padding: clamp(64px, 9vh, 120px) 0 clamp(48px, 7vh, 96px);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .stk-intro {
          max-width: 620px;
          margin: -6px 0 clamp(30px, 4vh, 48px);
          font-family: "Onest", sans-serif;
          font-size: clamp(14px, 1.15vw, 17px);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.55);
        }

        .stk-cards {
          position: relative;
        }
        .stk-card {
          position: sticky;
          top: calc(78px + var(--i) * 46px);
          margin-bottom: 26px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: #141414;
          box-shadow: 0 -1px 0 rgba(255, 90, 0, 0.4), 0 -22px 46px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }
        .stk-card:last-child {
          margin-bottom: 0;
        }
        .stk-tab {
          display: flex;
          align-items: center;
          gap: 14px;
          height: 46px;
          padding: 0 clamp(20px, 3vw, 40px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: #171717;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 12px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .stk-tab-num {
          color: #ff5a00;
        }
        .stk-tab-count {
          margin-left: auto;
          font-size: 10px;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.32);
        }
        .stk-body {
          display: grid;
          grid-template-columns: 1.02fr 0.98fr;
          min-height: min(62vh, 470px);
        }

        /* left */
        .stk-left {
          display: flex;
          flex-direction: column;
          padding: clamp(26px, 3.4vw, 52px);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }
        .stk-eyebrow {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
        }
        .stk-title {
          margin-top: 16px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: clamp(26px, 2.9vw, 44px);
          font-weight: 400;
          line-height: 0.98;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }
        .stk-process {
          margin-top: 14px;
          max-width: 460px;
          font-family: "Onest", sans-serif;
          font-size: clamp(13px, 1vw, 15px);
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.55);
        }
        .stk-sol {
          margin-top: auto;
          padding-top: clamp(22px, 3vw, 32px);
        }
        .stk-sol-cap {
          display: block;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 90, 0, 0.85);
        }
        .stk-sol ul {
          margin-top: 16px;
          display: grid;
          gap: 13px;
          list-style: none;
        }
        .stk-sol li {
          display: grid;
          grid-template-columns: 18px 1fr;
          gap: 6px;
          font-family: "Onest", sans-serif;
          font-size: clamp(13px, 1vw, 15px);
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.82);
        }
        .stk-sol li b {
          font-family: "CoFo Sans Mono", monospace;
          font-weight: 400;
          color: #ff5a00;
        }
        .stk-sol-txt {
          display: block;
          min-width: 0;
        }
        .stk-sol-do {
          display: block;
          color: rgba(255, 255, 255, 0.9);
        }
        .stk-sol-val {
          display: block;
          margin-top: 3px;
          font-size: clamp(12px, 0.9vw, 13.5px);
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.46);
        }
        .stk-sol-txt {
          display: grid;
          gap: 2px;
        }
        .stk-sol-do {
          color: rgba(255, 255, 255, 0.9);
        }
        .stk-sol-val {
          font-size: clamp(12px, 0.92vw, 13.5px);
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.48);
        }

        /* right */
        .stk-right {
          position: relative;
          overflow: hidden;
          display: grid;
          place-items: center;
          background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        .stk-bignum {
          position: absolute;
          right: clamp(10px, 2vw, 26px);
          bottom: -6px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: clamp(120px, 16vw, 210px);
          line-height: 0.8;
          color: rgba(255, 255, 255, 0.04);
          pointer-events: none;
        }
        .stk-graphic {
          position: relative;
          z-index: 1;
          width: min(78%, 340px);
        }
        .stk-svg {
          width: 100%;
          height: auto;
          display: block;
        }

        /* mobile */
        @media (max-width: 767px) {
          .stk-card {
            top: calc(66px + var(--i) * 42px);
          }
          .stk-body {
            grid-template-columns: 1fr;
            min-height: 0;
          }
          .stk-left {
            order: 1;
            border-right: 0;
          }
          .stk-right {
            order: 0;
            min-height: 200px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          .stk-process {
            max-width: none;
          }
          .stk-sol {
            margin-top: 22px;
          }
        }
      `}</style>
    </section>
  );
}
