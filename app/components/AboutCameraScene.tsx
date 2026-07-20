"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

const stages = [
  { number: "01", title: "Архитектура", detail: "Идея" },
  { number: "02", title: "Инженерия", detail: "Расчёт" },
  { number: "03", title: "Производство", detail: "Точность" },
  { number: "04", title: "Монтаж", detail: "Результат" },
];

function Stage({ stage, index, progress, reducedMotion }: { stage: (typeof stages)[number]; index: number; progress: MotionValue<number>; reducedMotion: boolean | null }) {
  const opacity = useTransform(progress, [0.06 + index * 0.16, 0.18 + index * 0.16], [0.42, 1]);

  return (
    <motion.div style={{ opacity: reducedMotion ? 1 : opacity }}>
      <span className="font-mono text-[11px] tracking-[0.16em] text-orange">{stage.number}</span>
      <div className="mt-5 h-2.5 w-2.5 border border-orange bg-coal" />
      <h2 className="mt-7 text-[clamp(21px,2.3vw,34px)] text-white">{stage.title}</h2>
      <p className="mt-3 font-body text-[14px] text-white/45">{stage.detail}</p>
    </motion.div>
  );
}

export default function AboutCameraScene() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const lineProgress = useTransform(scrollYProgress, [0.08, 0.78], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative bg-coal" style={{ height: reducedMotion ? "auto" : "280vh" }}>
      <div className="sticky top-0 min-h-screen overflow-hidden" style={{ position: reducedMotion ? "relative" : "sticky" }}>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "min(9vw, 120px) min(9vw, 120px)" }} />
        <div className="container-x relative z-10 flex min-h-screen flex-col pb-10 pt-28 md:pb-14 md:pt-32">
          <div className="max-w-[980px]">
            <span className="eyebrow text-orange">О компании · 01</span>
            <p className="mt-8 font-mono text-[12px] uppercase tracking-[0.2em] text-white/45">STRUKTURA<span className="text-orange">+</span></p>
            <h1 className="mt-5 text-white" style={{ fontSize: "clamp(42px, 6.8vw, 106px)", lineHeight: 0.92 }}>
              СЛОЖНЫЕ ИДЕИ. УПРАВЛЯЕМАЯ РЕАЛИЗАЦИЯ.
            </h1>
          </div>

          <div className="relative mt-auto pt-20 md:pt-28">
            <div className="absolute left-0 right-0 top-[calc(50%+28px)] h-px bg-white/15 md:top-[calc(50%+34px)]" />
            <motion.div className="absolute left-0 top-[calc(50%+28px)] h-px bg-orange md:top-[calc(50%+34px)]" style={{ width: reducedMotion ? "100%" : lineProgress }} />
            <div className="relative grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-8">
              {stages.map((stage, index) => <Stage key={stage.number} stage={stage} index={index} progress={scrollYProgress} reducedMotion={reducedMotion} />)}
            </div>
          </div>

          <p className="mt-12 max-w-[520px] font-body text-[17px] leading-[1.5] text-white/65 md:mt-16 md:text-[19px]">
            STRUKTURA объединяет архитектурную идею, инженерные решения, производство и монтаж в одну систему с понятным результатом.
          </p>
        </div>
      </div>
    </section>
  );
}
