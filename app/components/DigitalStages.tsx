import SectionHead from "./SectionHead";
import Reveal from "./materials/Reveal";

export type DigitalStage = {
  slug: string;
  n: string;
  title: string;
  process: string;
  problems: string[];
  solution: string[];
};

const PEEK = 56;

export default function DigitalStages({ stages }: { stages: DigitalStage[] }) {
  return (
    <section className="relative bg-coal-deep pb-16 pt-24 md:pb-24 md:pt-36">
      <div className="container-x">
        <Reveal>
          <SectionHead index="03" kicker="Этапы подробно" theme="dark" />
        </Reveal>
      </div>

      {/* Стек карточек: каждый этап «наезжает» на предыдущий по мере скролла — */}
      {/* тот же приём, что и у формата работы на /services (ServicesStack). */}
      {stages.map((stage, index) => (
        <article
          key={stage.slug}
          id={stage.slug}
          className="relative bg-coal-deep"
          style={{ position: "sticky", top: `calc(72px + ${index * PEEK}px)`, zIndex: index + 1 }}
        >
          <div className="relative border-t border-white/15 bg-coal-deep">
            <div className="container-x relative py-10 md:py-14">
              <div className="grid gap-6 md:grid-cols-[64px_1fr_1.4fr] md:gap-10">
                <span className="font-mono text-[13px] tracking-[0.16em] text-orange">{stage.n}</span>
                <h3
                  className="font-mono uppercase text-white"
                  style={{ fontSize: "clamp(24px, 2.6vw, 40px)", lineHeight: 1.05 }}
                >
                  {stage.title}
                </h3>
                <p className="font-body text-white/65 md:pt-1" style={{ fontSize: 16, lineHeight: 1.55 }}>
                  {stage.process}
                </p>
              </div>

              <div className="mt-10 grid gap-8 md:mt-12 md:grid-cols-[64px_1fr_1.4fr] md:gap-10">
                <div className="hidden md:block" />
                <div>
                  <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.12em] text-white/45">
                    Возможные проблемы
                  </p>
                  <ul className="space-y-2.5">
                    {stage.problems.map((item) => (
                      <li
                        key={item}
                        className="relative pl-4 font-body text-white/60 before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:bg-white/35"
                        style={{ fontSize: 14.5, lineHeight: 1.45 }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.12em] text-orange/80">
                    Решение STRUKTURA
                  </p>
                  <ul className="space-y-2.5">
                    {stage.solution.map((item) => (
                      <li
                        key={item}
                        className="relative pl-4 font-body text-white/80 before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:bg-orange"
                        style={{ fontSize: 14.5, lineHeight: 1.45 }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
