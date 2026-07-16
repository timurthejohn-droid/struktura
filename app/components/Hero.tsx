import GridLines from "./GridLines";

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
      className="relative min-h-[640px] md:min-h-[720px] lg:min-h-[760px] flex flex-col overflow-hidden"
      style={{ background: "var(--paper)" }}
    >
      <GridLines theme="light" count={5} />
      <div className="container-x w-full flex flex-col flex-1 pt-24 md:pt-28 pb-8 relative z-10">
        {/* Top technical strip — sits well below the fixed nav, on its own hairline */}
        <div
          className="flex items-center justify-between pb-4 md:pb-5"
          style={{ borderBottom: "1px solid var(--line-light)" }}
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

        {/* Headline — large, two wide lines, fills the vertical space */}
        <div className="flex-1 flex flex-col justify-center py-10 md:py-14">
          <h1
            className="text-ink"
            style={{
              fontSize: "clamp(32px, 6.2vw, 90px)",
              lineHeight: 0.98,
              letterSpacing: "-0.01em",
            }}
          >
            Превращаем сложные&nbsp;идеи
            <br />в <span className="text-orange">реализованные</span> объекты
          </h1>
        </div>

        {/* Bottom row — subcopy + CTA on a hairline, sector tags beneath */}
        <div className="pt-6" style={{ borderTop: "1px solid var(--line-light)" }}>
          <div className="grid lg:grid-cols-[1fr_auto] gap-7 lg:gap-16 items-end">
            <p
              className="font-body max-w-xl"
              style={{
                color: "var(--ink-soft)",
                fontSize: "clamp(15px, 1.2vw, 19px)",
                lineHeight: 1.55,
              }}
            >
              Объединяем проектирование, производство и&nbsp;монтаж сложных
              архитектурных объектов в&nbsp;единую управляемую систему — от&nbsp;идеи
              до&nbsp;готового результата.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#projects" className="btn btn-orange">
                Все проекты →
              </a>
              <a href="#contact" className="btn btn-ghost-light">
                Обсудить проект
              </a>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
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
