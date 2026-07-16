import SectionHead from "../SectionHead";
import Reveal from "./Reveal";
import { LIMITS } from "./materialsData";

// [08] КАРТА ПРЕДЕЛОВ — уровень доказательства.
// Честная маркировка создаёт больше доверия, чем максимальные цифры без контекста.

export default function MaterialsLimits() {
  return (
    <section id="limits" className="py-24 md:py-36" style={{ background: "var(--coal-deep)" }}>
      <div className="container-x">
        <SectionHead index="08" kicker="Карта пределов" theme="dark" />

        <Reveal>
          <p className="font-body text-white/60 max-w-2xl mb-14" style={{ fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.6 }}>
            Мы&nbsp;показываем не&nbsp;только возможности, но&nbsp;и&nbsp;уровень доказательства.
            Честная маркировка создаёт больше доверия, чем набор максимальных цифр без контекста.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 1, background: "var(--line-dark)" }}>
            {LIMITS.map((l) => (
              <div key={l.n} className="relative p-7 min-h-[220px] flex flex-col" style={{ background: "var(--coal)" }}>
                <span className="absolute top-0 left-0 right-0" style={{ height: 3, background: l.color }} />
                <div
                  className="flex items-center justify-center rounded-full mb-6"
                  style={{ width: 42, height: 42, background: l.color, color: "#fff", fontFamily: "CoFo Sans Mono, monospace", fontSize: 13 }}
                >
                  {l.n}
                </div>
                <h3 className="font-mono uppercase" style={{ fontSize: 16, letterSpacing: "0.01em", lineHeight: 1.15, color: l.color }}>
                  {l.title}
                </h3>
                <p className="font-body text-white/55 mt-3" style={{ fontSize: 14, lineHeight: 1.5 }}>
                  {l.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Пример маркировки */}
          <div className="mt-10 p-6 md:p-8 grid md:grid-cols-[auto_1fr] gap-5 md:gap-10 md:items-center" style={{ background: "var(--coal)", border: "1px solid var(--line-dark)" }}>
            <span className="font-mono text-orange uppercase" style={{ fontSize: 12, letterSpacing: "0.1em" }}>
              Пример: крупноформатная 3D-печать
            </span>
            <div className="flex flex-wrap gap-x-8 gap-y-2 font-body text-white/70" style={{ fontSize: 14 }}>
              <span>Интерьерные панели — <span className="text-white">стандартно</span></span>
              <span>Фасад — <span className="text-white">после проверки UV и КЛТР</span></span>
              <span>Проектный размер — <span className="text-white">маркируем отдельно</span></span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
