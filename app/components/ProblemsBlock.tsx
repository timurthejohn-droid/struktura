"use client";
import { useReveal } from "./useReveal";
import SectionHead from "./SectionHead";

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

const PEEK = 60; // px of the previous card left visible

export default function ProblemsBlock() {
  const ref = useReveal();

  return (
    <section className="py-24 md:py-36" style={{ background: "var(--coal)" }}>
      <div className="container-x">
        <SectionHead index="03" kicker="Проблематика" theme="dark" />

        {/* framing headline */}
        <div ref={ref} className="reveal grid lg:grid-cols-[1.25fr_0.75fr] gap-8 lg:gap-20 items-end mb-12 md:mb-16">
          <h2 className="text-white" style={{ fontSize: "clamp(28px, 3.7vw, 58px)", lineHeight: 1.04 }}>
            Сложные проекты теряют до&nbsp;<span className="text-orange">50%</span> бюджета на&nbsp;ошибках и&nbsp;переделках
          </h2>
          <p className="font-body text-white/55" style={{ fontSize: 15, lineHeight: 1.65 }}>
            По данным McKinsey и&nbsp;KPMG, перерасход на&nbsp;нестандартных объектах
            достигает 50–70%. И&nbsp;почти всегда — по&nbsp;одним и&nbsp;тем&nbsp;же причинам.
          </p>
        </div>

        {/* stacking cards */}
        <div>
          {problems.map((p, i) => (
            <div
              key={p.n}
              style={{ position: "sticky", top: `calc(86px + ${i * PEEK}px)` }}
            >
              <div
                className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-2 lg:gap-16 px-6 md:px-10 py-9 md:py-12"
                style={{
                  background: "#1c1c1c",
                  borderTop: "2px solid var(--orange)",
                  boxShadow: "0 -16px 36px rgba(0,0,0,0.5)",
                  minHeight: 220,
                }}
              >
                <div className="font-mono text-orange leading-[0.8]" style={{ fontSize: "clamp(54px, 10vw, 168px)" }}>
                  {p.n}
                </div>
                <div className="lg:pt-2">
                  <h3 className="font-mono text-orange mb-4" style={{ fontSize: "clamp(20px, 2.1vw, 32px)", letterSpacing: "0.01em" }}>
                    {p.title}
                  </h3>
                  <p className="font-body text-white/60 max-w-xl" style={{ fontSize: "clamp(15px, 1.1vw, 18px)", lineHeight: 1.65 }}>
                    {p.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* bridge to the solution */}
        <a
          href="#algo"
          className="group relative z-10 flex flex-wrap items-baseline gap-x-5 gap-y-2 mt-10 md:mt-16 pt-10 md:pt-14"
          style={{ background: "var(--coal)", borderTop: "1px solid rgba(255,90,0,0.45)" }}
        >
          <span className="font-mono text-white/45 text-xs tracking-[0.22em] uppercase">Решение&nbsp;→</span>
          <span className="font-mono text-white group-hover:text-orange transition-colors" style={{ fontSize: "clamp(24px, 3.4vw, 52px)", lineHeight: 1 }}>
            Алгоритмический подход
          </span>
        </a>
      </div>
    </section>
  );
}
