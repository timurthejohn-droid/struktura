import Reveal from "../materials/Reveal";

const facts = [
  { label: "Клиент", value: "Сбербанк-Сити" },
  { label: "Архитектор", value: "Evolution Design" },
  { label: "Партнёр по производству", value: "Макрофабрика" },
  { label: "Год реализации", value: "2022" },
];

export default function MezhFacts() {
  return (
    <section className="bg-paper py-16 md:py-24">
      <div className="container-x">
        <Reveal>
          <p className="max-w-[820px] font-body text-[clamp(20px,2.2vw,30px)] leading-[1.4] text-ink">
            Проект архитектурного бюро «Evolution Design» — купол, объединяющий две башни Сбербанк-Сити
            в единый образ. <span className="text-ink/50">Это первая конструкция такого масштаба.</span>
          </p>
        </Reveal>

        <div className="mt-14 grid border-l border-t border-black/10 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="border-b border-r border-black/10 p-6 md:p-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">{fact.label}</span>
              <p className="mt-4 font-body text-[19px] text-ink md:text-[21px]">{fact.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
