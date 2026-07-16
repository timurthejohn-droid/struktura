"use client";
import { useReveal } from "./useReveal";

const problems = [
  {
    n: "01",
    title: "Бюджет растёт после старта",
    body: "Проект стартует с одних цифр, но в процессе растёт из-за изменений и пересчётов. Экономия на инжиниринге оборачивается удорожанием в 2–3 раза.",
  },
  {
    n: "02",
    title: "Ошибки выявляются уже на стройке",
    body: "Конфликты решений обнаруживаются на площадке, когда исправления стоят дорого и сдвигают сроки.",
  },
  {
    n: "03",
    title: "Проект не готов к производству",
    body: "Визуально решения выглядят эффектно, но не учитывают технологические ограничения, специфику сборки и логистику.",
  },
  {
    n: "04",
    title: "Теряется управляемость проекта",
    body: "Изменения накапливаются, координация усложняется, ответственность размывается между участниками.",
  },
];

const PEEK = 58;

export default function ProblemsBlock() {
  const ref = useReveal();

  return (
    <section className="bg-coal text-white">
      <div className="container-x">
        <div
          ref={ref}
          className="reveal grid min-h-[260px] items-end gap-8 py-14 md:grid-cols-[0.95fr_1.05fr] md:py-20"
          style={{ borderTop: "1px solid var(--line-dark)" }}
        >
          <div>
            <div className="eyebrow text-white/55 mb-8">Проблематика</div>
            <h2
              className="max-w-[720px] text-white"
              style={{ fontSize: "clamp(30px, 4.4vw, 70px)", lineHeight: 0.98 }}
            >
              Где сложные проекты теряют бюджет
            </h2>
          </div>
          <p
            className="font-body max-w-[620px] text-white/60 md:pb-2"
            style={{ fontSize: "clamp(16px, 1.25vw, 20px)", lineHeight: 1.5 }}
          >
            Перерасход и&nbsp;сдвиги сроков возникают не&nbsp;в&nbsp;одной точке,
            а&nbsp;накапливаются по&nbsp;цепочке: от&nbsp;неполного задания до&nbsp;ошибок
            производства и&nbsp;монтажа.
          </p>
        </div>
      </div>

      <div className="pb-10 md:pb-16">
        {problems.map((p, i) => (
          <div
            key={p.n}
            className="relative"
            style={{ position: "sticky", top: `calc(78px + ${i * PEEK}px)`, zIndex: i + 1 }}
          >
            <div
              style={{
                background: "var(--coal)",
                borderTop: "1px solid var(--line-dark)",
              }}
            >
              <div className="container-x">
                <div className="grid min-h-[300px] grid-cols-1 gap-8 py-10 md:min-h-[315px] md:grid-cols-[0.95fr_1.05fr] md:py-12 lg:py-14">
                <div className="overflow-hidden">
                  <span
                    className="block font-body font-semibold leading-[0.78] text-orange"
                    style={{ fontSize: "clamp(112px, 17vw, 282px)", letterSpacing: "-0.06em" }}
                  >
                    {p.n}
                  </span>
                </div>
                <div className="flex max-w-[660px] flex-col justify-center md:ml-auto md:w-full">
                  <h3
                    className="font-body normal-case text-white"
                    style={{ fontSize: "clamp(30px, 3.2vw, 48px)", lineHeight: 1.05, letterSpacing: 0 }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className="mt-6 font-body text-white/72"
                    style={{ fontSize: "clamp(17px, 1.45vw, 24px)", lineHeight: 1.28 }}
                  >
                    {p.body}
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
        ))}
      </div>
    </section>
  );
}
