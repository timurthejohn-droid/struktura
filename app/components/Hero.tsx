import GridLines from "./GridLines";
import HeroPlus from "./HeroPlus";

const sectors = [
  "Общественные пространства",
  "Арт-объекты",
  "Фасады и навесы",
  "Интерьерные системы",
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[700px] md:min-h-[780px] lg:min-h-[840px] flex flex-col overflow-hidden"
      style={{ background: "var(--paper)" }}
    >
      <GridLines theme="light" count={5} />
      <div className="container-x w-full flex flex-col flex-1 pt-24 md:pt-28 pb-8 relative z-10">
        {/* Top technical strip — sits well below the fixed nav, on its own hairline */}
        <div
          className="flex items-center justify-between pb-4 md:pb-5 rise-in"
          style={{ borderBottom: "1px solid var(--line-light)", animationDelay: "0.05s" }}
        >
          <div className="flex items-center gap-4">
            <span
              className="font-mono font-medium tracking-[0.04em] text-ink"
              style={{ fontSize: 13 }}
            >
              STRUKTURA<span className="text-orange">+</span>
            </span>
            <span
              className="hidden sm:inline font-mono text-[10px] tracking-[0.2em] uppercase"
              style={{ color: "var(--ink-soft)" }}
            >
              Инжиниринг сложных объектов
            </span>
          </div>
          <span
            className="font-mono text-[10px] tracking-[0.2em] uppercase"
            style={{ color: "var(--ink-soft)" }}
          >
            Москва
          </span>
        </div>

        {/* Centerpiece — headline, the metallic 3D plus on its dark stage, then supporting copy */}
        <div className="flex-1 flex flex-col items-center justify-center text-center py-6 md:py-8">
          <h1
            className="text-ink rise-in"
            style={{
              fontSize: "clamp(30px, 5.4vw, 80px)",
              lineHeight: 1.0,
              letterSpacing: "-0.01em",
              animationDelay: "0.14s",
            }}
          >
            Превращаем сложные&nbsp;идеи
            <br />в <span className="text-orange">реализованные</span> объекты
          </h1>

          {/* Dark stage + 3D plus */}
          <div
            className="relative w-full my-6 md:my-8 rise-in"
            style={{ height: "clamp(220px, 34vh, 380px)", animationDelay: "0.2s" }}
          >
            {/* Dark backdrop — soft radial so there is no hard box edge on the warm paper */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(58% 78% at 50% 46%, #16120d 0%, #1b1712 46%, rgba(27,23,18,0) 78%)",
              }}
            />
            {/* Warm bloom behind the metal */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(34% 46% at 50% 52%, rgba(255,90,0,0.22) 0%, rgba(255,90,0,0) 70%)",
                mixBlendMode: "screen",
              }}
            />
            <HeroPlus />
          </div>

          <p
            className="font-body max-w-xl rise-in"
            style={{
              color: "var(--ink-soft)",
              fontSize: "clamp(15px, 1.2vw, 19px)",
              lineHeight: 1.55,
              animationDelay: "0.28s",
            }}
          >
            Объединяем проектирование, производство и&nbsp;монтаж сложных
            архитектурных объектов в&nbsp;единую управляемую систему — от&nbsp;идеи
            до&nbsp;готового результата.
          </p>

          <div
            className="mt-7 flex flex-wrap gap-3 justify-center rise-in"
            style={{ animationDelay: "0.36s" }}
          >
            <a href="#projects" className="btn btn-orange">
              Все проекты →
            </a>
            <a href="#contact" className="btn btn-ghost-light">
              Обсудить проект
            </a>
          </div>
        </div>

        {/* Bottom hairline — sector tags */}
        <div
          className="pt-5 rise-in"
          style={{ borderTop: "1px solid var(--line-light)", animationDelay: "0.44s" }}
        >
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {sectors.map((s) => (
              <span
                key={s}
                className="font-mono text-[10px] tracking-[0.16em] uppercase"
                style={{ color: "var(--ink-soft)" }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
