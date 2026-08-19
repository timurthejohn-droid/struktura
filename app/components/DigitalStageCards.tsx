"use client";

import SectionHead from "./SectionHead";
import type { DigitalStage } from "./DigitalStages";
import DigitalStageGraphic from "./DigitalStageGraphic";

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
            <DigitalStageGraphic index={index} />
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
        :global(.stk-svg) {
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
