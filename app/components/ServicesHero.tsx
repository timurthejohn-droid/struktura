import GridLines from "./GridLines";

const directions = ["R&D", "Проектирование", "Производство", "Логистика", "Монтаж"];

export default function ServicesHero() {
  return (
    <section className="relative flex min-h-[680px] flex-col overflow-hidden bg-paper md:min-h-[740px] lg:min-h-[780px]">
      <GridLines theme="light" count={5} />
      <div className="container-x relative z-10 flex w-full flex-1 flex-col pb-8 pt-24 md:pt-28">
        <div className="flex items-center justify-between border-b border-black/10 pb-4 rise-in" style={{ animationDelay: "0.05s" }}>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">Полный цикл реализации</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">Услуги / 01</span>
        </div>

        <div className="flex flex-1 flex-col justify-center py-10 md:py-14">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-orange rise-in" style={{ animationDelay: "0.12s" }}>От концепции к объекту</p>
          <h1 className="max-w-[1160px] text-[clamp(40px,7.3vw,108px)] leading-[0.94] text-ink rise-in" style={{ animationDelay: "0.18s" }}>
            От идеи<br />до <span className="text-orange">монтажа</span>
          </h1>
        </div>

        <div className="border-t border-black/10 pt-6 rise-in" style={{ animationDelay: "0.3s" }}>
          <div className="grid items-end gap-7 lg:grid-cols-[1fr_auto] lg:gap-16">
            <p className="max-w-[680px] font-body text-[clamp(15px,1.2vw,19px)] leading-[1.55] text-ink/60">
              Объединяем инженерную разработку, проектирование, производство и монтаж сложных архитектурных решений в одну управляемую систему.
            </p>
            <a href="#services" className="btn btn-orange">Смотреть услуги ↓</a>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
            {directions.map((direction) => (
              <span key={direction} className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/50">{direction}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
