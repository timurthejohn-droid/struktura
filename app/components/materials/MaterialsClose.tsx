import Link from "next/link";
import Reveal from "./Reveal";

// [09] ИТОГОВАЯ ЛОГИКА + CTA.
// Материал — не герой. Герой — новая возможность.

const STEPS = ["Увидеть", "Удивиться", "Понять", "Довериться", "Проверить", "Отправить идею"];

export default function MaterialsClose() {
  return (
    <section className="py-24 md:py-36" style={{ background: "var(--orange)" }}>
      <div className="container-x">
        <Reveal>
          <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--ink)" }}>
            Итоговая логика
          </span>

          <h2 className="text-ink mt-6 max-w-4xl" style={{ fontSize: "clamp(30px, 5vw, 76px)", lineHeight: 0.98, letterSpacing: "-0.01em" }}>
            Материал — не&nbsp;герой.
            <br />
            Герой — новая возможность.
          </h2>

          {/* Путь пользователя */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-4 mt-14">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex items-center justify-center rounded-full font-mono"
                    style={{ width: 34, height: 34, fontSize: 12, background: i === STEPS.length - 1 ? "var(--ink)" : "transparent", color: i === STEPS.length - 1 ? "#fff" : "var(--ink)", border: "1px solid rgba(0,0,0,0.35)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono uppercase text-ink" style={{ fontSize: 12, letterSpacing: "0.04em" }}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && <span className="text-ink/40 hidden sm:inline">→</span>}
              </div>
            ))}
          </div>

          {/* CTA-панель */}
          <div className="mt-14 p-8 md:p-12 grid lg:grid-cols-[1fr_auto] gap-8 lg:items-center" style={{ background: "var(--ink)" }}>
            <div>
              <h3 className="font-mono text-white uppercase" style={{ fontSize: "clamp(20px, 2.6vw, 38px)", lineHeight: 1.05 }}>
                Проверить архитектурную идею на&nbsp;реализуемость
              </h3>
              <p className="font-mono text-white/45 uppercase mt-4" style={{ fontSize: 12, letterSpacing: "0.06em" }}>
                Эскиз → материал → технология → ограничения → прототип
              </p>
            </div>
            <Link href="/#contact" className="btn btn-orange justify-center whitespace-nowrap">
              Обсудить проект
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
