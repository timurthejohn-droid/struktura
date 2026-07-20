"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

type Step = { number: string; body: string };

export default function AboutWorkflow({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  const step = steps[active];

  return (
    <section className="bg-paper py-24 md:py-36">
      <div className="container-x">
        <div className="flex items-center justify-between border-b border-black/10 pb-4">
          <span className="font-mono text-[12px] text-orange">02</span>
          <span className="font-mono text-[11px] tracking-[0.24em] text-ink/25">STRUKTURA<span className="text-orange">+</span></span>
        </div>

        <h2 className="mt-12 text-[clamp(24px,2.45vw,40px)] leading-[1.22] text-ink md:mt-16">
          STRUKTURA УСТРАНЯЕТ СИСТЕМНЫЕ РАЗРЫВЫ МЕЖДУ СТАДИЯМИ, УЧАСТНИКАМИ И ДИСЦИПЛИНАМИ — ЗА СЧЁТ IPD (INTEGRATED PROJECT DELIVERY) И ПОЛНОГО ЦИФРОВОГО ЦИКЛА
        </h2>

        <div className="relative mt-16 overflow-hidden bg-white md:mt-24">
          <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "linear-gradient(rgba(26,26,26,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,.08) 1px, transparent 1px)", backgroundSize: "min(10vw, 140px) min(10vw, 140px)" }} />
          <div className="relative grid min-h-[590px] lg:h-[720px] lg:grid-cols-[minmax(270px,.55fr)_minmax(0,1.45fr)]">
            <div className="flex flex-col overflow-hidden border-b border-black/10 p-6 md:p-10 lg:border-b-0 lg:border-r">
              <div className="flex items-start justify-between lg:block">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/45">Integrated Project Delivery</p>
                <p className="font-mono text-[12px] text-orange lg:mt-10">{step.number} / 04</p>
              </div>
              <div className="mt-auto pt-20 lg:pt-0">
                <p className="font-mono text-[clamp(52px,5.6vw,88px)] leading-[0.9] tracking-[0.02em] text-ink">IPD<span className="text-orange">+</span></p>
                <p className="mt-7 max-w-[220px] font-body text-[14px] leading-[1.45] text-ink/55">Единая модель работы для сложных архитектурных объектов.</p>
              </div>
            </div>

            <div className="flex min-h-[390px] flex-col p-6 md:p-10 lg:min-h-0">
              <div className="grid grid-cols-4 border-b border-black/10" role="tablist" aria-label="Этапы IPD">
                {steps.map((item, index) => (
                  <button
                    key={item.number}
                    type="button"
                    role="tab"
                    aria-selected={active === index}
                    onClick={() => setActive(index)}
                    className="relative h-14 text-left font-mono text-[15px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange focus-visible:outline-offset-[-2px]"
                    style={{ color: active === index ? "var(--orange)" : "rgba(26,26,26,.35)" }}
                  >
                    {item.number}
                    {active === index && <motion.span layoutId="ipd-active" className="absolute bottom-0 left-0 right-3 h-px bg-orange" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  </button>
                ))}
              </div>

              <div className="relative flex flex-1 items-center py-12 md:py-16" role="tabpanel">
                <span className="absolute right-0 top-9 font-mono text-[clamp(70px,11vw,168px)] leading-none text-ink/[0.05]">{step.number}</span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step.number}
                    initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.32, ease: "easeOut" }}
                    className="relative max-w-[760px]"
                  >
                    <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-orange">Этап {step.number}</p>
                    <p className="mt-7 font-body text-[clamp(19px,2vw,29px)] leading-[1.45] text-ink">{step.body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between border-t border-black/10 pt-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.17em] text-ink/35">STRUKTURA+ / Digital cycle</span>
                <span className="font-mono text-[11px] text-orange">0{active + 1}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
