"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  CHAPTER2_AT,
  CORE_CHAPTERS,
  CORE_KEYFRAMES,
  CORE_LAYERS,
  CORE_STARTS,
  CORE_STATIONS,
  CORE_STEPS,
  coreStepAt,
} from "./coreStoryData";

// three.js грузим только на клиенте и отдельным чанком
const CoreStoryScene = dynamic(() => import("./CoreStoryScene"), { ssr: false });

const pad = (n: number) => String(n).padStart(2, "0");
const SUB_STEP = CORE_STEPS.findIndex((s) => s.key === "sub");

/**
 * Одна развивающаяся инфографика: ядро проходит через всю историю и обрастает информацией.
 * Глава 01 — как развивали среду, глава 02 — как она работает на объекте, финал — STRUKTURA.
 */
export default function CoreStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setStep(coreStepAt(v)));
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
    if (selected !== null && CORE_LAYERS[selected].step > step) setSelected(null);
  }, [step, selected]);

  const goTo = (i: number) => {
    const s = sectionRef.current;
    if (!s) return;
    const top = s.getBoundingClientRect().top + window.scrollY;
    const travel = s.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + CORE_KEYFRAMES[i] * travel, behavior: reduced ? "auto" : "smooth" });
  };

  const s = CORE_STEPS[step];
  const chapter = s.chapter;
  const final = step === CORE_STEPS.length - 1;
  const sel = selected === null ? null : CORE_LAYERS[selected];
  const selStations =
    selected === null ? [] : CORE_STATIONS.filter((st) => st.links.includes(selected) && st.at <= (CORE_STARTS[step + 1] ?? 1));
  // номер внутри главы: 01–03 и 01–06
  // финал не считается шагом главы
  const chapterSteps = CORE_STEPS.filter((x, i) => x.chapter === chapter && i < CORE_STEPS.length - 1).length;
  const inChapter = step - CORE_STEPS.findIndex((x) => x.chapter === chapter);

  return (
    <section ref={sectionRef} id="digital-core" className={`cs-section${final ? " is-final" : ""}`} aria-label="Цифровое ядро STRUKTURA">
      <div className="cs-sticky">
        <div className="cs-canvas">
          <CoreStoryScene progress={scrollYProgress} reduced={reduced} active={active} selected={selected} />
        </div>
        <div className="cs-shade" aria-hidden />

        <div className="cs-ui">
          <header className="cs-head container-x">
            <div className="cs-meta">
              <span className="cs-meta-idx">Цифровая среда</span>
              <span className="cs-chapters">
                {CORE_CHAPTERS.map((c, i) => (
                  <button
                    key={c}
                    type="button"
                    className={`cs-chapter${chapter === i ? " on" : ""}`}
                    onClick={() => goTo(i === 0 ? 0 : CORE_STEPS.findIndex((x) => x.chapter === 1))}
                  >
                    {pad(i + 1)} · {c}
                  </button>
                ))}
              </span>
              <span className="cs-meta-mark" aria-hidden>
                STRUKTURA<i>+</i>
              </span>
            </div>
            <h2 className="cs-title">
              Цифровая среда — <span className="text-orange">одна из основ STRUKTURA.</span>
            </h2>
          </header>

          <div className="cs-body container-x">
            <div className="cs-caption">
              <div aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step}
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="cs-step-n">
                      {final ? (
                        <b>Финал</b>
                      ) : (
                        <>
                          <b>
                            {pad(chapter + 1)}.{inChapter + 1}
                          </b>{" "}
                          / {pad(chapterSteps)} · {s.label}
                        </>
                      )}
                    </div>
                    <h3 className="cs-step-title">{s.title}</h3>
                    <p className="cs-step-text">{s.text}</p>
                    <p className="cs-outcome">{s.outcome}</p>
                    {step === SUB_STEP && (
                      <Link href="/subsystems" className="cs-link">
                        Подробнее о подсистемах <span aria-hidden>→</span>
                      </Link>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {chapter === 1 && !final && (
                <div className="cs-layers">
                  <div className="cs-layers-head">Слои модели объекта</div>
                  <div className="cs-chips" role="group" aria-label="Информационные слои">
                    {CORE_LAYERS.map((l, i) => {
                      const enabled = l.step <= step;
                      return (
                        <button
                          key={l.key}
                          type="button"
                          className="cs-chip"
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
                  <p className="cs-inspect">
                    {sel ? (
                      <>
                        <b style={{ color: sel.color }}>{sel.name}.</b> {sel.desc}
                        {selStations.length > 0 && (
                          <span className="cs-inspect-who"> Работают: {selStations.map((st) => st.name).join(", ")}.</span>
                        )}
                      </>
                    ) : (
                      "Выберите слой — подсветятся его данные и связанные участники."
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          <nav className="cs-rail container-x" aria-label="Сцены">
            <div className="cs-rail-track">
              <span className="cs-rail-base" aria-hidden />
              <motion.span className="cs-rail-fill" style={{ width: railFill }} aria-hidden />
              <span className="cs-rail-split" style={{ left: `${CHAPTER2_AT * 100}%` }} aria-hidden />
              {CORE_STEPS.map((st, i) => (
                <button
                  key={st.key}
                  type="button"
                  className={`cs-rail-btn ${i === step ? "on" : ""} ${i < step ? "past" : ""}`}
                  style={{ left: `${CORE_STARTS[i] * 100}%` }}
                  onClick={() => goTo(i)}
                  aria-current={i === step ? "step" : undefined}
                >
                  <i aria-hidden />
                  <span className="cs-rail-label">{st.label}</span>
                </button>
              ))}
            </div>
            <span className="cs-note-geo">Схематическая геометрия</span>
          </nav>
        </div>
      </div>

      <style jsx global>{`
        .cs-section {
          position: relative;
          height: 980svh;
          background: var(--coal-deep);
          color: #fff;
        }
        .cs-sticky {
          position: sticky;
          top: 72px;
          height: calc(100svh - 72px);
          min-height: 560px;
          overflow: hidden;
        }
        .cs-canvas {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .cs-shade {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(90deg, rgba(16, 16, 16, 0.94) 0%, rgba(16, 16, 16, 0.7) 24%, rgba(16, 16, 16, 0) 38%),
            linear-gradient(0deg, rgba(16, 16, 16, 0.9) 0%, rgba(16, 16, 16, 0) 16%),
            linear-gradient(180deg, rgba(16, 16, 16, 0.85) 0%, rgba(16, 16, 16, 0) 20%);
        }
        .cs-ui {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          pointer-events: none;
        }
        .cs-head {
          padding-top: clamp(22px, 4vh, 48px);
        }
        .cs-meta {
          display: flex;
          align-items: center;
          gap: 18px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
        }
        .cs-meta-idx {
          color: var(--orange);
        }
        .cs-chapters {
          display: flex;
          gap: 4px;
          pointer-events: auto;
        }
        .cs-chapter {
          padding: 5px 9px 4px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(16, 16, 16, 0.5);
          color: rgba(255, 255, 255, 0.45);
          font: inherit;
          letter-spacing: inherit;
          text-transform: inherit;
          cursor: pointer;
          transition: color 0.25s ease, border-color 0.25s ease, background 0.25s ease;
        }
        .cs-chapter.on {
          border-color: var(--orange);
          color: #fff;
          background: rgba(255, 90, 0, 0.12);
        }
        @media (hover: hover) and (pointer: fine) {
          .cs-chapter:not(.on):hover {
            color: #fff;
            border-color: rgba(255, 255, 255, 0.35);
          }
        }
        .cs-meta-mark {
          margin-left: auto;
          letter-spacing: 0.3em;
          color: rgba(255, 255, 255, 0.16);
        }
        .cs-meta-mark i,
        .cs-mark i {
          font-style: normal;
          color: var(--orange);
        }
        .cs-meta-mark i {
          font-size: 8px;
          vertical-align: super;
        }
        .cs-title {
          margin-top: 14px;
          max-width: 900px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: clamp(22px, 2.6vw, 40px);
          line-height: 1;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          transition: opacity 0.5s ease;
        }
        .cs-section.is-final .cs-title {
          opacity: 0.25;
        }

        .cs-body {
          flex: 1;
          display: flex;
          align-items: center;
          min-height: 0;
        }
        .cs-caption {
          width: min(420px, 34vw);
        }
        .cs-step-n {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
        }
        .cs-step-n b {
          font-weight: 400;
          color: var(--orange);
        }
        .cs-step-title {
          margin-top: 12px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: clamp(20px, 1.9vw, 30px);
          font-weight: 400;
          line-height: 1.05;
          text-transform: uppercase;
        }
        .cs-step-text {
          margin-top: 14px;
          font-family: "Onest", sans-serif;
          font-size: clamp(14px, 1.02vw, 16px);
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.64);
        }
        .cs-outcome {
          margin-top: 16px;
          padding-left: 12px;
          border-left: 2px solid var(--orange);
          font-family: "Onest", sans-serif;
          font-size: 14px;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.88);
        }
        .cs-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 18px;
          padding: 10px 14px 9px;
          border: 1px solid var(--orange);
          background: rgba(255, 90, 0, 0.12);
          color: #fff;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          pointer-events: auto;
          transition: background 0.25s ease;
        }
        .cs-link span {
          transition: transform 0.25s ease;
        }
        @media (hover: hover) and (pointer: fine) {
          .cs-link:hover {
            background: var(--orange);
          }
          .cs-link:hover span {
            transform: translateX(4px);
          }
        }

        /* ── слои ── */
        .cs-layers {
          margin-top: 26px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          pointer-events: auto;
        }
        .cs-layers-head {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.38);
        }
        .cs-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
        }
        .cs-chip {
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
        .cs-chip i {
          width: 7px;
          height: 7px;
          background: var(--c);
        }
        .cs-chip[aria-pressed="true"] {
          border-color: var(--c);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: inset 0 -2px 0 var(--c);
        }
        .cs-chip:disabled {
          opacity: 0.3;
          cursor: default;
        }
        @media (hover: hover) and (pointer: fine) {
          .cs-chip:not(:disabled):hover {
            border-color: var(--c);
          }
        }
        .cs-inspect {
          min-height: 40px;
          margin-top: 10px;
          font-family: "Onest", sans-serif;
          font-size: 12.5px;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.55);
        }
        .cs-inspect b {
          font-weight: 500;
        }
        .cs-inspect-who {
          color: rgba(255, 255, 255, 0.75);
        }

        /* ── шкала сцен ── */
        .cs-rail {
          display: flex;
          align-items: flex-end;
          gap: 32px;
          padding-bottom: clamp(18px, 3vh, 30px);
        }
        .cs-rail-track {
          position: relative;
          flex: 1;
          height: 38px;
        }
        .cs-rail-base,
        .cs-rail-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 1px;
        }
        .cs-rail-base {
          right: 0;
          background: rgba(255, 255, 255, 0.16);
        }
        .cs-rail-fill {
          background: var(--orange);
          box-shadow: 0 0 12px rgba(255, 90, 0, 0.5);
        }
        .cs-rail-split {
          position: absolute;
          top: -9px;
          width: 1px;
          height: 19px;
          margin-left: -12px;
          background: rgba(255, 255, 255, 0.35);
        }
        .cs-rail-btn {
          position: absolute;
          top: -6px;
          display: flex;
          align-items: baseline;
          padding: 14px 10px 6px 0;
          background: none;
          border: 0;
          color: rgba(255, 255, 255, 0.4);
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
          cursor: pointer;
          pointer-events: auto;
          transition: color 0.25s ease;
        }
        .cs-rail-btn i {
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
        .cs-rail-btn.past i,
        .cs-rail-btn.on i {
          border-color: var(--orange);
        }
        .cs-rail-btn.on i {
          background: var(--orange);
          box-shadow: 0 0 14px rgba(255, 90, 0, 0.6);
        }
        .cs-rail-btn.on {
          color: #fff;
        }
        @media (hover: hover) and (pointer: fine) {
          .cs-rail-btn:hover {
            color: #fff;
          }
        }
        .cs-note-geo {
          flex-shrink: 0;
          padding-bottom: 8px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.24);
        }

        /* ── подписи внутри 3D-сцены ── */
        .cs-st {
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
        .cs-st i {
          width: 6px;
          height: 6px;
          background: var(--c);
        }
        .cs-st b {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10.5px;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff;
        }
        .cs-st span {
          grid-column: 2;
          font-family: "Onest", sans-serif;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.55);
        }
        .cs-st[data-on="1"] {
          border-color: var(--c);
          box-shadow: 0 0 0 1px var(--c), 0 0 24px -4px var(--c);
        }
        .cs-tag {
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
        .cs-tag--move {
          transform: translate(-50%, -100%);
        }
        .cs-note {
          position: relative;
          transform: translate(14px, -50%);
          padding: 4px 8px 3px;
          border-left: 2px solid var(--orange);
          background: rgba(14, 14, 14, 0.82);
          color: #ffd9c4;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .cs-note::before {
          content: "";
          position: absolute;
          right: 100%;
          top: 50%;
          width: 12px;
          height: 1px;
          margin-right: 2px;
          background: var(--orange);
        }
        .cs-dir {
          display: grid;
          gap: 2px;
          transform: translate(-50%, -100%);
          padding: 5px 9px 6px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-top: 2px solid var(--orange);
          background: rgba(14, 14, 14, 0.82);
          backdrop-filter: blur(6px);
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
        }
        .cs-dir b {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10.5px;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff;
        }
        .cs-dir span {
          font-family: "Onest", sans-serif;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.55);
        }
        .cs-note--scan {
          border-left-color: #6cc4ea;
          color: #d2efff;
        }
        .cs-note--scan::before {
          display: none;
        }
        .cs-note--fact {
          border-left-color: #40cfae;
          color: #c9f5ea;
          transform: translate(-50%, -50%);
        }
        .cs-note--fact::before {
          display: none;
        }
        .cs-env {
          transform: translate(-50%, 0);
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9.5px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
        }
        .cs-mark {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          opacity: 0;
          visibility: hidden;
          white-space: nowrap;
          text-align: center;
        }
        .cs-mark b {
          font-family: "CoFo Sans Mono", monospace;
          font-weight: 500;
          font-size: clamp(28px, 3.4vw, 52px);
          letter-spacing: 0.2em;
          color: var(--coal);
        }
        .cs-mark i {
          font-size: 0.6em;
          vertical-align: super;
          letter-spacing: 0;
        }
        .cs-mark span {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(24, 24, 24, 0.6);
        }

        .cs-callout {
          display: flex;
          gap: 10px;
          align-items: center;
          transform: translate(22px, -50%);
          padding: 8px 10px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-left: 2px solid #fff;
          background: rgba(14, 14, 14, 0.86);
          backdrop-filter: blur(6px);
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
        }
        .cs-callout svg {
          width: 64px;
          height: 40px;
          flex-shrink: 0;
          fill: none;
          stroke: #ffd2b8;
          stroke-width: 1.4;
        }
        .cs-callout svg circle {
          fill: var(--orange);
          stroke: none;
        }
        .cs-callout svg .dim {
          stroke: rgba(255, 255, 255, 0.4);
          stroke-width: 1;
        }
        .cs-callout span {
          display: grid;
          gap: 3px;
          font-family: "Onest", sans-serif;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
        }
        .cs-callout b {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #fff;
        }
        .cs-step {
          display: grid;
          place-items: center;
          width: 20px;
          height: 20px;
          border: 1px solid var(--orange);
          background: rgba(14, 14, 14, 0.85);
          color: #fff;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 11px;
          opacity: 0;
          visibility: hidden;
          transform: translate(14px, -14px);
        }
        .cs-pop {
          padding: 3px 7px 2px;
          border-left: 2px solid var(--c);
          background: rgba(14, 14, 14, 0.8);
          color: var(--c);
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-50%);
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        @media (max-width: 1180px) {
          .cs-rail-label {
            display: none;
          }
          .cs-rail-btn.on .cs-rail-label {
            display: inline;
          }
        }
        @media (max-width: 1023px) {
          .cs-caption {
            width: min(360px, 40vw);
          }
          .cs-step-text {
            display: none;
          }
          .cs-meta-mark {
            display: none;
          }
        }
        @media (max-width: 767px) {
          .cs-section {
            height: 860svh;
          }
          .cs-sticky {
            min-height: 540px;
          }
          .cs-shade {
            background: linear-gradient(0deg, rgba(16, 16, 16, 0.97) 0%, rgba(16, 16, 16, 0.9) 36%, rgba(16, 16, 16, 0) 58%),
              linear-gradient(180deg, rgba(16, 16, 16, 0.85) 0%, rgba(16, 16, 16, 0) 18%);
          }
          .cs-meta-idx {
            display: none;
          }
          .cs-chapters {
            flex-wrap: wrap;
          }
          .cs-chapter {
            font-size: 9px;
            letter-spacing: 0.08em;
          }
          .cs-title {
            font-size: clamp(18px, 5.6vw, 24px);
          }
          .cs-body {
            align-items: flex-end;
            padding-bottom: 18px;
          }
          .cs-caption {
            width: 100%;
          }
          .cs-step-title {
            margin-top: 8px;
            font-size: clamp(17px, 5.2vw, 21px);
          }
          .cs-step-text {
            display: block;
            margin-top: 8px;
            font-size: 13px;
            line-height: 1.45;
          }
          .cs-outcome {
            display: none;
          }
          .cs-link {
            margin-top: 12px;
          }
          .cs-layers {
            margin-top: 12px;
            padding-top: 10px;
          }
          .cs-layers-head,
          .cs-inspect {
            display: none;
          }
          .cs-chips {
            flex-wrap: nowrap;
            overflow-x: auto;
            margin-top: 0;
            scrollbar-width: none;
          }
          .cs-chip {
            flex-shrink: 0;
          }
          .cs-rail-btn.on .cs-rail-label,
          .cs-note-geo {
            display: none;
          }
          .cs-st {
            padding: 4px 6px 5px;
          }
          .cs-st b {
            font-size: 8.5px;
            letter-spacing: 0.04em;
          }
          .cs-st span,
          .cs-note,
          .cs-dir,
          .cs-callout span,
          .cs-pop {
            display: none;
          }
          .cs-mark b {
            font-size: 22px;
            letter-spacing: 0.12em;
          }
          .cs-mark span {
            font-size: 9px;
          }
        }
        @media (max-height: 760px) and (min-width: 768px) {
          .cs-step-text {
            font-size: 13.5px;
          }
          .cs-layers {
            margin-top: 16px;
          }
        }
      `}</style>
    </section>
  );
}
