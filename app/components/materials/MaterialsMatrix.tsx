import SectionHead from "../SectionHead";
import Reveal from "./Reveal";
import { MATRIX } from "./materialsData";

// [06] МАТРИЦА «я хочу…» — задача → материалы → технологии → проверить.

const COLS = [
  { key: "task", label: "Задача", accent: "var(--orange)" },
  { key: "materials", label: "Материалы", accent: "#0f9d94" },
  { key: "tech", label: "Технологии", accent: "rgba(255,255,255,0.5)" },
  { key: "check", label: "Проверить", accent: "rgba(255,255,255,0.5)" },
] as const;

export default function MaterialsMatrix() {
  return (
    <section id="matrix" className="py-24 md:py-36" style={{ background: "var(--coal)" }}>
      <div className="container-x">
        <SectionHead index="06" kicker="Матрица «я хочу…»" theme="dark" />

        <Reveal>
          <p className="font-body text-white/60 max-w-2xl mb-12" style={{ fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.6 }}>
            Выберите архитектурный эффект&nbsp;— и&nbsp;увидите подходящие материалы, технологии
            и&nbsp;то, что важно проверить заранее.
          </p>

          <div style={{ border: "1px solid var(--line-dark)" }}>
            {/* header — desktop */}
            <div className="hidden lg:grid" style={{ gridTemplateColumns: "1.1fr 1.3fr 1.3fr 1.3fr" }}>
              {COLS.map((c, i) => (
                <div
                  key={c.key}
                  className="p-4"
                  style={{ borderLeft: i ? "1px solid var(--line-dark)" : undefined, borderBottom: "1px solid var(--line-dark)" }}
                >
                  <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.1em", color: c.accent }}>
                    {c.label}
                  </span>
                </div>
              ))}
            </div>

            {/* rows */}
            {MATRIX.map((row, ri) => (
              <div
                key={row.task}
                className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr_1.3fr_1.3fr]"
                style={{ borderTop: ri ? "1px solid var(--line-dark)" : undefined }}
              >
                {COLS.map((c, ci) => (
                  <div
                    key={c.key}
                    className="p-4 lg:p-5"
                    style={{ borderLeft: ci ? "1px solid var(--line-dark)" : undefined }}
                  >
                    <span className="lg:hidden block font-mono uppercase mb-1" style={{ fontSize: 9.5, letterSpacing: "0.1em", color: c.accent }}>
                      {c.label}
                    </span>
                    <span
                      className={ci === 0 ? "font-mono uppercase text-white" : "font-body text-white/60"}
                      style={ci === 0 ? { fontSize: 14, letterSpacing: "0.01em" } : { fontSize: 14, lineHeight: 1.45 }}
                    >
                      {row[c.key]}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <p className="font-mono text-white/40 uppercase mt-6" style={{ fontSize: 11, letterSpacing: "0.08em" }}>
            Результат: материал + эффект + технология + проект-доказательство + ограничение
          </p>
        </Reveal>
      </div>
    </section>
  );
}
