"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ROUTE, STEP_KEYFRAMES, STEP_STARTS, STORY_STEPS, stepAt } from "./panelStoryData";
import type { HoverInfo, SceneStats } from "./PanelStoryScene";

// three.js грузим только на клиенте и отдельным чанком
const PanelStoryScene = dynamic(() => import("./PanelStoryScene"), { ssr: false });

const pad = (n: number) => String(n).padStart(2, "0");

export default function PanelStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setStep(stepAt(v)));
  const railFill = useTransform(scrollYProgress, (v) => `${Math.max(0, Math.min(1, v)) * 100}%`);

  // сцена рендерится только рядом с экраном
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: "300px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // HUD маршрута обновляется напрямую, без ререндера секции на каждый кадр
  const installedRef = useRef<HTMLElement>(null);
  const routeRefs = useRef<(HTMLLIElement | null)[]>([]);
  const onStats = useCallback((s: SceneStats) => {
    if (installedRef.current) installedRef.current.textContent = String(s.installed);
    s.route.forEach((n, i) => {
      const li = routeRefs.current[i];
      if (!li) return;
      const count = li.querySelector("b");
      if (count) count.textContent = String(n);
      li.dataset.state = n >= s.total ? "done" : n > 0 ? "run" : "wait";
    });
  }, []);

  const tipRef = useRef<HTMLDivElement>(null);
  const onHover = useCallback((h: HoverInfo | null) => {
    const tip = tipRef.current;
    const box = stickyRef.current?.getBoundingClientRect();
    if (!tip || !box) return;
    if (!h) {
      tip.dataset.on = "0";
      return;
    }
    const set = (sel: string, text: string) => {
      const node = tip.querySelector(sel);
      if (node) node.textContent = text;
    };
    set("[data-id]", h.id);
    set("[data-zone]", h.zone);
    set("[data-size]", h.size);
    set("[data-place]", h.place);
    set("[data-status]", h.status);
    const x = Math.min(h.x - box.left + 16, box.width - 230);
    const y = Math.min(h.y - box.top + 16, box.height - 140);
    tip.style.transform = `translate(${x}px, ${y}px)`;
    tip.dataset.on = "1";
  }, []);

  const goTo = (i: number) => {
    const s = sectionRef.current;
    if (!s) return;
    const top = s.getBoundingClientRect().top + window.scrollY;
    const travel = s.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + STEP_KEYFRAMES[i] * travel, behavior: reduced ? "auto" : "smooth" });
  };

  const s = STORY_STEPS[step];

  return (
    <section
      ref={sectionRef}
      id="panel-story"
      className="ps-section"
      aria-label="От панели к целому объекту"
    >
      <div className="ps-sticky" ref={stickyRef}>
        <div className="ps-canvas">
          <PanelStoryScene
            progress={scrollYProgress}
            reduced={reduced}
            active={active}
            onStats={onStats}
            onHover={onHover}
          />
        </div>
        <div className="ps-shade" aria-hidden />

        <div className="ps-ui">
          <header className="ps-head container-x">
            <div className="ps-meta">
              <span className="ps-meta-idx">Цифровая среда</span>
              <span>Одна деталь — весь объект</span>
              <span className="ps-meta-mark" aria-hidden>
                STRUKTURA<i>+</i>
              </span>
            </div>
            <h2 className="ps-title">
              От панели — <span className="text-orange">к целому объекту</span>
            </h2>
          </header>

          <div className="ps-body container-x">
            <div className="ps-caption" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={reduced ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="ps-step-n">
                    <b>{pad(step + 1)}</b> / {pad(STORY_STEPS.length)} · {s.label}
                  </div>
                  <h3 className="ps-step-title">{s.title}</h3>
                  <p className="ps-step-text">{s.text}</p>
                  <ul className="ps-chips">
                    {s.data.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                  <p className="ps-outcome">{s.outcome}</p>
                  {step >= 3 && (
                    <p className="ps-hint">
                      <span className="ps-hint-fine">Наведите на панель</span>
                      <span className="ps-hint-touch">Коснитесь панели</span> — откроется паспорт элемента
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className={`ps-route ${step === 4 ? "on" : ""}`} aria-hidden={step !== 4}>
            <div className="ps-route-head">
              <span>Маршрут деталей</span>
              <span>
                Установлено <b ref={installedRef}>0</b> / 126
              </span>
            </div>
            <ol>
              {ROUTE.map((label, i) => (
                <li key={label} ref={(el) => void (routeRefs.current[i] = el)} data-state="wait">
                  <span>{label}</span>
                  <b>0</b>
                </li>
              ))}
            </ol>
          </div>

          <nav className="ps-rail container-x" aria-label="Сцены">
            <div className="ps-rail-track">
              <span className="ps-rail-base" aria-hidden />
              <motion.span className="ps-rail-fill" style={{ width: railFill }} aria-hidden />
              {STORY_STEPS.map((st, i) => (
                <button
                  key={st.key}
                  type="button"
                  className={`ps-rail-btn ${i === step ? "on" : ""} ${i < step ? "past" : ""}`}
                  style={{ left: `${STEP_STARTS[i] * 100}%` }}
                  onClick={() => goTo(i)}
                  aria-current={i === step ? "step" : undefined}
                >
                  <i aria-hidden />
                  <span className="ps-rail-n">{pad(i + 1)}</span>
                  <span className="ps-rail-label">{st.label}</span>
                </button>
              ))}
            </div>
            <span className="ps-note">Геометрия и идентификаторы условные</span>
          </nav>
        </div>

        <div className="ps-tip" ref={tipRef} data-on="0" aria-hidden>
          <div className="ps-tip-head">
            <b data-id />
            <span data-zone />
          </div>
          <dl>
            <dt>Размер</dt>
            <dd data-size />
            <dt>Место</dt>
            <dd data-place />
            <dt>Статус</dt>
            <dd data-status />
          </dl>
        </div>
      </div>

      <style jsx global>{`
        .ps-section {
          position: relative;
          height: 640svh;
          background: var(--coal-deep);
          color: #fff;
        }
        .ps-sticky {
          position: sticky;
          top: 72px;
          height: calc(100svh - 72px);
          min-height: 560px;
          overflow: hidden;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }
        .ps-canvas {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .ps-shade {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(
              90deg,
              rgba(16, 16, 16, 0.94) 0%,
              rgba(16, 16, 16, 0.7) 24%,
              rgba(16, 16, 16, 0) 37%
            ),
            linear-gradient(0deg, rgba(16, 16, 16, 0.9) 0%, rgba(16, 16, 16, 0) 18%),
            linear-gradient(180deg, rgba(16, 16, 16, 0.85) 0%, rgba(16, 16, 16, 0) 22%);
        }
        .ps-ui {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          pointer-events: none;
        }

        /* ── шапка ── */
        .ps-head {
          padding-top: clamp(22px, 4vh, 48px);
        }
        .ps-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
        }
        .ps-meta-idx {
          color: var(--orange);
        }
        .ps-meta-mark {
          margin-left: auto;
          letter-spacing: 0.3em;
          color: rgba(255, 255, 255, 0.16);
        }
        .ps-meta-mark i {
          font-size: 8px;
          font-style: normal;
          vertical-align: super;
        }
        .ps-title {
          margin-top: 14px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: clamp(24px, 3vw, 46px);
          line-height: 0.98;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }

        /* ── подпись сцены ── */
        .ps-body {
          flex: 1;
          display: flex;
          align-items: center;
          min-height: 0;
        }
        .ps-caption {
          width: min(420px, 34vw);
        }
        .ps-step-n {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
        }
        .ps-step-n b {
          font-weight: 400;
          color: var(--orange);
        }
        .ps-step-title {
          margin-top: 14px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: clamp(21px, 2vw, 32px);
          font-weight: 400;
          line-height: 1.04;
          text-transform: uppercase;
        }
        .ps-step-text {
          margin-top: 16px;
          font-family: "Onest", sans-serif;
          font-size: clamp(14px, 1.05vw, 16px);
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.64);
        }
        .ps-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 18px;
          list-style: none;
        }
        .ps-chips li {
          padding: 5px 8px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.72);
        }
        .ps-outcome {
          margin-top: 20px;
          padding-left: 12px;
          border-left: 2px solid var(--orange);
          font-family: "Onest", sans-serif;
          font-size: 14px;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.88);
        }
        .ps-hint {
          margin-top: 16px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.38);
        }
        .ps-hint-touch {
          display: none;
        }
        @media (hover: none) {
          .ps-hint-fine {
            display: none;
          }
          .ps-hint-touch {
            display: inline;
          }
        }

        /* ── маршрут деталей (сцена 05) ── */
        .ps-route {
          position: absolute;
          right: clamp(24px, 4.4vw, 64px);
          top: clamp(22px, 4vh, 48px);
          width: min(540px, 40vw);
          padding: 12px 12px 0;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(16, 16, 16, 0.82);
          backdrop-filter: blur(6px);
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.4s var(--ease-out), transform 0.4s var(--ease-out);
        }
        .ps-route.on {
          opacity: 1;
          transform: none;
        }
        .ps-route-head {
          display: flex;
          justify-content: space-between;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
        }
        .ps-route-head b {
          font-weight: 400;
          color: var(--orange);
        }
        .ps-route ol {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          margin: 10px -12px 0;
          list-style: none;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }
        .ps-route li {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 10px 10px 11px;
          border-left: 1px solid rgba(255, 255, 255, 0.08);
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.38);
          transition: color 0.3s ease;
        }
        .ps-route li:first-child {
          border-left: 0;
        }
        .ps-route li b {
          font-size: 18px;
          font-weight: 400;
          letter-spacing: 0;
          color: rgba(255, 255, 255, 0.3);
          font-variant-numeric: tabular-nums;
        }
        .ps-route li::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: -1px;
          height: 2px;
          background: var(--orange);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s var(--ease-out);
        }
        .ps-route li[data-state="run"],
        .ps-route li[data-state="done"] {
          color: rgba(255, 255, 255, 0.78);
        }
        .ps-route li[data-state="run"] b {
          color: var(--orange);
        }
        .ps-route li[data-state="done"] b {
          color: #fff;
        }
        .ps-route li[data-state="run"]::after,
        .ps-route li[data-state="done"]::after {
          transform: scaleX(1);
        }
        .ps-route li:last-child span {
          color: var(--orange);
        }

        /* ── шкала сцен ── */
        .ps-rail {
          display: flex;
          align-items: flex-end;
          gap: 32px;
          padding-bottom: clamp(18px, 3vh, 30px);
        }
        .ps-rail-track {
          position: relative;
          flex: 1;
          height: 38px;
        }
        .ps-rail-base,
        .ps-rail-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 1px;
        }
        .ps-rail-base {
          right: 0;
          background: rgba(255, 255, 255, 0.16);
        }
        .ps-rail-fill {
          background: var(--orange);
          box-shadow: 0 0 12px rgba(255, 90, 0, 0.5);
        }
        .ps-rail-btn {
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
        .ps-rail-btn i {
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
        .ps-rail-btn.past i,
        .ps-rail-btn.on i {
          border-color: var(--orange);
        }
        .ps-rail-btn.on i {
          background: var(--orange);
          box-shadow: 0 0 14px rgba(255, 90, 0, 0.6);
        }
        .ps-rail-btn.on {
          color: #fff;
        }
        .ps-rail-n {
          color: var(--orange);
        }
        @media (hover: hover) and (pointer: fine) {
          .ps-rail-btn:hover {
            color: #fff;
          }
        }
        .ps-note {
          flex-shrink: 0;
          padding-bottom: 8px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.24);
        }

        /* ── элементы внутри 3D-сцены ── */
        .ps-card {
          position: relative;
          display: grid;
          grid-template-columns: auto 1fr;
          column-gap: 10px;
          row-gap: 3px;
          align-items: center;
          width: 196px;
          padding: 10px 12px 11px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-left: 2px solid var(--orange);
          background: rgba(18, 18, 18, 0.86);
          backdrop-filter: blur(6px);
          opacity: 0;
          visibility: hidden;
          white-space: normal;
        }
        .ps-card--right {
          transform: translate(10px, -50%) translateX(calc(var(--ps-in, 1) * 10px));
        }
        .ps-card--left {
          transform: translate(calc(-100% - 10px), -50%) translateX(calc(var(--ps-in, 1) * -10px));
        }
        .ps-card--bottom {
          transform: translate(-50%, 8px) translateY(calc(var(--ps-in, 1) * 10px));
        }
        .ps-card-icon {
          grid-row: span 2;
          display: block;
          width: 32px;
          height: 22px;
          color: var(--orange);
        }
        .ps-card-icon svg {
          display: block;
          width: 100%;
          height: 100%;
        }
        .ps-card-tag {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #fff;
        }
        .ps-card-line {
          font-family: "Onest", sans-serif;
          font-size: 11.5px;
          line-height: 1.3;
          color: rgba(255, 255, 255, 0.6);
        }
        .ps-idtag {
          display: flex;
          align-items: baseline;
          gap: 0;
          transform: translateY(-100%);
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .ps-idtag b {
          padding: 3px 6px 2px;
          background: var(--orange);
          color: #fff;
          font-weight: 400;
          font-size: 11px;
        }
        .ps-idtag span {
          padding: 3px 6px 2px;
          background: rgba(16, 16, 16, 0.82);
          color: rgba(255, 255, 255, 0.82);
        }
        .ps-idtag span:empty {
          display: none;
        }
        .ps-dim {
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.8);
        }
        .ps-dim--bottom {
          transform: translate(-50%, 6px);
        }
        .ps-dim--side {
          transform: translate(8px, -50%);
        }
        .ps-idmini {
          transform: translate(-50%, -50%);
          padding: 2px 5px 1px;
          border: 1px solid rgba(255, 90, 0, 0.7);
          background: rgba(16, 16, 16, 0.82);
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          color: #fff;
        }

        /* ── паспорт элемента ── */
        .ps-tip {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 3;
          width: 214px;
          padding: 11px 13px 12px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-top: 2px solid var(--orange);
          background: rgba(16, 16, 16, 0.92);
          backdrop-filter: blur(6px);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.18s ease;
        }
        .ps-tip[data-on="1"] {
          opacity: 1;
        }
        .ps-tip-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-family: "CoFo Sans Mono", monospace;
          text-transform: uppercase;
        }
        .ps-tip-head b {
          font-size: 14px;
          font-weight: 400;
          color: #fff;
        }
        .ps-tip-head span {
          font-size: 10px;
          letter-spacing: 0.12em;
          color: var(--orange);
        }
        .ps-tip dl {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 4px 12px;
          margin-top: 9px;
          font-size: 12px;
        }
        .ps-tip dt {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
          padding-top: 2px;
        }
        .ps-tip dd {
          font-family: "Onest", sans-serif;
          color: rgba(255, 255, 255, 0.85);
        }

        /* ── планшет ── */
        @media (max-width: 1023px) {
          .ps-caption {
            width: min(360px, 40vw);
          }
          .ps-chips {
            display: none;
          }
        }

        /* ── мобильный: сцена сверху, подпись снизу ── */
        @media (max-width: 767px) {
          .ps-section {
            height: 560svh;
          }
          .ps-sticky {
            min-height: 520px;
          }
          .ps-shade {
            background: linear-gradient(0deg, rgba(16, 16, 16, 0.97) 0%, rgba(16, 16, 16, 0.9) 34%, rgba(16, 16, 16, 0) 56%),
              linear-gradient(180deg, rgba(16, 16, 16, 0.85) 0%, rgba(16, 16, 16, 0) 20%);
          }
          .ps-meta-mark {
            display: none;
          }
          .ps-title {
            font-size: clamp(20px, 6.4vw, 28px);
          }
          .ps-body {
            align-items: flex-end;
            padding-bottom: 24px;
          }
          .ps-caption {
            width: 100%;
          }
          .ps-step-title {
            margin-top: 8px;
            font-size: clamp(18px, 5.4vw, 22px);
          }
          .ps-step-text {
            margin-top: 8px;
            font-size: 13.5px;
            line-height: 1.45;
          }
          .ps-outcome {
            margin-top: 10px;
            font-size: 13px;
          }
          .ps-hint {
            margin-top: 8px;
          }
          .ps-route {
            left: 24px;
            right: 24px;
            top: 118px;
            bottom: auto;
            width: auto;
          }
          .ps-route li {
            padding: 7px 6px 8px;
            font-size: 7.5px;
            letter-spacing: 0.04em;
          }
          .ps-route li b {
            font-size: 14px;
          }
          .ps-rail-label,
          .ps-note {
            display: none;
          }
          .ps-card {
            width: 118px;
            padding: 7px 8px 8px;
            grid-template-columns: 1fr;
          }
          .ps-card-icon {
            display: none;
          }
          .ps-card-tag {
            font-size: 10px;
          }
          .ps-card-line {
            font-size: 10px;
          }
        }

        @media (max-height: 700px) and (min-width: 768px) {
          .ps-chips {
            display: none;
          }
          .ps-step-text {
            font-size: 14px;
          }
        }
      `}</style>
    </section>
  );
}
