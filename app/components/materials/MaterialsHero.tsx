// [01] HERO — «Материалы. Возможности, доказанные проектами».
// Ведёт к двум сценариям: смотреть возможности или открыть каталог.

function FormField() {
  // «Материал становится формой» — сгенерированное поле линий (лист → рельеф).
  const rows = 26;
  const paths = Array.from({ length: rows }, (_, i) => {
    const t = i / (rows - 1);
    const y = 24 + t * 452;
    const amp = 46 * Math.sin(t * Math.PI); // максимум прогиба в центре
    const d = `M 0 ${y} C 130 ${y - amp}, 250 ${y - amp}, 380 ${y} S 620 ${y + amp}, 760 ${y}`;
    const op = 0.16 + 0.7 * Math.sin(t * Math.PI);
    return { d, op, key: i };
  });
  return (
    <svg viewBox="0 0 760 500" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="matHeroLine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff7a2e" />
          <stop offset="0.55" stopColor="#ff5a00" />
          <stop offset="1" stopColor="#7a2c00" />
        </linearGradient>
      </defs>
      {paths.map((p) => (
        <path key={p.key} d={p.d} fill="none" stroke="url(#matHeroLine)" strokeWidth={1.1} opacity={p.op} />
      ))}
    </svg>
  );
}

export default function MaterialsHero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--coal)" }}>
      <div className="container-x pt-36 md:pt-44 pb-16 md:pb-24">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-stretch">
          {/* Left — заголовок и действия */}
          <div className="flex flex-col justify-center">
            <span className="eyebrow text-orange">Материалы · STRUKTURA+</span>

            <h1
              className="text-white mt-6"
              style={{ fontSize: "clamp(38px, 6.6vw, 104px)", lineHeight: 0.95, letterSpacing: "-0.01em" }}
            >
              Возможности,
              <br />
              <span className="text-orange">доказанные</span>
              <br />
              проектами
            </h1>

            <p
              className="font-body text-white/60 mt-8 max-w-xl"
              style={{ fontSize: "clamp(16px, 1.4vw, 21px)", lineHeight: 1.55 }}
            >
              Это не каталог поставщика, а&nbsp;карта инженерных возможностей материалов.
              Мы&nbsp;раскрываем потенциал металла, стекла, камня и&nbsp;композитов через
              расчёт, прототипирование и&nbsp;производство.
            </p>

            <div className="flex flex-wrap gap-3 mt-10">
              <a href="#navigator" className="btn btn-orange">
                Смотреть возможности
              </a>
              <a href="#navigator" className="btn btn-ghost-dark">
                Каталог материалов
              </a>
            </div>

            {/* Формула раздела */}
            <p className="font-mono text-white/40 uppercase mt-12" style={{ fontSize: 11, letterSpacing: "0.18em", lineHeight: 1.8 }}>
              Материал <span className="text-orange">×</span> геометрия <span className="text-orange">×</span> технология{" "}
              <span className="text-orange">×</span> конструкция
            </p>
          </div>

          {/* Right — визуал «материал становится формой» */}
          <div className="relative min-h-[340px] lg:min-h-0" style={{ border: "1px solid var(--line-dark)" }}>
            <FormField />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,transparent 45%,rgba(24,24,24,0.85) 100%)" }} />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-white/45 uppercase" style={{ fontSize: 10, letterSpacing: "0.2em" }}>
                  Материал становится формой
                </p>
                <p className="font-mono text-white mt-1" style={{ fontSize: 13, letterSpacing: "0.04em" }}>
                  лист → рельеф → элемент → оболочка
                </p>
              </div>
              <span className="font-mono text-orange/70" style={{ fontSize: 10, letterSpacing: "0.2em" }}>
                R&D
              </span>
            </div>
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
              className="py-7 md:py-9 px-1"
              style={{ borderLeft: i % 2 === 0 ? "none" : "1px solid var(--line-dark)" }}
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
