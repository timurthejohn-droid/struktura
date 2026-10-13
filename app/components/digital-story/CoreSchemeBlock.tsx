"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "framer-motion";
import SectionHead from "../SectionHead";
import { CORE_SCENE_LABELS_CSS } from "./sceneLabels";

// та же 3D-схема ядра, что в сторителлинге, — только показываем ключевые состояния
const CoreStoryScene = dynamic(() => import("../digital/CoreStoryScene"), { ssr: false });

const VIEWS = [
  {
    label: "Геометрия",
    at: 0.07,
    title: "В центре — цифровая геометрия",
    text: "Точная 3D-модель формы объекта. С ней одновременно работают архитектура и инженерия — это общая основа для всех решений.",
  },
  {
    label: "Слои данных",
    at: 0.31,
    title: "Вокруг формы — слои информации",
    text: "Подсистема, расчёты, документация, производство и монтаж — шесть слоёв данных, связанных с каждым элементом объекта.",
  },
  {
    label: "Подсистема",
    at: 0.555,
    title: "Внутри — инженерный хребет",
    text: "Несущая подсистема с узлами, расчётами, деталировкой и решениями для монтажа. Её проверяют до изготовления.",
  },
  {
    label: "Участники",
    at: 0.85,
    title: "Все участники — вокруг одного ядра",
    text: "Каждый получает из ядра свою часть данных и возвращает результат. Факт с площадки тоже возвращается в модель.",
  },
];
const DURATION = 7; // секунд на состояние при автопоказе

export default function CoreSchemeBlock() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const progress = useMotionValue(VIEWS[0].at);
  const [view, setView] = useState(0);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // смена состояния: схема быстро гаснет, перескакивает в новое состояние и проявляется
  const [fading, setFading] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduced) {
      progress.set(VIEWS[view].at);
      return;
    }
    setFading(true);
    const t1 = window.setTimeout(() => progress.set(VIEWS[view].at), 260);
    const t2 = window.setTimeout(() => setFading(false), 360);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [view, progress, reduced]);

  // автопоказ, пока блок на экране и посетитель не выбрал состояние сам
  useEffect(() => {
    if (!active || paused || reduced) return;
    const t = window.setTimeout(() => setView((v) => (v + 1) % VIEWS.length), DURATION * 1000);
    return () => window.clearTimeout(t);
  }, [view, active, paused, reduced]);

  const pick = (i: number) => {
    setView(i);
    setPaused(true);
  };

  const v = VIEWS[view];

  return (
    <section ref={ref} id="ds-scheme" className="ds-scheme ds-deep" aria-label="Как устроено цифровое ядро">
      <div className={`ds-scheme-canvas ds-simple${fading ? " is-fading" : ""}`}>
        <CoreStoryScene progress={progress} reduced={reduced} active={active} selected={null} still />
      </div>
      <div className="ds-scheme-shade" aria-hidden />

      <div className="ds-scheme-ui container-x">
        <div className="ds-scheme-panel">
          <SectionHead index="04" kicker="Как устроено ядро" theme="dark" className="!mb-0" />
          <div className="ds-tabs" role="tablist" aria-label="Состояния схемы">
            {VIEWS.map((x, i) => (
              <button
                key={x.label}
                type="button"
                role="tab"
                aria-selected={i === view}
                className={`ds-tab${i === view ? " on" : ""}${paused || reduced ? " paused" : ""}`}
                style={{ ["--dur" as string]: `${DURATION}s` }}
                onClick={() => pick(i)}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                {x.label}
                <i key={`${view}-${paused}`} className="ds-tab-bar" aria-hidden />
              </button>
            ))}
          </div>
          <div className="ds-tab-text" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={view}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3>{v.title}</h3>
                <p className="ds-body ds-muted mt-4">{v.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: CORE_SCENE_LABELS_CSS }} />
    </section>
  );
}
