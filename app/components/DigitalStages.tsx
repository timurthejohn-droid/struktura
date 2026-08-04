"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  type MotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

export type DigitalStage = {
  slug: string;
  n: string;
  title: string;
  process: string;
  problems: string[];
  solution: string[];
};

type AccordionKey = "problems" | "solution";

function ReadoutAccordion({
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
    <div className={`readout-accordion ${accent ? "is-accent" : ""}`}>
      <button type="button" onClick={onToggle} aria-expanded={open}>
        <span>{label}</span>
        <span className="readout-accordion-count">{String(items.length).padStart(2, "0")}</span>
        <motion.i animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25 }} aria-hidden>+</motion.i>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="readout-accordion-body"
          >
            <ul>
              {items.map((item) => (
                <li key={item}><b>{accent ? "+" : "—"}</b><span>{item}</span></li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ConveyorStage({
  stage,
  index,
  count,
  progress,
  active,
}: {
  stage: DigitalStage;
  index: number;
  count: number;
  progress: MotionValue<number>;
  active: boolean;
}) {
  const y = useTransform(progress, (value) => `${(index - value * (count - 1)) * 12}vh`);
  const opacity = useTransform(progress, (value) => {
    const distance = Math.abs(index - value * (count - 1));
    return Math.max(0.12, 1 - distance * 0.3);
  });
  const scale = useTransform(progress, (value) => {
    const distance = Math.abs(index - value * (count - 1));
    return Math.max(0.88, 1 - distance * 0.045);
  });

  return (
    <motion.div
      className={`conveyor-stage ${active ? "is-active" : ""}`}
      style={{ y, opacity, scale }}
      aria-hidden={!active}
    >
      <span className="conveyor-stage-index">{stage.n}</span>
      <span className="conveyor-stage-node" aria-hidden>
        <span />
      </span>
      <span className="conveyor-stage-title">{stage.title}</span>
      <span className="conveyor-stage-line" aria-hidden />
    </motion.div>
  );
}

export default function DigitalStages({ stages }: { stages: DigitalStage[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<AccordionKey | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 160, damping: 32, mass: 0.3 });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActive(Math.min(stages.length - 1, Math.max(0, Math.round(value * (stages.length - 1)))));
  });

  const selected = stages[active] ?? stages[0];

  return (
    <section
      ref={sectionRef}
      className="relative bg-coal-deep text-white"
      style={{ height: `${Math.max(210, stages.length * 35)}svh` }}
      aria-label="Этапы цифровой среды"
    >
      <div className="scanner-viewport sticky top-[72px] overflow-hidden bg-coal-deep">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.11]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="scanner-meta">
          <span>02 · Этапы цифровой среды</span>
          <span>{selected.n} / {String(stages.length).padStart(2, "0")}</span>
        </div>

        <div className="scanner-layout">
          <div className="scanner-scheme">
            <div className="scanner-brand">
              <span className="scanner-brand-mark" aria-hidden />
              <div>
                <span>Единая платформа</span>
                <strong>STRUKTURA+ DIGITAL</strong>
              </div>
            </div>

            <div className="scanner-track" aria-hidden>
              <span className="scanner-track-base" />
              <motion.span className="scanner-track-progress" style={{ scaleY: smoothProgress }} />
            </div>

            <div className="scanner-focus" aria-hidden />

            <div className="scanner-conveyor">
              {stages.map((stage, index) => (
                <ConveyorStage
                  key={stage.slug}
                  stage={stage}
                  index={index}
                  count={stages.length}
                  progress={smoothProgress}
                  active={active === index}
                />
              ))}
            </div>

          </div>

          <div className="scanner-readout" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                className="scanner-readout-content"
              >
                <div className="scanner-readout-head">
                  <span>Активный этап</span>
                  <b>{selected.n} / {String(stages.length).padStart(2, "0")}</b>
                </div>
                <h3>{selected.title}</h3>
                <p>{selected.process}</p>

                <div className="scanner-accordions">
                  <ReadoutAccordion
                    label="Риски этапа"
                    items={selected.problems}
                    open={openAccordion === "problems"}
                    onToggle={() => setOpenAccordion((value) => (value === "problems" ? null : "problems"))}
                  />
                  <ReadoutAccordion
                    label="Что делает STRUKTURA+"
                    items={selected.solution}
                    open={openAccordion === "solution"}
                    accent
                    onToggle={() => setOpenAccordion((value) => (value === "solution" ? null : "solution"))}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="scanner-hint">scroll · этапы цифрового цикла</div>
      </div>

      <style jsx>{`
        .scanner-viewport {
          height: calc(100svh - 72px);
          min-height: 620px;
        }
        .scanner-meta {
          position: absolute;
          z-index: 10;
          left: 50%;
          top: 24px;
          display: flex;
          width: min(100%, 1440px);
          padding: 0 64px;
          transform: translateX(-50%);
          justify-content: space-between;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.17em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.32);
        }
        .scanner-layout {
          position: relative;
          z-index: 2;
          display: grid;
          width: 100%;
          max-width: 1440px;
          height: 100%;
          margin: 0 auto;
          padding: 0 64px;
          grid-template-columns: 53% 47%;
        }
        .scanner-scheme {
          position: relative;
          min-width: 0;
          overflow: hidden;
          border-right: 1px solid rgba(255, 255, 255, 0.09);
        }
        .scanner-brand {
          position: absolute;
          z-index: 8;
          left: 0;
          top: 9vh;
          display: grid;
          grid-template-columns: 38px 1fr;
          align-items: center;
        }
        .scanner-brand-mark {
          width: 13px;
          height: 13px;
          margin-left: 4px;
          border: 1px solid #ff5a00;
          transform: rotate(45deg);
        }
        .scanner-brand span {
          display: block;
          margin-bottom: 5px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 8px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 90, 0, 0.72);
        }
        .scanner-brand strong {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.03em;
        }
        .scanner-track {
          position: absolute;
          z-index: 1;
          left: 0;
          top: 20vh;
          bottom: 10vh;
          width: 1px;
        }
        .scanner-track-base,
        .scanner-track-progress {
          position: absolute;
          inset: 0;
          transform-origin: top;
        }
        .scanner-track-base { background: rgba(255, 255, 255, 0.14); }
        .scanner-track-progress {
          background: #ff5a00;
          box-shadow: 0 0 18px rgba(255, 90, 0, 0.42);
        }
        .scanner-conveyor {
          position: absolute;
          z-index: 4;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
        }
        :global(.conveyor-stage) {
          position: absolute;
          left: 0;
          top: -42px;
          display: grid;
          width: 100%;
          height: 84px;
          grid-template-columns: 52px 44px minmax(120px, 1fr);
          align-items: center;
          transform-origin: left center;
          text-align: left;
          color: white;
        }
        :global(.conveyor-stage-index) {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9px;
          color: rgba(255, 255, 255, 0.34);
          text-align: right;
          transform: translateX(-15px);
          transition: color 220ms ease;
        }
        :global(.conveyor-stage-node) {
          position: relative;
          z-index: 3;
          width: 16px;
          height: 16px;
          border: 1px solid rgba(255, 255, 255, 0.36);
          background: #171717;
          transform: rotate(45deg);
          transition: width 300ms ease, height 300ms ease, border-color 300ms ease, box-shadow 300ms ease, background 300ms ease;
        }
        :global(.conveyor-stage-node > span) {
          position: absolute;
          inset: 4px;
          background: rgba(255, 255, 255, 0.22);
          transition: background 220ms ease;
        }
        :global(.conveyor-stage-title) {
          position: relative;
          z-index: 2;
          font-family: "CoFo Sans Mono", monospace;
          font-size: clamp(11px, 1.05vw, 15px);
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.46);
          transition: color 240ms ease, font-size 300ms ease, transform 300ms ease;
        }
        :global(.conveyor-stage-line) {
          position: absolute;
          z-index: 0;
          left: 68px;
          width: 28px;
          top: 50%;
          height: 1px;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.03));
          transition: background 260ms ease, right 320ms ease;
        }
        }
        :global(.conveyor-stage.is-active .conveyor-stage-index) { color: #ff5a00; }
        :global(.conveyor-stage.is-active .conveyor-stage-node) {
          width: 27px;
          height: 27px;
          border-color: #ff5a00;
          background: rgba(255, 90, 0, 0.09);
          box-shadow: 0 0 0 9px rgba(255, 90, 0, 0.06), 0 0 34px rgba(255, 90, 0, 0.3);
        }
        :global(.conveyor-stage.is-active .conveyor-stage-node > span) { background: #ff5a00; }
        :global(.conveyor-stage.is-active .conveyor-stage-title) {
          color: white;
          font-size: clamp(16px, 1.7vw, 25px);
          transform: translateX(10px);
        }
        :global(.conveyor-stage.is-active .conveyor-stage-line) {
          background: linear-gradient(90deg, #ff5a00, rgba(255, 90, 0, 0.12));
        }
        .scanner-focus {
          position: absolute;
          z-index: 3;
          left: 0;
          right: 0;
          top: 50%;
          height: 104px;
          transform: translateY(-50%);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          border-left: 2px solid rgba(255, 90, 0, 0.72);
          background: linear-gradient(90deg, rgba(255, 90, 0, 0.045), rgba(255, 90, 0, 0.008) 58%, transparent);
        }
        .scanner-readout {
          position: relative;
          align-self: stretch;
          width: min(640px, calc(100% - 40px));
          height: 100%;
          margin: 0 0 0 auto;
          padding-top: 26vh;
          overflow: visible;
        }
        .scanner-readout-content {
          width: 100%;
          max-height: calc(100svh - 72px - 26vh - 34px);
          padding-right: 14px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 90, 0, 0.42) rgba(255, 255, 255, 0.06);
        }
        .scanner-readout-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 17px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.34);
        }
        .scanner-readout-head b { color: #ff5a00; font-weight: 400; }
        .scanner-readout h3 {
          margin-top: 31px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: clamp(34px, 3.7vw, 58px);
          font-weight: 400;
          line-height: 0.98;
          text-transform: uppercase;
        }
        .scanner-readout p {
          margin-top: 26px;
          font-family: "Onest", sans-serif;
          font-size: 15px;
          line-height: 1.62;
          color: rgba(255, 255, 255, 0.56);
        }
        .scanner-accordions {
          margin-top: 34px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }
        :global(.readout-accordion) {
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }
        :global(.readout-accordion > button) {
          display: grid;
          width: 100%;
          grid-template-columns: 1fr auto 20px;
          align-items: center;
          gap: 15px;
          padding: 16px 0;
          text-align: left;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.48);
          transition: color 200ms ease;
        }
        :global(.readout-accordion > button:hover),
        :global(.readout-accordion > button[aria-expanded="true"]) { color: white; }
        :global(.readout-accordion.is-accent > button) { color: rgba(255, 90, 0, 0.82); }
        :global(.readout-accordion-count) {
          font-size: 8px;
          color: rgba(255, 255, 255, 0.24);
        }
        :global(.readout-accordion > button i) {
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          color: #ff5a00;
          text-align: center;
        }
        :global(.readout-accordion-body) { overflow: hidden; }
        :global(.readout-accordion-body ul) { padding: 2px 0 20px; }
        :global(.readout-accordion-body li) {
          display: grid;
          grid-template-columns: 18px 1fr;
          gap: 4px;
          padding: 5px 18px 5px 0;
          font-family: "Onest", sans-serif;
          font-size: 12px;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.56);
        }
        :global(.readout-accordion-body li b) {
          font-family: "CoFo Sans Mono", monospace;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.25);
        }
        :global(.readout-accordion.is-accent .readout-accordion-body li) { color: rgba(255, 255, 255, 0.78); }
        :global(.readout-accordion.is-accent .readout-accordion-body li b) { color: #ff5a00; }
        .scanner-hint {
          position: absolute;
          z-index: 8;
          right: max(64px, calc((100vw - 1440px) / 2 + 64px));
          bottom: 22px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 8px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.2);
        }
        @media (max-width: 1023px) {
          .scanner-meta { padding: 0 32px; }
          .scanner-layout { grid-template-columns: 48% 52%; padding: 0 32px; }
          .scanner-brand { left: 0; }
          .scanner-track,
          .scanner-conveyor { left: 0; }
          .scanner-focus { left: 0; }
          :global(.conveyor-stage) { grid-template-columns: 42px 34px minmax(80px, 1fr); }
          :global(.conveyor-stage-line) { left: 50px; width: 26px; }
          .scanner-readout { width: calc(100% - 48px); }
          :global(.readout-accordion-body li) { font-size: 11px; }
        }
        @media (max-width: 767px) {
          .scanner-viewport { min-height: 580px; }
          .scanner-meta { left: 50%; top: 14px; width: 100%; padding: 0 16px; font-size: 7px; }
          .scanner-meta span:last-child { display: none; }
          .scanner-layout { grid-template-columns: 47% 53%; padding: 0 16px; }
          .scanner-brand { left: 0; top: 8vh; grid-template-columns: 23px 1fr; }
          .scanner-brand-mark { width: 9px; height: 9px; }
          .scanner-brand span { font-size: 5px; }
          .scanner-brand strong { font-size: 8px; }
          .scanner-track,
          .scanner-conveyor { left: 0; }
          .scanner-track { top: 17vh; bottom: 8vh; }
          .scanner-conveyor { right: 5px; }
          .scanner-focus { left: 0; right: 5px; height: 92px; }
          :global(.conveyor-stage) {
            top: -34px;
            height: 68px;
            grid-template-columns: 23px 26px minmax(50px, 1fr);
          }
          :global(.conveyor-stage-index) { font-size: 6px; }
          :global(.conveyor-stage-index) { transform: translateX(-9px); }
          :global(.conveyor-stage-node) { width: 11px; height: 11px; }
          :global(.conveyor-stage-node > span) { inset: 3px; }
          :global(.conveyor-stage-title) { font-size: 7px; overflow-wrap: anywhere; }
          :global(.conveyor-stage-line) { left: 26px; width: 20px; }
          :global(.conveyor-stage.is-active .conveyor-stage-node) { width: 19px; height: 19px; }
          :global(.conveyor-stage.is-active .conveyor-stage-title) { font-size: 10px; transform: translateX(4px); }
          .scanner-readout { width: calc(100% - 28px); }
          .scanner-readout { padding-top: 23vh; }
          .scanner-readout-content { max-height: calc(100svh - 72px - 23vh - 24px); padding-right: 6px; }
          .scanner-readout-head { padding-bottom: 11px; font-size: 6px; }
          .scanner-readout h3 { margin-top: 18px; font-size: clamp(22px, 7vw, 34px); overflow-wrap: anywhere; }
          .scanner-readout p { margin-top: 17px; font-size: 10px; line-height: 1.52; }
          .scanner-accordions { margin-top: 22px; }
          :global(.readout-accordion > button) { padding: 13px 0; font-size: 7px; gap: 7px; }
          :global(.readout-accordion-body li) { grid-template-columns: 13px 1fr; padding: 4px 0; font-size: 9px; }
          .scanner-hint { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.conveyor-stage-node),
          :global(.conveyor-stage-title),
          :global(.conveyor-stage-line) { transition-duration: 0ms; }
        }
      `}</style>
    </section>
  );
}
