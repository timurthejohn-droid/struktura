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
        <SectionHead index="04 · Решение" kicker="Алгоритмический подход" theme="dark" indexColor="#ffffff" />

        {/* методология + cta */}
        <div
          ref={revealRef}
          className="reveal"
        >
          <p className="font-body max-w-4xl text-white" style={{ fontSize: "clamp(18px, 1.7vw, 28px)", lineHeight: 1.45 }}>
            В&nbsp;основе алгоритмического подхода STRUKTURA&nbsp;— собственная
            методология цифровизации всех этапов проекта. Это точная последовательность
            действий, которая приводит к&nbsp;предсказуемому результату.
          </p>
          <div className="mt-10">
            <a href="#digital" className="btn btn-white">Подробнее о подходе</a>
          </div>
        </div>
      </div>
    </section>
  );
}
