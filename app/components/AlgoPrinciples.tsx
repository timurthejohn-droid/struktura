"use client";
import SectionHead from "./SectionHead";
import { useReveal } from "./useReveal";

export default function AlgoPrinciples() {
  const revealRef = useReveal();
  return (
    <section className="py-24 md:py-40 relative overflow-hidden" style={{ background: "var(--orange)" }}>
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{ backgroundImage: "repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 30px)" }}
      />
      <div className="container-x relative z-10">
        <SectionHead index="04 · Решение" kicker="Алгоритмический подход" theme="orange" />

        {/* методология + cta */}
        <div
          ref={revealRef}
          className="reveal grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-24 items-center"
        >
          <p className="font-body text-white" style={{ fontSize: "clamp(18px, 1.7vw, 28px)", lineHeight: 1.45 }}>
            В&nbsp;основе STRUKTURA+ — собственная методология цифровизации всех этапов
            проекта. Хаос превращается в&nbsp;систему, а&nbsp;результат становится
            предсказуемым. Подход работает по&nbsp;4&nbsp;принципам теории алгоритмов.
          </p>
          <div className="lg:justify-self-end">
            <a href="#digital" className="btn btn-white">Подробнее о подходе →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
