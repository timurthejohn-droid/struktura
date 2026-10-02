"use client";
import Link from "next/link";
import { useReveal } from "./useReveal";
import HeroHologram from "./digital/HeroHologram";

/**
 * Блок «Цифровая среда» на главной: заголовок, описание и кнопка поверх
 * голограммы-сферы. Светлая копия главной продолжает использовать DigitalEnvFlow —
 * свечение голограммы рассчитано на тёмный фон.
 */
export default function DigitalEnvHologram() {
  const ref = useReveal();

  return (
    <section id="digital" className="relative overflow-hidden" style={{ background: "var(--coal)" }}>
      <HeroHologram layout="section" />

      <div className="container-x relative z-10 flex flex-col py-28 md:py-44" style={{ minHeight: "clamp(760px, 104svh, 1040px)" }}>
        <div className="mb-10 md:mb-14">
          <div className="flex items-center justify-between gap-4 pb-3">
            <span className="font-mono font-medium text-orange" style={{ fontSize: 13, letterSpacing: "0.04em" }}>
              05
            </span>
            <span
              className="hidden select-none font-mono text-white/20 sm:inline"
              style={{ fontSize: 12, letterSpacing: "0.32em" }}
              aria-hidden
            >
              STRUKTURA
              <span style={{ fontSize: 9, verticalAlign: "super", letterSpacing: 0 }}>+</span>
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
            <h2
              className="font-mono uppercase text-white"
              style={{ fontSize: "clamp(30px, 4.6vw, 72px)", lineHeight: 0.98, letterSpacing: "-0.01em" }}
            >
              Цифровая среда
            </h2>
            <Link href="/digital" className="btn btn-orange md:mt-2">
              Подробнее о цифровой среде
            </Link>
          </div>
        </div>

        <div ref={ref} className="reveal">
          <p className="max-w-2xl font-body text-white/70" style={{ fontSize: "clamp(15px, 1.2vw, 19px)", lineHeight: 1.6 }}>
            Единая цифровая среда связывает все этапы проекта в&nbsp;одну систему: данные
            передаются между этапами без&nbsp;потерь, а&nbsp;каждый процесс работает
            на&nbsp;общий результат.
          </p>
        </div>
      </div>
    </section>
  );
}
