import Link from "next/link";
import type { ReactNode } from "react";
import SectionHead from "../SectionHead";
import { IlluAssembly, IlluData, IlluLogistics, IlluMarking, IlluModel } from "./illustrations";
import { Lead, Reveal } from "./shared";

// Вехи (milestone) — добавить, когда компания передаст даты.
const steps: { title: string; text: string; artifact: string; visual: ReactNode; milestone?: string }[] = [
  { title: "Проектирование", text: "Правила и зависимости вместо ручной расстановки элементов.", artifact: "Модель", visual: <IlluModel dark /> },
  { title: "Производственные данные", text: "Модель готовится с учётом оборудования и операций.", artifact: "Производственное задание", visual: <IlluData dark /> },
  { title: "Маркировка", text: "Каждый элемент получает цифровую идентичность.", artifact: "Маркированная деталь", visual: <IlluMarking dark /> },
  { title: "Логистика", text: "Комплектация, статусы и очерёдность поставки.", artifact: "Монтажный комплект", visual: <IlluLogistics dark /> },
  { title: "Монтаж", text: "Сборка по модели с контролем положения.", artifact: "Собранная конструкция", visual: <IlluAssembly dark /> },
];

export default function SubsEvolution() {
  return (
    <section id="evolution" className="relative overflow-hidden bg-coal py-20 text-white md:py-32">
      <div className="container-x">
        <SectionHead index="02" kicker="Эволюция платформы" theme="dark" />
        <Lead dark>
          Продукт развивался вместе с компанией: каждый новый шаг цифрового контура добавлял
          подсистеме точности, управляемости и опыта.
        </Lead>

        <Reveal>
          <div className="sv3-beam mb-0 hidden h-px bg-white/15 lg:block" />
        </Reveal>
        <Reveal stagger className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-5 lg:bg-transparent">
          {steps.map((s, i) => (
            <article key={s.title} className="group relative flex flex-col bg-coal pb-8 pt-6 sm:px-5 lg:border-r lg:border-white/10 lg:px-6 lg:first:pl-0 lg:last:border-r-0">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[12px] text-orange">{String(i + 1).padStart(2, "0")}</span>
                {s.milestone && <span className="font-mono text-[11px] text-white/45">{s.milestone}</span>}
              </div>
              <div className="my-6 aspect-[200/140] w-full">{s.visual}</div>
              <h3 className="text-[15px] leading-tight">{s.title}</h3>
              <p className="mt-3 font-body text-[14px] leading-snug text-white/55">{s.text}</p>
              <span className="mt-auto pt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">→ {s.artifact}</span>
            </article>
          ))}
        </Reveal>

        {/* Переход к цифровой среде: заголовок слева, пояснение и кнопка справа */}
        <Reveal className="mt-16 md:mt-24">
          <div className="border-t border-white/15">
            <div className="grid gap-8 pt-10 md:pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-orange">Цифровая среда STRUKTURA+</span>
                <h3 className="mt-6 max-w-[560px] text-[clamp(26px,2.8vw,44px)] leading-[1.02] text-white">
                  Подсистема развивается <span className="text-orange">внутри цифровой среды</span>
                </h3>
              </div>
              <div className="flex flex-col justify-between gap-8">
                <p className="max-w-[520px] font-body text-[clamp(16px,1.3vw,19px)] leading-[1.55] text-white/65">
                  Это общая основа данных, алгоритмов и взаимодействия участников: в ней инженерный каркас
                  обрастает узлами, расчётами, заданиями и данными сборки.
                </p>
                <Link href="/digital" className="btn btn-orange self-start">
                  Подробнее о цифровой среде
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
