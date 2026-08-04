"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHead from "./SectionHead";
import Reveal from "./materials/Reveal";

export type DigitalStage = {
  slug: string;
  n: string;
  title: string;
  process: string;
  problems: string[];
  solution: string[];
};

type ListKey = "problems" | "solution";

function AccordionRow({
  label,
  items,
  open,
  accent,
  onToggle,
}: {
  label: string;
  items: string[];
  open: boolean;
  accent?: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`stage-acc ${accent ? "is-accent" : ""}`}>
      <button type="button" onClick={onToggle} aria-expanded={open}>
        <span className="stage-acc-label">{label}</span>
        <span className="stage-acc-count">{String(items.length).padStart(2, "0")}</span>
        <motion.i animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25 }} aria-hidden>
          +
        </motion.i>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="stage-acc-body"
          >
            <ul>
              {items.map((item) => (
                <li key={item}>
                  <b>{accent ? "+" : "—"}</b>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DigitalStages({ stages }: { stages: DigitalStage[] }) {
  const [active, setActive] = useState(0);
  const [openList, setOpenList] = useState<ListKey | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const count = stages.length;
  const selected = stages[active] ?? stages[0];
  const total = String(count).padStart(2, "0");
  const fill = count > 1 ? active / (count - 1) : 0;

  function focusTab(i: number) {
    setActive(i);
    tabRefs.current[i]?.focus();
  }

  function onKeyNav(e: React.KeyboardEvent) {
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = Math.min(count - 1, active + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = Math.max(0, active - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    if (next !== null) {
      e.preventDefault();
      focusTab(next);
    }
  }

  return (
    <section id="stages" className="stages-section bg-coal-deep text-white" aria-label="Этапы цифровой среды">
      <div className="container-x">
        <Reveal>
          <SectionHead index="02" kicker="Этапы цифровой среды" theme="dark" />
          <p className="stages-intro">
            Шесть этапов — один цифровой поток. Нажмите на этап, чтобы раскрыть детали.
          </p>
        </Reveal>

        {/* ─── СХЕМА-ЦЕПОЧКА: все этапы сразу ─── */}
        <div
          className="stages-rail"
          role="tablist"
          aria-label="Этапы цифровой среды"
          aria-orientation="horizontal"
          onKeyDown={onKeyNav}
          style={{ ["--n"]: count, ["--fill"]: fill } as React.CSSProperties}
        >
          <span className="stage-line" aria-hidden />
          <span className="stage-fill" aria-hidden />
          <span className="stage-flowtrack" aria-hidden>
            <span className="stage-flow" />
          </span>

          {stages.map((stage, i) => {
            const state = i === active ? "active" : i < active ? "done" : "todo";
            return (
              <button
                key={stage.slug}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`stage-tab-${stage.slug}`}
                aria-selected={i === active}
                aria-controls="stage-panel"
                tabIndex={i === active ? 0 : -1}
                data-state={state}
                className="stage-node"
                onClick={() => setActive(i)}
              >
                <span className="stage-head" aria-hidden>
                  <span className="stage-marker" />
                </span>
                <span className="stage-num">{stage.n}</span>
                <span className="stage-title">{stage.title}</span>
              </button>
            );
          })}
        </div>

        {/* ─── ПАНЕЛЬ ДЕТАЛЕЙ АКТИВНОГО ЭТАПА ─── */}
        <div
          className="stage-panel"
          id="stage-panel"
          role="tabpanel"
          aria-labelledby={`stage-tab-${selected.slug}`}
          tabIndex={0}
        >
          <span className="stage-panel-watermark" aria-hidden>
            {selected.n}
          </span>
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.slug}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="stage-panel-inner"
            >
              <div className="stage-panel-head">
                <span>Активный этап</span>
                <b>
                  {selected.n} / {total}
                </b>
              </div>

              <h3>{selected.title}</h3>
              <p className="stage-panel-process">{selected.process}</p>

              <div className="stage-accordions">
                <AccordionRow
                  label="Риски этапа"
                  items={selected.problems}
                  open={openList === "problems"}
                  onToggle={() => setOpenList((v) => (v === "problems" ? null : "problems"))}
                />
                <AccordionRow
                  label="Что делает STRUKTURA+"
                  items={selected.solution}
                  accent
                  open={openList === "solution"}
                  onToggle={() => setOpenList((v) => (v === "solution" ? null : "solution"))}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="stage-nav">
            <button
              type="button"
              onClick={() => setActive((v) => Math.max(0, v - 1))}
              disabled={active === 0}
            >
              ← Пред. этап
            </button>
            <div className="stage-dots" aria-hidden>
              {stages.map((s, i) => (
                <i key={s.slug} className={i === active ? "on" : ""} />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setActive((v) => Math.min(count - 1, v + 1))}
              disabled={active === count - 1}
            >
              След. этап →
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stages-section {
          padding: clamp(72px, 10vh, 128px) 0;
          scroll-margin-top: 80px;
        }
        .stages-intro {
          max-width: 720px;
          margin-top: -6px;
          font-family: "Onest", sans-serif;
          font-size: clamp(15px, 1.3vw, 18px);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.55);
        }

        /* ─── RAIL ─── */
        .stages-rail {
          position: relative;
          display: grid;
          grid-template-columns: repeat(var(--n), 1fr);
          margin-top: clamp(44px, 6vh, 72px);
        }
        .stage-line,
        .stage-fill {
          position: absolute;
          top: 22px;
          left: calc(50% / var(--n));
          height: 1px;
        }
        .stage-line {
          width: calc(100% - 100% / var(--n));
          background: rgba(255, 255, 255, 0.14);
        }
        .stage-fill {
          width: calc(var(--fill) * (100% - 100% / var(--n)));
          background: #ff5a00;
          box-shadow: 0 0 12px rgba(255, 90, 0, 0.5);
          transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .stage-flowtrack {
          position: absolute;
          top: 22px;
          left: calc(50% / var(--n));
          width: calc(100% - 100% / var(--n));
          height: 1px;
        }
        .stage-flow {
          position: absolute;
          top: 50%;
          left: 0;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #ff5a00;
          box-shadow: 0 0 10px 2px rgba(255, 90, 0, 0.55);
          transform: translate(-50%, -50%);
          animation: flowX 3.6s linear infinite;
        }
        @keyframes flowX {
          0% { left: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }

        /* ─── NODE ─── */
        .stage-node {
          position: relative;
          z-index: 2;
          display: grid;
          justify-items: center;
          gap: 14px;
          padding: 0 6px 10px;
          background: transparent;
          border: 0;
          cursor: pointer;
          text-align: center;
        }
        .stage-head {
          display: grid;
          place-items: center;
          height: 44px;
        }
        .stage-marker {
          position: relative;
          width: 16px;
          height: 16px;
          background: #141414;
          border: 1px solid rgba(255, 255, 255, 0.34);
          transform: rotate(45deg);
          transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1),
            height 0.3s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease,
            background 0.3s ease, box-shadow 0.3s ease;
        }
        .stage-marker::after {
          content: "";
          position: absolute;
          inset: 4px;
          background: rgba(255, 255, 255, 0.2);
          transition: background 0.3s ease, inset 0.3s ease;
        }
        .stage-num {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.32);
          transition: color 0.25s ease;
        }
        .stage-title {
          font-family: "CoFo Sans Mono", monospace;
          font-size: clamp(11px, 1.05vw, 15px);
          line-height: 1.12;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.46);
          transition: color 0.25s ease;
        }
        .stage-node:hover .stage-title {
          color: rgba(255, 255, 255, 0.82);
        }
        .stage-node:hover .stage-marker {
          border-color: rgba(255, 90, 0, 0.6);
        }
        .stage-node:focus-visible {
          outline: none;
        }
        .stage-node:focus-visible .stage-marker {
          box-shadow: 0 0 0 3px rgba(255, 90, 0, 0.5);
        }

        .stage-node[data-state="done"] .stage-marker {
          border-color: rgba(255, 90, 0, 0.7);
          background: rgba(255, 90, 0, 0.14);
        }
        .stage-node[data-state="done"] .stage-marker::after {
          background: #ff5a00;
        }
        .stage-node[data-state="done"] .stage-num {
          color: rgba(255, 90, 0, 0.7);
        }

        .stage-node[data-state="active"] .stage-marker {
          width: 24px;
          height: 24px;
          border-color: #ff5a00;
          background: rgba(255, 90, 0, 0.12);
          box-shadow: 0 0 0 7px rgba(255, 90, 0, 0.06), 0 0 26px rgba(255, 90, 0, 0.4);
        }
        .stage-node[data-state="active"] .stage-marker::after {
          inset: 5px;
          background: #ff5a00;
        }
        .stage-node[data-state="active"] .stage-num {
          color: #ff5a00;
        }
        .stage-node[data-state="active"] .stage-title {
          color: #ffffff;
        }

        /* ─── PANEL ─── */
        .stage-panel {
          position: relative;
          margin-top: clamp(44px, 6vh, 76px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.02);
          overflow: hidden;
        }
        .stage-panel-watermark {
          position: absolute;
          right: clamp(14px, 2.5vw, 36px);
          top: clamp(2px, 0.8vw, 10px);
          z-index: 0;
          font-family: "CoFo Sans Mono", monospace;
          font-size: clamp(110px, 17vw, 240px);
          line-height: 0.8;
          color: rgba(255, 255, 255, 0.028);
          pointer-events: none;
          user-select: none;
        }
        .stage-panel-inner {
          position: relative;
          z-index: 1;
          padding: clamp(22px, 3vw, 42px);
        }
        .stage-panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.34);
        }
        .stage-panel-head b {
          font-weight: 400;
          color: #ff5a00;
        }
        .stage-panel h3 {
          margin-top: 22px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: clamp(28px, 3.2vw, 48px);
          font-weight: 400;
          line-height: 0.98;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }
        .stage-panel-process {
          max-width: 640px;
          margin-top: 18px;
          font-family: "Onest", sans-serif;
          font-size: clamp(14px, 1.05vw, 16px);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.6);
        }
        .stage-accordions {
          margin-top: clamp(26px, 3vw, 34px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }
        :global(.stage-acc) {
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }
        :global(.stage-acc > button) {
          display: grid;
          width: 100%;
          grid-template-columns: 1fr auto 20px;
          align-items: center;
          gap: 14px;
          padding: 15px 0;
          background: transparent;
          border: 0;
          cursor: pointer;
          text-align: left;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
          transition: color 0.2s ease;
        }
        :global(.stage-acc > button:hover),
        :global(.stage-acc > button[aria-expanded="true"]) {
          color: #ffffff;
        }
        :global(.stage-acc.is-accent > button) {
          color: rgba(255, 90, 0, 0.85);
        }
        :global(.stage-acc-count) {
          font-size: 9px;
          color: rgba(255, 255, 255, 0.28);
        }
        :global(.stage-acc > button i) {
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          color: #ff5a00;
          text-align: center;
        }
        :global(.stage-acc-body) {
          overflow: hidden;
        }
        :global(.stage-acc-body ul) {
          display: grid;
          gap: 2px;
          padding: 2px 0 18px;
        }
        :global(.stage-acc-body li) {
          display: grid;
          grid-template-columns: 20px 1fr;
          gap: 4px;
          padding: 5px 0;
          font-family: "Onest", sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.6);
        }
        :global(.stage-acc-body li b) {
          font-family: "CoFo Sans Mono", monospace;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.26);
        }
        :global(.stage-acc.is-accent .stage-acc-body li) {
          color: rgba(255, 255, 255, 0.82);
        }
        :global(.stage-acc.is-accent .stage-acc-body li b) {
          color: #ff5a00;
        }

        .stage-nav {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin: 0 clamp(24px, 3.5vw, 52px);
          padding: 22px 0 clamp(24px, 3.5vw, 40px);
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }
        .stage-nav button {
          background: transparent;
          border: 0;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .stage-nav button:hover:not(:disabled) {
          color: #ffffff;
        }
        .stage-nav button:disabled {
          opacity: 0.26;
          cursor: default;
        }
        .stage-dots {
          display: flex;
          gap: 8px;
        }
        .stage-dots i {
          width: 6px;
          height: 6px;
          border: 1px solid rgba(255, 255, 255, 0.28);
          transform: rotate(45deg);
          transition: background 0.25s ease, border-color 0.25s ease;
        }
        .stage-dots i.on {
          background: #ff5a00;
          border-color: #ff5a00;
        }

        /* ─── MOBILE: вертикальный степпер ─── */
        @media (max-width: 639px) {
          .stages-rail {
            grid-template-columns: 1fr;
            margin-top: 30px;
          }
          .stage-node {
            grid-template-columns: 48px 1fr auto;
            align-items: center;
            justify-items: start;
            gap: 0 14px;
            height: 64px;
            padding: 0;
            text-align: left;
          }
          .stage-head {
            grid-column: 1;
            height: 64px;
          }
          .stage-title {
            grid-column: 2;
            text-align: left;
          }
          .stage-num {
            grid-column: 3;
          }
          .stage-line,
          .stage-fill,
          .stage-flowtrack {
            top: 32px;
            left: 24px;
            width: 1px;
          }
          .stage-line,
          .stage-flowtrack {
            height: calc(100% - 100% / var(--n));
          }
          .stage-fill {
            height: calc(var(--fill) * (100% - 100% / var(--n)));
            width: 1px;
            transition: height 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          }
          .stage-flow {
            left: 50%;
            top: 0;
            animation: flowY 3.6s linear infinite;
          }
        }
        @keyframes flowY {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .stage-flow {
            display: none;
          }
          .stage-fill,
          .stage-marker,
          .stage-marker::after {
            transition-duration: 0ms;
          }
        }
      `}</style>
    </section>
  );
}
