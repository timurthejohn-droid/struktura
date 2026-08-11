import { cases } from "./casesData";

// Тёмный вход на страницу кейсов: крупная типографика, чертёжная подложка
// и счётчики, собранные из данных (без выдуманных цифр).

const years = cases.map((item) => Number(item.year)).sort((a, b) => a - b);
const stats = [
  { value: String(cases.length).padStart(2, "0"), label: "Объектов в подборке" },
  { value: "03", label: "Направления работ" },
  { value: `${years[0]}—${years[years.length - 1]}`, label: "Годы реализации" },
];

export default function CasesHero() {
  return (
    <section className="relative overflow-hidden bg-coal">
      {/* Чертёжная сетка-подложка */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          maskImage: "radial-gradient(120% 90% at 50% 0%, #000 20%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(120% 90% at 50% 0%, #000 20%, transparent 78%)",
        }}
      />

      <div className="container-x relative flex min-h-[88svh] flex-col justify-between pb-12 pt-32 md:pb-16 md:pt-40">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,340px)] md:items-end">
          <div>
            <p className="eyebrow rise-in text-orange" style={{ animationDelay: "60ms" }}>
              Проекты · Кейсы
            </p>
            <h1
              className="rise-in mt-8 text-white"
              style={{ fontSize: "clamp(52px,11vw,168px)", lineHeight: 0.88, letterSpacing: "-0.02em", animationDelay: "140ms" }}
            >
              Кейсы
              <span className="text-orange">+</span>
            </h1>
            <p
              className="rise-in mt-8 max-w-[620px] text-white/85"
              style={{ fontFamily: '"CoFo Sans Mono", monospace', fontSize: "clamp(15px,1.7vw,24px)", lineHeight: 1.2, textTransform: "uppercase", animationDelay: "220ms" }}
            >
              Работаем с архитектурой в её реальном масштабе
            </p>
          </div>

          <p className="rise-in max-w-[340px] font-body text-[14px] leading-[1.55] text-white/55 md:pb-3" style={{ animationDelay: "300ms" }}>
            Фасады, интерьеры и общественные пространства с уникальной геометрией: от расчёта и
            цифровой модели до монтажа на объекте.
          </p>
        </div>

        <div className="rise-in mt-16 grid gap-px border-t border-white/15 pt-6 sm:grid-cols-3" style={{ animationDelay: "380ms" }}>
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-4 py-2">
              <span className="font-mono text-[clamp(26px,3vw,40px)] leading-none text-white">{stat.value}</span>
              <span className="font-mono text-[10px] uppercase leading-[1.3] tracking-[0.16em] text-white/40">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <div className="fade-in mt-10 flex items-center gap-3" style={{ animationDelay: "520ms" }}>
          <span className="sk-nudge font-mono text-[13px]">↓</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
            Листайте — кейсы идут стопкой
          </span>
        </div>
      </div>
    </section>
  );
}
