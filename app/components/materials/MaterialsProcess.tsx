import SectionHead from "../SectionHead";
import Reveal from "./Reveal";
import { PROCESS } from "./materialsData";

// [07] ИНЖЕНЕРНЫЙ ПРОЦЕСС — как компания расширяет возможности материала.
// Идея → проверяемое решение → производимая система.

export default function MaterialsProcess() {
  return (
    <section id="process" className="py-24 md:py-36" style={{ background: "var(--paper)" }}>
      <div className="container-x">
        <SectionHead index="07" kicker="Инженерный процесс" theme="light" />

        <Reveal>
          <p className="font-body text-ink-soft max-w-2xl mb-12" style={{ fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.6 }}>
            Процесс объясняет, почему нестандартная идея становится управляемой, проверяемой
            и&nbsp;производимой системой.
          </p>

          {/* фазовая полоса */}
          <div className="flex items-center gap-3 mb-10 font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.08em" }}>
            <span className="text-ink">Идея</span>
            <span className="text-ink/30">→</span>
            <span className="text-ink">Проверяемое решение</span>
            <span className="text-ink/30">→</span>
            <span className="text-orange">Производимая система</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 1, background: "var(--line-light)" }}>
            {PROCESS.map((s, i) => (
              <div key={s.n} className="p-6 min-h-[150px] flex flex-col" style={{ background: "var(--paper-card)" }}>
                <div className="flex items-center justify-center rounded-full mb-5" style={{ width: 40, height: 40, background: i === 0 ? "var(--orange)" : "var(--ink)", color: "#fff", fontFamily: "CoFo Sans Mono, monospace", fontSize: 13 }}>
                  {s.n}
                </div>
                <h3 className="font-mono text-ink uppercase" style={{ fontSize: 15, letterSpacing: "0.01em", lineHeight: 1.15 }}>
                  {s.name}
                </h3>
                <p className="font-body text-ink-soft mt-2" style={{ fontSize: 13.5, lineHeight: 1.45 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
