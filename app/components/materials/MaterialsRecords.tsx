import SectionHead from "../SectionHead";
import Reveal from "./Reveal";
import { RECORDS, PROOF, ProofKind } from "./materialsData";

// [04] МАТЕРИАЛЫ НА ПРЕДЕЛЕ — проекты-доказательства.
// Карточка: вызов → действие над материалом → измеримый результат → проект.

export default function MaterialsRecords() {
  const kinds: ProofKind[] = ["done", "tested", "check"];
  return (
    <section id="records" className="py-24 md:py-36" style={{ background: "var(--coal)" }}>
      <div className="container-x">
        <SectionHead index="04" kicker="Материалы на пределе" theme="dark" />

        <Reveal>
          <p className="font-body text-white/60 max-w-2xl mb-14" style={{ fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.6 }}>
            Не&nbsp;рендеры и&nbsp;не&nbsp;каталог&nbsp;— измеримый результат на&nbsp;реальных объектах.
            Предел технологии, который мы&nbsp;уже прошли.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 1, background: "var(--line-dark)" }}>
            {RECORDS.map((r) => {
              const p = PROOF[r.proof];
              return (
                <div key={r.title} className="relative flex flex-col p-7 md:p-8 min-h-[300px]" style={{ background: "var(--coal)" }}>
                  <span className="absolute top-0 left-0 right-0" style={{ height: 3, background: p.color }} />
                  <div
                    className="font-mono text-white"
                    style={{ fontSize: "clamp(32px, 3.6vw, 52px)", lineHeight: 0.95, letterSpacing: "-0.01em" }}
                  >
                    {r.metric}
                  </div>
                  <h3 className="font-mono text-white uppercase mt-5" style={{ fontSize: 16, letterSpacing: "0.01em", lineHeight: 1.2 }}>
                    {r.title}
                  </h3>
                  <p className="font-body text-white/55 mt-3" style={{ fontSize: 14.5, lineHeight: 1.55 }}>
                    {r.detail}
                  </p>
                  <div className="mt-auto pt-6 flex items-center justify-between gap-3" style={{ borderTop: "1px solid var(--line-dark)", marginTop: 24 }}>
                    <span className="font-mono text-white/70" style={{ fontSize: 12 }}>
                      {r.project}
                    </span>
                    <span className="shrink-0 rounded-full" style={{ width: 9, height: 9, background: p.color }} aria-label={p.label} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Легенда маркировки */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 mt-8">
            {kinds.map((k) => (
              <span key={k} className="flex items-center gap-2.5 font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.08em", color: "rgba(255,255,255,0.55)" }}>
                <span className="rounded-full" style={{ width: 9, height: 9, background: PROOF[k].color }} />
                {PROOF[k].label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
