"use client";
import SectionHead from "./SectionHead";

const results = ["Снижение бюджета", "Сокращение сроков", "Исключение коллизий", "Контроль на каждом этапе"];

export default function AlgoPrinciples() {
  return (
    <section className="py-24 md:py-40 relative overflow-hidden" style={{ background: "var(--orange)" }}>
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{ backgroundImage: "repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 30px)" }}
      />
      <div className="container-x relative z-10">
        <SectionHead index="04 · Решение" kicker="Алгоритмический подход" theme="orange" />

        {/* story pivot: problems → solution */}
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-24 items-end mb-16 md:mb-24">
          <h2 className="text-white" style={{ fontSize: "clamp(30px, 4vw, 66px)", lineHeight: 1.02 }}>
            Решение — точная
            <br className="hidden md:block" /> последовательность действий
          </h2>
          <p className="font-body text-white/90" style={{ fontSize: "clamp(16px, 1.3vw, 21px)", lineHeight: 1.55 }}>
            В&nbsp;основе STRUKTURA+ — собственная методология цифровизации всех этапов
            проекта. Хаос превращается в&nbsp;систему, а&nbsp;результат становится
            предсказуемым. Подход работает по&nbsp;4&nbsp;принципам теории алгоритмов.
          </p>
        </div>

        {/* warning + results + cta */}
        <div className="mt-16 md:mt-24 pt-12 grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-24" style={{ borderTop: "1px solid rgba(255,255,255,0.32)" }}>
          <p className="font-body text-white" style={{ fontSize: "clamp(18px, 1.8vw, 30px)", lineHeight: 1.4 }}>
            Без этого подхода сложные проекты невозможно реализовать без потери
            архитектурной идеи, качества исполнения или кратного удорожания.
          </p>
          <div>
            <div className="flex flex-wrap gap-2 mb-8">
              {results.map((r) => (
                <span
                  key={r}
                  className="font-mono text-[10px] tracking-[0.08em] uppercase px-3 py-2 text-white"
                  style={{ border: "1px solid rgba(255,255,255,0.4)" }}
                >
                  {r}
                </span>
              ))}
            </div>
            <a href="#digital" className="btn btn-ghost-orange">Подробнее о подходе →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
