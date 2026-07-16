"use client";
import { useState } from "react";
import { useReveal } from "./useReveal";
import SectionHead from "./SectionHead";

const stages = [
  { n: "01", name: "Предпроект", desc: "Концепция, ТЗ, оценка реализуемости и предварительные решения.", tech: ["Rhino", "AutoCAD"] },
  { n: "02", name: "R&D", desc: "Инженерный поиск, параметрика, прототипирование узлов и форм.", tech: ["Grasshopper", "Kangaroo"] },
  { n: "03", name: "Проектирование", desc: "BIM-модель, КМД, рабочая документация, проверка коллизий.", tech: ["Revit", "Tekla"] },
  { n: "04", name: "Производство", desc: "ЧПУ-раскрой, гибка, сварка и контроль качества по модели.", tech: ["BIM2CAM", "ЧПУ"] },
  { n: "05", name: "Логистика", desc: "Маршрутизация, маркировка и комплектация под монтаж.", tech: ["Navisworks", "QR-маркировка"] },
  { n: "06", name: "Монтаж", desc: "Съёмка по модели и контроль геометрии на объекте.", tech: ["ReCap", "Лазерное сканирование"] },
];

const COLS = 36;
const ROWS = 7;
const PER = COLS / stages.length; // matrix columns per stage

export default function DigitalEnvFlow() {
  const ref = useReveal();
  const [active, setActive] = useState(0);
  const a = stages[active];

  return (
    <section id="digital" className="py-28 md:py-44" style={{ background: "var(--coal)" }}>
      <div className="container-x">
        <SectionHead index="05" kicker="Цифровая среда" theme="dark" />

        {/* intro */}
        <div ref={ref} className="reveal grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-24 items-end mb-14 md:mb-20">
          <h2 className="text-white" style={{ fontSize: "clamp(30px, 3.6vw, 60px)", lineHeight: 1.04 }}>
            STRUKTURA<span className="text-orange">+</span>
          </h2>
          <div>
            <p className="font-body text-white/65" style={{ fontSize: "clamp(15px, 1.2vw, 19px)", lineHeight: 1.6 }}>
              Единая цифровая среда связывает все этапы проекта в&nbsp;одну систему: данные
              передаются между этапами без&nbsp;потерь, а&nbsp;каждый процесс работает
              на&nbsp;общий результат.
            </p>
            <p className="font-mono text-white/40 text-[11px] tracking-[0.18em] uppercase mt-5">
              Наведите на&nbsp;этап — раскроется технологический стек
            </p>
          </div>
        </div>

        {/* environment board */}
        <div style={{ border: "1px solid var(--line-dark)", background: "var(--coal-deep)" }}>
          {/* matrix of cells (the "environment") */}
          <div
            className="p-4 md:p-6"
            style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 3 }}
          >
            {Array.from({ length: COLS * ROWS }).map((_, idx) => {
              const col = idx % COLS;
              const row = Math.floor(idx / COLS);
              const stage = Math.floor(col / PER);
              const on = stage === active;
              return (
                <span
                  key={idx}
                  onMouseEnter={() => setActive(stage)}
                  style={{
                    aspectRatio: "1 / 1",
                    border: `1px solid ${on ? "rgba(255,90,0,0.9)" : "rgba(255,90,0,0.13)"}`,
                    background: on ? "var(--orange)" : "transparent",
                    transition: "background 0.35s ease, border-color 0.35s ease",
                    transitionDelay: on ? `${(col % PER) * 34 + row * 26}ms` : "0ms",
                  }}
                />
              );
            })}
          </div>

          {/* stage labels aligned under the matrix */}
          <div className="grid grid-cols-3 md:grid-cols-6" style={{ borderTop: "1px solid var(--line-dark)" }}>
            {stages.map((s, i) => {
              const on = active === i;
              return (
                <button
                  key={s.n}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="text-left p-4 md:p-5 transition-colors"
                  style={{
                    borderLeft: i % 6 === 0 ? undefined : "1px solid var(--line-dark)",
                    background: on ? "rgba(255,90,0,0.07)" : "transparent",
                  }}
                >
                  <span className="font-mono text-orange text-xs">{s.n}</span>
                  <span className="block font-mono text-[12px] tracking-[0.02em] mt-1" style={{ color: on ? "#fff" : "rgba(255,255,255,0.5)" }}>
                    {s.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* slide-out tech stack for the active stage */}
          <div className="p-6 md:p-9" style={{ borderTop: "1px solid var(--line-dark)" }}>
            <div key={active} className="env-slide grid md:grid-cols-[auto_1fr_auto] gap-5 md:gap-10 md:items-center">
              <div className="font-mono text-orange" style={{ fontSize: "clamp(34px, 4.4vw, 60px)", lineHeight: 1 }}>
                {a.n}
              </div>
              <div>
                <h3 className="font-mono text-white text-lg mb-2 tracking-[0.02em]">{a.name}</h3>
                <p className="font-body text-white/55 max-w-xl" style={{ fontSize: 15, lineHeight: 1.55 }}>
                  {a.desc}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                {a.tech.map((tt) => (
                  <span key={tt} className="font-mono text-[10px] tracking-[0.08em] uppercase px-3 py-2 text-white/80 whitespace-nowrap" style={{ border: "1px solid rgba(255,90,0,0.45)" }}>
                    {tt}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
