import SectionHead from "../SectionHead";
import Reveal from "./Reveal";

// [02] МАНИФЕСТ — не каталог материалов, а карта возможностей.
// Сравнение: типичный каталог vs модель СК «Структура».

const CATALOG = [
  { t: "Материал", d: "как товарная позиция" },
  { t: "Стандартные свойства", d: "размеры, плотность, цвет" },
  { t: "Отделки", d: "варианты поверхности" },
  { t: "Финал", d: "запросить образец" },
];

const MODEL = [
  { t: "Архитектурная задача", d: "что требуется создать" },
  { t: "Возможность материала", d: "форма, масштаб, движение, свет" },
  { t: "Инженерное решение", d: "расчёт, узел, прототип, технология" },
  { t: "Предельный результат", d: "проект как доказательство" },
];

function Track({
  items,
  accent,
  muted,
}: {
  items: { t: string; d: string }[];
  accent: string;
  muted: boolean;
}) {
  return (
    <ol className="flex flex-col">
      {items.map((it, i) => (
        <li key={it.t} className="flex items-start gap-4 py-4" style={{ borderTop: i ? "1px solid var(--line-dark)" : undefined }}>
          <span
            className="mt-1 shrink-0 rounded-full"
            style={{
              width: 11,
              height: 11,
              background: i === items.length - 1 ? accent : muted ? "rgba(255,255,255,0.25)" : "#fff",
            }}
          />
          <div>
            <div className="font-mono uppercase" style={{ fontSize: 15, letterSpacing: "0.02em", color: muted ? "rgba(255,255,255,0.5)" : "#fff" }}>
              {it.t}
            </div>
            <div className="font-body mt-0.5" style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>
              {it.d}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function MaterialsManifest() {
  return (
    <section id="manifest" className="py-24 md:py-36" style={{ background: "var(--coal-deep)" }}>
      <div className="container-x">
        <SectionHead index="02" kicker="Не каталог. Карта возможностей." theme="dark" />

        <Reveal>
          <p className="font-body text-white/60 max-w-3xl mb-14" style={{ fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.6 }}>
            Главный герой раздела — не&nbsp;сам материал, а&nbsp;архитектурный результат, который
            компания умеет из&nbsp;него получить. Мы&nbsp;переворачиваем логику каталога.
          </p>

          <div className="grid lg:grid-cols-2" style={{ gap: 1, background: "var(--line-dark)" }}>
            {/* Типичный каталог */}
            <div className="p-8 md:p-11" style={{ background: "var(--coal)" }}>
              <span
                className="inline-block font-mono uppercase mb-8 px-3 py-1.5"
                style={{ fontSize: 10, letterSpacing: "0.14em", color: "rgba(255,255,255,0.6)", border: "1px solid var(--line-dark)" }}
              >
                Типичный каталог
              </span>
              <Track items={CATALOG} accent="rgba(255,255,255,0.6)" muted />
            </div>

            {/* Модель СК «Структура» */}
            <div className="p-8 md:p-11" style={{ background: "var(--coal)" }}>
              <span
                className="inline-block font-mono uppercase mb-8 px-3 py-1.5"
                style={{ fontSize: 10, letterSpacing: "0.14em", color: "#fff", background: "var(--orange)" }}
              >
                Модель СК «Структура»
              </span>
              <Track items={MODEL} accent="#0f9d94" muted={false} />
              <p className="font-mono text-orange uppercase mt-9" style={{ fontSize: 12, letterSpacing: "0.06em", lineHeight: 1.7 }}>
                Материал × геометрия × технология × конструкция
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
