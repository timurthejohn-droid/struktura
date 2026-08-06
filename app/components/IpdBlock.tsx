"use client";
import { useReveal } from "./useReveal";
import SectionHead from "./SectionHead";

const outcomes = [
  {
    n: "01",
    body: "Каждое проектное решение учитывает логику производства, логистики и стройки.",
  },
  {
    n: "02",
    body: "Конфликты и потери устраняются ещё на стадии цифрового моделирования.",
  },
  {
    n: "03",
    body: "Сроки сокращаются, бюджет контролируется, идея сохраняется без компромиссов.",
  },
];

export default function IpdBlock() {
  const ref = useReveal();

  return (
    <section id="ipd" className="py-24 md:py-40" style={{ background: "var(--orange)" }}>
      <div className="container-x">
        <div ref={ref} className="reveal">
          <SectionHead index="08" kicker="Единая система · IPD" theme="orange" />

          <h2 className="text-white max-w-4xl mb-8" style={{ fontSize: "clamp(26px, 3.2vw, 50px)", lineHeight: 1.12 }}>
            Обычно проект идёт по&nbsp;эстафете и&nbsp;теряет данные на&nbsp;каждой
            передаче. STRUKTURA собирает всех участников и&nbsp;все стадии
            в&nbsp;одну систему&nbsp;— по&nbsp;модели IPD{" "}
            <span className="text-white/60">(Integrated Project Delivery)</span>.
          </h2>

          <p className="font-body text-white/80 max-w-2xl mb-16" style={{ fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.5 }}>
            Одна команда, одна цифровая модель, одна ответственность&nbsp;— от&nbsp;проектирования
            до&nbsp;монтажа. Это устраняет системные разрывы между стадиями, участниками
            и&nbsp;дисциплинами.
          </p>

          <div className="grid md:grid-cols-3" style={{ gap: 1, background: "rgba(255,255,255,0.25)" }}>
            {outcomes.map((o) => (
              <div key={o.n} className="p-8 md:p-10 flex flex-col gap-6" style={{ background: "var(--orange)" }}>
                <span className="font-mono text-white/70 text-5xl leading-none">{o.n}</span>
                <p className="font-body text-white" style={{ fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.45 }}>
                  {o.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <a href="/ipd" className="btn btn-ghost-orange">Как устроен IPD в STRUKTURA →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
