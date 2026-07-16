"use client";
import { useReveal } from "./useReveal";
import SectionHead from "./SectionHead";

const pillars = ["Проектирование", "Производство", "Логистика", "Монтаж"];

export default function IntroBlock() {
  const ref = useReveal();

  return (
    <section id="about" className="py-24 md:py-36" style={{ background: "var(--paper)", borderTop: "1px solid var(--line-light)" }}>
      <div className="container-x">
        <SectionHead index="02" kicker="О компании" theme="light" />
        <div ref={ref} className="reveal grid lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-24">
          <div>
            <h2 className="text-ink mb-8" style={{ fontSize: "clamp(30px, 3.6vw, 60px)", lineHeight: 1.05 }}>
              Разработчик и интегратор{" "}
              <span className="text-orange">уникальных</span> архитектурных решений
            </h2>
            <p className="font-body text-ink-soft max-w-lg" style={{ fontSize: "clamp(16px, 1.25vw, 20px)", lineHeight: 1.6 }}>
              Объединяем проектирование, производство и&nbsp;монтаж в&nbsp;единую
              систему реализации сложных проектов.
            </p>
            <a href="#about" className="btn btn-ghost-light mt-10">
              О компании →
            </a>
          </div>

          <div className="lg:pt-4">
            <div className="grid grid-cols-2" style={{ gap: 1, background: "var(--line-light)" }}>
              {pillars.map((p, i) => (
                <div key={p} className="flex items-center gap-3 py-7 px-1" style={{ background: "var(--paper)" }}>
                  <span className="font-mono text-orange text-xs w-7">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-mono text-[13px] tracking-[0.06em] uppercase text-ink/75">{p}</span>
                </div>
              ))}
            </div>
            <p className="font-body text-ink-soft text-sm mt-8 leading-relaxed">
              Каждый проект уникален — но подход один: точная методология,
              цифровизация и&nbsp;алгоритмическое управление всеми процессами
              от&nbsp;идеи до&nbsp;монтажа.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
