"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ENV_KEYFRAMES, ENV_LAYERS, ENV_STARTS, ENV_STATIONS, ENV_STEPS, envStepAt } from "./environmentData";

// three.js грузим только на клиенте и отдельным чанком
const EnvironmentScene = dynamic(() => import("./EnvironmentScene"), { ssr: false });

const pad = (n: number) => String(n).padStart(2, "0");

export default function GrowingEnvironment() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setStep(envStepAt(v)));
  const railFill = useTransform(scrollYProgress, (v) => `${Math.max(0, Math.min(1, v)) * 100}%`);

  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: "300px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // выбор слоя: подсвечиваются его данные и связанные участники
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => {
    if (selected !== null && ENV_LAYERS[selected].step > step) setSelected(null);
  }, [step, selected]);

  const goTo = (i: number) => {
    const s = sectionRef.current;
    if (!s) return;
    const top = s.getBoundingClientRect().top + window.scrollY;
    const travel = s.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ENV_KEYFRAMES[i] * travel, behavior: reduced ? "auto" : "smooth" });
  };

  const s = ENV_STEPS[step];
  const sel = selected === null ? null : ENV_LAYERS[selected];
  const selStations = selected === null ? [] : ENV_STATIONS.filter((st) => st.links.includes(selected) && st.at <= ENV_STARTS[step] + 0.14);

  return (
    <section ref={sectionRef} id="growing-environment" className="en-section" aria-label="Одна модель. Растущая среда">
      <div className="en-sticky">
        <div className="en-canvas">
          <EnvironmentScene progress={scrollYProgress} reduced={reduced} active={active} selected={selected} />
        </div>
        <div className="en-shade" aria-hidden />

        <div className="en-ui">
          <header className="en-head container-x">
            <div className="en-meta">
              <span className="en-meta-idx">Цифровая среда</span>
              <span>Информация накапливается — участники остаются связаны</span>
              <span className="en-meta-mark" aria-hidden>
                STRUKTURA<i>+</i>
              </span>
            </div>
            <h2 className="en-title">
              Одна модель. <span className="text-orange">Растущая среда.</span>
            </h2>
          </header>

          <div className="en-body container-x">
            <div className="en-caption">
              <div aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step}
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="en-step-n">
                      <b>{pad(step + 1)}</b> / {pad(ENV_STEPS.length)} · {s.label}
                    </div>
                    <h3 className="en-step-title">{s.title}</h3>
                    <p className="en-step-text">{s.text}</p>
                    <p className="en-outcome">{s.outcome}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="en-layers">
                <div className="en-layers-head">Слои модели</div>
                <div className="en-chips" role="group" aria-label="Информационные слои">
                  {ENV_LAYERS.map((l, i) => {
                    const enabled = l.step <= step;
                    return (
                      <button
                        key={l.key}
                        type="button"
                        className="en-chip"
                        style={{ ["--c" as string]: l.color }}
                        disabled={!enabled}
                        aria-pressed={selected === i}
                        onClick={() => setSelected(selected === i ? null : i)}
                      >
                        <i aria-hidden />
                        {l.name}
                      </button>
                    );
                  })}
                </div>
                <p className="en-inspect">
                  {sel ? (
                    <>
                      <b style={{ color: sel.color }}>{sel.name}.</b> {sel.desc}
                      {selStations.length > 0 && (
                        <span className="en-inspect-who"> Работают: {selStations.map((st) => st.name).join(", ")}.</span>
                      )}
                    </>
                  ) : (
                    "Выберите слой — подсветятся его данные и связанные участники."
                  )}
                </p>
              </div>
            </div>
          </div>

          <nav className="en-rail container-x" aria-label="Сцены">
            <div className="en-rail-track">
              <span className="en-rail-base" aria-hidden />
              <motion.span className="en-rail-fill" style={{ width: railFill }} aria-hidden />
              {ENV_STEPS.map((st, i) => (
                <button
                  key={st.key}
                  type="button"
                  className={`en-rail-btn ${i === step ? "on" : ""} ${i < step ? "past" : ""}`}
                  style={{ left: `${ENV_STARTS[i] * 100}%` }}
                  onClick={() => goTo(i)}
                  aria-current={i === step ? "step" : undefined}
                >
                  <i aria-hidden />
                  <span className="en-rail-n">{pad(i + 1)}</span>
                  <span className="en-rail-label">{st.label}</span>
                </button>
              ))}
            </div>
            <span className="en-note">Схематическая геометрия</span>
          </nav>
        </div>
      </div>

      <style jsx global>{`
        .en-section {
          position: relative;
          height: 720svh;
          background: var(--coal-deep);
          color: #fff;
        }
        .en-sticky {
          position: sticky;
          top: 72px;
          height: calc(100svh - 72px);
          min-height: 560px;
          overflow: hidden;
        }
        .en-canvas {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .en-shade {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(90deg, rgba(16, 16, 16, 0.94) 0%, rgba(16, 16, 16, 0.7) 24%, rgba(16, 16, 16, 0) 38%),
            linear-gradient(0deg, rgba(16, 16, 16, 0.9) 0%, rgba(16, 16, 16, 0) 16%),
            linear-gradient(180deg, rgba(16, 16, 16, 0.85) 0%, rgba(16, 16, 16, 0) 20%);
        }
        .en-ui {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          pointer-events: none;
        }
        .en-head {
          padding-top: clamp(22px, 4vh, 48px);
        }
        .en-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
        }
        .en-meta-idx {
          color: var(--orange);
        }
        .en-meta-mark {
          margin-left: auto;
          letter-spacing: 0.3em;
          color: rgba(255, 255, 255, 0.16);
        }
        .en-meta-mark i {
          font-size: 8px;
          font-style: normal;
          vertical-align: super;
        }
        .en-title {
          margin-top: 14px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: clamp(24px, 3vw, 46px);
          line-height: 0.98;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }

        .en-body {
          flex: 1;
          display: flex;
          align-items: center;
          min-height: 0;
        }
        .en-caption {
          width: min(420px, 34vw);
        }
        .en-step-n {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
        }
        .en-step-n b {
          font-weight: 400;
          color: var(--orange);
        }
        .en-step-title {
          margin-top: 12px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: clamp(20px, 1.9vw, 30px);
          font-weight: 400;
          line-height: 1.05;
          text-transform: uppercase;
        }
        .en-step-text {
          margin-top: 14px;
          font-family: "Onest", sans-serif;
          font-size: clamp(14px, 1.02vw, 16px);
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.64);
        }
        .en-outcome {
          margin-top: 16px;
          padding-left: 12px;
          border-left: 2px solid var(--orange);
          font-family: "Onest", sans-serif;
          font-size: 14px;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.88);
        }

        /* ── слои ── */
        .en-layers {
          margin-top: 26px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          pointer-events: auto;
        }
        .en-layers-head {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.38);
        }
        .en-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
        }
        .en-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 9px 5px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(16, 16, 16, 0.6);
          color: rgba(255, 255, 255, 0.82);
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease, opacity 0.2s ease;
        }
        .en-chip i {
          width: 7px;
          height: 7px;
          background: var(--c);
        }
        .en-chip[aria-pressed="true"] {
          border-color: var(--c);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: inset 0 -2px 0 var(--c);
        }
        .en-chip:disabled {
          opacity: 0.3;
          cursor: default;
        }
        @media (hover: hover) and (pointer: fine) {
          .en-chip:not(:disabled):hover {
            border-color: var(--c);
          }
        }
        .en-inspect {
          min-height: 40px;
          margin-top: 10px;
          font-family: "Onest", sans-serif;
          font-size: 12.5px;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.55);
        }
        .en-inspect b {
          font-weight: 500;
        }
        .en-inspect-who {
          color: rgba(255, 255, 255, 0.75);
        }

        /* ── шкала сцен ── */
        .en-rail {
          display: flex;
          align-items: flex-end;
          gap: 32px;
          padding-bottom: clamp(18px, 3vh, 30px);
        }
        .en-rail-track {
          position: relative;
          flex: 1;
          height: 38px;
        }
        .en-rail-base,
        .en-rail-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 1px;
        }
        .en-rail-base {
          right: 0;
          background: rgba(255, 255, 255, 0.16);
        }
        .en-rail-fill {
          background: var(--orange);
          box-shadow: 0 0 12px rgba(255, 90, 0, 0.5);
        }
        .en-rail-btn {
          position: absolute;
          top: -6px;
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 14px 10px 6px 0;
          background: none;
          border: 0;
          color: rgba(255, 255, 255, 0.4);
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          pointer-events: auto;
          transition: color 0.25s ease;
        }
        .en-rail-btn i {
          position: absolute;
          left: -4px;
          top: 2px;
          width: 9px;
          height: 9px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          background: var(--coal-deep);
          transform: rotate(45deg);
          transition: border-color 0.25s ease, background 0.25s ease;
        }
        .en-rail-btn.past i,
        .en-rail-btn.on i {
          border-color: var(--orange);
        }
        .en-rail-btn.on i {
          background: var(--orange);
          box-shadow: 0 0 14px rgba(255, 90, 0, 0.6);
        }
        .en-rail-btn.on {
          color: #fff;
        }
        .en-rail-n {
          color: var(--orange);
        }
        @media (hover: hover) and (pointer: fine) {
          .en-rail-btn:hover {
            color: #fff;
          }
        }
        .en-note {
          flex-shrink: 0;
          padding-bottom: 8px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.24);
        }

        /* ── подписи внутри 3D-сцены ── */
        .en-st {
          display: grid;
          grid-template-columns: auto 1fr;
          column-gap: 7px;
          row-gap: 2px;
          align-items: center;
          transform: translate(-50%, -100%);
          padding: 6px 9px 7px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-top: 2px solid var(--c);
          background: rgba(14, 14, 14, 0.82);
          backdrop-filter: blur(6px);
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .en-st i {
          width: 6px;
          height: 6px;
          background: var(--c);
        }
        .en-st b {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10.5px;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff;
        }
        .en-st span {
          grid-column: 2;
          font-family: "Onest", sans-serif;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.55);
        }
        .en-st[data-on="1"] {
          border-color: var(--c);
          box-shadow: 0 0 0 1px var(--c), 0 0 24px -4px var(--c);
        }
        .en-tag {
          transform: translate(-50%, -50%);
          padding: 3px 6px 2px;
          background: var(--orange);
          color: #fff;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
        }
        .en-tag--move {
          transform: translate(-50%, -100%);
        }
        .en-env {
          transform: translate(-50%, 0);
          white-space: nowrap;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9.5px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
        }

        @media (max-width: 1023px) {
          .en-caption {
            width: min(360px, 40vw);
          }
          .en-step-text {
            display: none;
          }
        }
        @media (max-width: 767px) {
          .en-section {
            height: 620svh;
          }
          .en-sticky {
            min-height: 540px;
          }
          .en-shade {
            background: linear-gradient(0deg, rgba(16, 16, 16, 0.97) 0%, rgba(16, 16, 16, 0.9) 36%, rgba(16, 16, 16, 0) 58%),
              linear-gradient(180deg, rgba(16, 16, 16, 0.85) 0%, rgba(16, 16, 16, 0) 18%);
          }
          .en-meta span:nth-child(2),
          .en-meta-mark {
            display: none;
          }
          .en-title {
            font-size: clamp(20px, 6.4vw, 28px);
          }
          .en-body {
            align-items: flex-end;
            padding-bottom: 18px;
          }
          .en-caption {
            width: 100%;
          }
          .en-step-title {
            margin-top: 8px;
            font-size: clamp(17px, 5.2vw, 21px);
          }
          .en-step-text {
            display: block;
            margin-top: 8px;
            font-size: 13px;
            line-height: 1.45;
          }
          .en-outcome {
            display: none;
          }
          .en-layers {
            margin-top: 12px;
            padding-top: 10px;
          }
          .en-layers-head,
          .en-inspect {
            display: none;
          }
          .en-chips {
            flex-wrap: nowrap;
            overflow-x: auto;
            margin-top: 0;
            scrollbar-width: none;
          }
          .en-chip {
            flex-shrink: 0;
          }
          .en-rail-label,
          .en-note {
            display: none;
          }
          .en-st {
            padding: 4px 6px 5px;
          }
          .en-st b {
            font-size: 8.5px;
            letter-spacing: 0.04em;
          }
          .en-st span {
            display: none;
          }
        }
        @media (max-height: 760px) and (min-width: 768px) {
          .en-step-text {
            font-size: 13.5px;
          }
          .en-layers {
            margin-top: 16px;
          }
        }
      `}</style>
    </section>
  );
}
