"use client";
import SectionHead from "./SectionHead";
import { useReveal } from "./useReveal";

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
    <section id="ipd" className="relative overflow-hidden py-24 md:py-40" style={{ background: "var(--orange)" }}>
      <div className="ipd-grid" aria-hidden />

      <div className="container-x relative z-10">
        <div ref={ref} className="reveal">
          <SectionHead
            index="08"
            kicker="Единая система · IPD"
            theme="orange"
            indexColor="#ffffff"
            markColor="rgba(255,255,255,0.6)"
          />

          {/* Тезис — наборным шрифтом: mono-капс уже занят названием секции. */}
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-20">
            <p
              className="max-w-[720px] font-body text-white"
              style={{ fontSize: "clamp(21px, 2.2vw, 34px)", lineHeight: 1.32 }}
            >
              Обычно проект идёт по&nbsp;эстафете и&nbsp;теряет данные на&nbsp;каждой передаче.
              STRUKTURA собирает всех участников и&nbsp;все стадии в&nbsp;одну систему&nbsp;—
              по&nbsp;модели <span className="ipd-term">IPD</span>
              <span className="text-white/55">, Integrated Project Delivery</span>.
            </p>

            <div className="max-w-[460px]">
              <p
                className="font-body text-white/80"
                style={{ fontSize: "clamp(15px, 1.15vw, 17px)", lineHeight: 1.6 }}
              >
                Одна команда, одна цифровая модель, одна ответственность&nbsp;— от&nbsp;проектирования
                до&nbsp;монтажа. Это устраняет системные разрывы между стадиями, участниками
                и&nbsp;дисциплинами.
              </p>
              <div className="mt-8">
                <a href="/ipd" className="btn btn-white">
                  Как устроен IPD в STRUKTURA
                </a>
              </div>
            </div>
          </div>

          <div
            className="grid md:grid-cols-3 mt-16 md:mt-24"
            style={{ gap: 1, background: "rgba(255,255,255,0.25)" }}
          >
            {outcomes.map((o) => (
              <div key={o.n} className="p-8 md:p-10 flex flex-col gap-6" style={{ background: "var(--orange)" }}>
                <span className="font-mono text-white/70 text-5xl leading-none">{o.n}</span>
                <p
                  className="font-body text-white"
                  style={{ fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.45 }}
                >
                  {o.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Селекторы через #ipd: styled-jsx не навешивает scoped-класс на motion.*,
          поэтому стили держим глобальными, но запертыми внутри секции. */}
      <style jsx global>{`
        #ipd .ipd-grid {
          position: absolute;
          inset: 0;
          opacity: 0.16;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
          background-size: 54px 54px;
          mask-image: radial-gradient(120% 80% at 50% 60%, #000 0%, transparent 80%);
          -webkit-mask-image: radial-gradient(120% 80% at 50% 60%, #000 0%, transparent 80%);
        }

        #ipd .ipd-term {
          font-family: "CoFo Sans Mono", monospace;
          letter-spacing: 0.02em;
        }

      `}</style>
    </section>
  );
}
