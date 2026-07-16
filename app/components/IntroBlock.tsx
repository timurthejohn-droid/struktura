"use client";
import { useReveal } from "./useReveal";

const helmetImage =
  "https://www.figma.com/api/mcp/asset/2d1ed6d7-9eb3-47d3-aa69-290c8b8562a5";

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
              className="relative w-full max-w-[387px] aspect-square overflow-hidden border border-black/10 bg-white/30"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, transparent calc(50% - 1px), rgba(0,0,0,0.1) 50%, transparent calc(50% + 1px)), linear-gradient(45deg, transparent calc(50% - 1px), rgba(0,0,0,0.1) 50%, transparent calc(50% + 1px))",
                }}
              />
              <img
                src={helmetImage}
                alt=""
                className="absolute left-[8%] top-[14%] w-[82%] h-[72%] object-contain"
                draggable={false}
              />
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
              className="font-body text-ink-soft max-w-[648px] mt-16 md:mt-28"
              style={{ fontSize: "clamp(16px, 1.45vw, 20px)", lineHeight: 1.4 }}
            >
              Объединяем проектирование, производство и&nbsp;монтаж в&nbsp;единую
              систему реализации сложных проектов.
            </p>

            <a
              href="#about"
              className="mt-11 inline-grid h-10 w-[220px] grid-cols-[1fr_40px] bg-orange font-mono text-[12px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-orange-dark"
            >
              <span className="flex items-center px-5">О компании</span>
              <span className="flex items-center justify-center border-l border-white/35" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
