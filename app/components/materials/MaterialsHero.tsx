import HeroFormAnim from "./HeroFormAnim";

// [01] HERO — «Материалы. Возможности, доказанные проектами».
// Справа — живое поле линий: материал трансформируется
// лист → рельеф → двойная кривизна → оболочка.

export default function MaterialsHero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--coal)" }}>
      <div className="container-x pt-36 md:pt-44 pb-16 md:pb-24">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-stretch">
          {/* Left — заголовок и действия */}
          <div className="flex flex-col justify-center">
            <span className="eyebrow text-orange rise-in">Материалы · STRUKTURA+</span>

            <h1
              className="text-white mt-6 rise-in"
              style={{
                fontSize: "clamp(38px, 6.6vw, 104px)",
                lineHeight: 0.95,
                letterSpacing: "-0.01em",
                animationDelay: "0.08s",
              }}
            >
              Возможности,
              <br />
              <span className="text-orange">доказанные</span>
              <br />
              проектами
            </h1>

            <p
              className="font-body text-white/60 mt-8 max-w-xl rise-in"
              style={{ fontSize: "clamp(16px, 1.4vw, 21px)", lineHeight: 1.55, animationDelay: "0.16s" }}
            >
              Это не каталог поставщика, а&nbsp;карта инженерных возможностей материалов.
              Мы&nbsp;раскрываем потенциал металла, стекла, камня и&nbsp;композитов через
              расчёт, прототипирование и&nbsp;производство.
            </p>

            <div className="flex flex-wrap gap-3 mt-10 rise-in" style={{ animationDelay: "0.24s" }}>
              <a href="#navigator" className="btn btn-orange">
                Смотреть возможности
              </a>
              <a href="#navigator" className="btn btn-ghost-dark">
                Каталог материалов
              </a>
            </div>

            {/* Формула раздела */}
            <p
              className="font-mono text-white/40 uppercase mt-12 rise-in"
              style={{ fontSize: 11, letterSpacing: "0.18em", lineHeight: 1.8, animationDelay: "0.32s" }}
            >
              Материал <span className="text-orange">×</span> геометрия <span className="text-orange">×</span> технология{" "}
              <span className="text-orange">×</span> конструкция
            </p>
          </div>

          {/* Right — живая трансформация формы */}
          <div
            className="relative min-h-[340px] lg:min-h-0 overflow-hidden rise-in"
            style={{ border: "1px solid var(--line-dark)", animationDelay: "0.2s" }}
          >
            <HeroFormAnim />
          </div>
        </div>

        {/* Метрики раздела */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 mt-16 md:mt-20"
          style={{ borderTop: "1px solid var(--line-dark)" }}
        >
          {[
            { v: "29", l: "материалов" },
            { v: "6", l: "семейств" },
            { v: "13", l: "предельных технологий" },
            { v: "4", l: "уровня доказательства" },
          ].map((m, i) => (
            <div
              key={m.l}
              className="py-7 md:py-9 px-1 rise-in"
              style={{
                borderLeft: i % 2 === 0 ? "none" : "1px solid var(--line-dark)",
                animationDelay: `${0.36 + i * 0.08}s`,
              }}
            >
              <div className="font-mono text-white" style={{ fontSize: "clamp(32px, 4.4vw, 56px)", lineHeight: 1 }}>
                {m.v}
              </div>
              <div className="font-mono text-white/45 uppercase mt-2" style={{ fontSize: 11, letterSpacing: "0.1em" }}>
                {m.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
