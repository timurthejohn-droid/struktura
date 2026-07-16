"use client";
import { useReveal } from "./useReveal";
import SectionHead from "./SectionHead";

const roles = [
  { title: "BIM-инженеры", count: "18+" },
  { title: "Конструкторы", count: "14+" },
  { title: "Архитекторы", count: "12+" },
  { title: "Производство", count: "26+" },
];

export default function TeamTeaser() {
  const ref = useReveal();

  return (
    <section id="team" className="py-24 md:py-36" style={{ background: "var(--paper)", borderTop: "1px solid var(--line-light)" }}>
      <div className="container-x">
        <SectionHead index="09" kicker="Команда" theme="light" />
        <div ref={ref} className="reveal grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <h2 className="text-ink mb-6" style={{ fontSize: "clamp(30px, 3.8vw, 64px)", lineHeight: 1.02 }}>
              Команда <span className="text-orange">вне</span> рамок
            </h2>
            <p className="font-body text-ink-soft max-w-md mb-10" style={{ fontSize: "clamp(15px, 1.15vw, 18px)", lineHeight: 1.6 }}>
              Амбициозная технологичная команда, полная идей и&nbsp;решений.
              Конкретные лица — не&nbsp;обезличенные эксперты.
            </p>
            <div className="flex gap-3">
              <a href="#team" className="btn btn-dark">О команде →</a>
              <a href="#team" className="btn btn-ghost-light">Вакансии →</a>
            </div>
          </div>

          <div>
            <div className="font-mono text-ink leading-none mb-3" style={{ fontSize: "clamp(96px, 13vw, 180px)" }}>
              70<span className="text-orange">+</span>
            </div>
            <p className="font-body text-ink-soft text-sm mb-10">экспертов в команде</p>

            <div className="grid grid-cols-2" style={{ gap: 1, background: "var(--line-light)" }}>
              {roles.map((r) => (
                <div key={r.title} className="p-6" style={{ background: "var(--paper)" }}>
                  <div className="font-mono text-orange text-2xl mb-1">{r.count}</div>
                  <p className="font-body text-ink-soft text-xs">{r.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
