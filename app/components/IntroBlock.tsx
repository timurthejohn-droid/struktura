"use client";
import { useReveal } from "./useReveal";
import AboutMark from "./AboutMark";

export default function IntroBlock() {
  const ref = useReveal();

  return (
    <section
      id="about"
      className="py-16 md:py-24"
      style={{ background: "var(--paper)", borderTop: "1px solid var(--line-light)" }}
    >
      <div className="container-x">
        <div ref={ref} className="reveal grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20">
          <div className="flex flex-col items-start">
            <div className="eyebrow text-ink mb-7">О компании</div>

            <div
              className="relative w-full max-w-[387px] aspect-square overflow-hidden"
              style={{ background: "var(--paper)" }}
              aria-hidden="true"
            >
              <AboutMark />
            </div>
          </div>

          <div className="lg:pt-1">
            <h2
              className="text-ink max-w-[660px]"
              style={{
                fontSize: "clamp(28px, 3.9vw, 40px)",
                lineHeight: 1.1,
                letterSpacing: "0.05em",
              }}
            >
              Разработчик и&nbsp;интегратор уникальных архитектурных решений
            </h2>

            <p
              className="font-body text-ink-soft max-w-[648px] mt-8 md:mt-12"
              style={{ fontSize: "clamp(16px, 1.45vw, 20px)", lineHeight: 1.4 }}
            >
              Объединяем проектирование, производство и&nbsp;монтаж сложных
              архитектурных объектов в&nbsp;единую управляемую систему — от&nbsp;идеи
              до&nbsp;готового результата.
            </p>

            <a
              href="#about"
              className="btn btn-orange mt-11"
            >
              О компании
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
