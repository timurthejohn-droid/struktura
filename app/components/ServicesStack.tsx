"use client";

import SectionHead from "./SectionHead";
import { useReveal } from "./useReveal";

const services = [
  {
    number: "01",
    title: "R&D + проектирование подсистемы",
    text: "R&D, проектирование подсистемы, производство, поставка и монтаж. Возможны отдельные опции: курирование производства или реализация силами STRUKTURA.",
  },
  {
    number: "02",
    title: "R&D + проектирование подсистемы и панелей",
    text: "Разработка подсистемы и панелей, производство, ведение производства заказчика, поставка и монтаж. Состав работ формируется под конкретный проект.",
  },
  {
    number: "03",
    title: "Под ключ",
    text: "Полная ответственность за реализацию: от инженерной разработки и рабочей документации до производства, логистики и монтажа на объекте.",
  },
];

const PEEK = 64;

export default function ServicesStack() {
  const headingRef = useReveal();

  return (
    <section id="services" className="relative bg-coal pb-16 pt-20 text-white md:pb-24 md:pt-28">
      <div ref={headingRef} className="container-x reveal">
        <SectionHead index="03" kicker="Форматы работы" theme="dark" />
      </div>

      {services.map((service, index) => (
        <article
          key={service.number}
          className="relative bg-coal"
          style={{ position: "sticky", top: `calc(78px + ${index * PEEK}px)`, zIndex: index + 1 }}
        >
          <div className="border-t border-white/15 bg-coal">
            <div className="container-x grid min-h-[300px] gap-8 py-10 md:grid-cols-[0.35fr_1fr_0.9fr_auto] md:items-center md:gap-12 md:py-14">
              <span className="font-body text-[clamp(72px,9vw,132px)] font-semibold leading-[0.8] text-orange">{service.number}</span>
              <h3 className="max-w-[560px] text-[clamp(25px,3vw,44px)] leading-[1.02] text-white">{service.title}</h3>
              <p className="max-w-[480px] font-body text-[14px] leading-[1.5] text-white/55 md:text-[15px]">{service.text}</p>
              <a href="#contact" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 font-body text-[20px] text-white transition-colors hover:border-orange hover:text-orange" aria-label={`Обсудить услугу ${service.title}`}>→</a>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
