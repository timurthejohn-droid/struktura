import SectionHead from "../SectionHead";
import { mailto, vacancies } from "./careersData";

// Список вакансий: строка-ссылка с откликом на почту.
// .hov-row из globals.css даёт оранжевую засечку слева при наведении.

export default function VacancyList() {
  return (
    <section id="vacancies" className="scroll-mt-24 bg-paper py-16 md:py-24">
      <div className="container-x">
        <SectionHead index="01" kicker="Открытые вакансии" theme="light" />

        <div className="border-t border-black/10">
          {vacancies.map((vacancy) => (
            <a
              key={vacancy.number}
              href={mailto(vacancy.title)}
              className="hov-row group relative grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 border-b border-black/10 py-6 md:grid-cols-[70px_minmax(0,1fr)_260px_44px] md:gap-x-8 md:py-8"
            >
              <span className="font-mono text-[12px] tracking-[0.14em] text-orange md:pl-5">{vacancy.number}</span>

              <span className="font-mono text-[clamp(19px,2.4vw,36px)] uppercase leading-[1.06] text-ink transition-colors group-hover:text-orange">
                {vacancy.title}
              </span>

              <span className="col-span-2 col-start-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45 md:col-span-1 md:col-start-auto">
                {vacancy.city} · {vacancy.format}
              </span>

              <span
                aria-hidden
                className="col-start-3 row-start-1 flex h-9 w-9 shrink-0 items-center justify-center justify-self-end border border-black/20 font-body text-[15px] leading-none text-ink transition-colors group-hover:border-orange group-hover:bg-orange group-hover:text-white md:col-start-auto md:row-start-auto md:h-11 md:w-11"
              >
                →
              </span>
            </a>
          ))}
        </div>

        <p className="mt-6 font-body text-[14px] leading-[1.5] text-ink/50">
          Не нашли свою роль? Присылайте резюме — держим контакт и возвращаемся, когда появляется
          подходящая задача.
        </p>
      </div>
    </section>
  );
}
