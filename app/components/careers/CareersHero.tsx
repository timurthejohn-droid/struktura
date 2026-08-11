import GridLines from "../GridLines";
import { vacancies } from "./careersData";

// Первый экран страницы для соискателей — в ритме остальных внутренних
// страниц: служебная строка, крупный заголовок, лид и опорные цифры.

const stats = [
  { value: "70+", label: "Экспертов в команде" },
  { value: String(vacancies.length).padStart(2, "0"), label: "Открытых вакансий" },
  { value: "Москва", label: "Офис и производство" },
];

export default function CareersHero() {
  return (
    <section className="relative flex min-h-[560px] flex-col overflow-hidden bg-paper md:min-h-[620px]">
      <GridLines theme="light" count={4} />
      <div className="container-x relative z-10 flex w-full flex-1 flex-col pb-8 pt-24 md:pt-28">
        <div className="flex items-center justify-between border-b border-black/10 pb-4 rise-in" style={{ animationDelay: "0.05s" }}>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">Соискателям</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">Вакансии</span>
        </div>

        <div className="flex flex-1 flex-col justify-center py-10 md:py-14">
          <h1
            className="max-w-[1160px] text-[clamp(40px,7.3vw,108px)] leading-[0.94] text-ink rise-in"
            style={{ animationDelay: "0.18s" }}
          >
            Работа<br />в <span className="text-orange">STRUKTURA</span>
          </h1>
        </div>

        <div className="border-t border-black/10 pt-6 rise-in" style={{ animationDelay: "0.3s" }}>
          <div className="grid items-end gap-7 lg:grid-cols-[1fr_auto] lg:gap-16">
            <p className="max-w-[680px] font-body text-[clamp(15px,1.2vw,19px)] leading-[1.55] text-ink/60">
              Команда единомышленников, которая делает архитектуру инженерными методами: расчёт,
              цифровая модель, производство и монтаж — внутри одной компании.
            </p>
            <a href="#vacancies" className="btn btn-orange">Открытые вакансии ↓</a>
          </div>

          <div className="mt-10 grid gap-x-8 gap-y-5 border-t border-black/10 pt-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-4">
                <span className="font-mono text-[clamp(22px,2.4vw,34px)] leading-none text-ink">{stat.value}</span>
                <span className="font-mono text-[10px] uppercase leading-[1.3] tracking-[0.16em] text-ink/40">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
