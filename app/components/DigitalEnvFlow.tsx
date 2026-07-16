"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
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

// Пиксельный шрифт 5×7 для табло (нужны цифры 0–6)
const DIGITS: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11111", "00010", "00100", "00010", "00001", "10001", "01110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
};

// левые колонки двух цифр: по центру матрицы (12 колонок под «0X»)
const D1_START = 12;
const D2_START = 19;

function cellOn(col: number, row: number, num: string): boolean {
  const [d1, d2] = num.split("");
  if (col >= D1_START && col < D1_START + 5) return DIGITS[d1]?.[row][col - D1_START] === "1";
  if (col >= D2_START && col < D2_START + 5) return DIGITS[d2]?.[row][col - D2_START] === "1";
  return false;
}

export default function DigitalEnvFlow() {
  const ref = useReveal();
  const [hovered, setHovered] = useState<number | null>(null);
  const [opened, setOpened] = useState<number | null>(null);

  // на табло — наведённый этап, иначе открытый
  const shown = hovered ?? opened;
  const num = shown !== null ? stages[shown].n : null;
  const a = opened !== null ? stages[opened] : null;

  return (
    <section id="digital" className="py-28 md:py-44" style={{ background: "var(--paper)" }}>
      <div className="container-x">
        <SectionHead index="05" kicker="Цифровая среда" theme="light" />

        {/* intro */}
        <div ref={ref} className="reveal grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-24 items-end mb-14 md:mb-20">
          <h2 className="text-ink" style={{ fontSize: "clamp(30px, 3.6vw, 60px)", lineHeight: 1.04 }}>
            STRUKTURA<span className="text-orange">+</span>
          </h2>
          <div>
            <p className="font-body text-ink/70" style={{ fontSize: "clamp(15px, 1.2vw, 19px)", lineHeight: 1.6 }}>
              Единая цифровая среда связывает все этапы проекта в&nbsp;одну систему: данные
              передаются между этапами без&nbsp;потерь, а&nbsp;каждый процесс работает
              на&nbsp;общий результат.
            </p>
            <p className="font-mono text-ink/40 text-[11px] tracking-[0.18em] uppercase mt-5">
              Наведите на&nbsp;этап — табло покажет его номер. Нажмите — раскроется технологический стек
            </p>
          </div>
        </div>

        {/* environment board */}
        <div style={{ border: "1px solid var(--line-light)", background: "var(--paper-card)" }}>
          {/* табло: пиксельная матрица, цифры собираются с волной */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 3 }}>
            {Array.from({ length: COLS * ROWS }).map((_, idx) => {
              const col = idx % COLS;
              const row = Math.floor(idx / COLS);
              const on = num !== null && cellOn(col, row, num);
              return (
                <span
                  key={idx}
                  style={{
                    aspectRatio: "1 / 1",
                    border: `1px solid ${on ? "rgba(255,90,0,0.9)" : "rgba(255,90,0,0.2)"}`,
                    background: on ? "var(--orange)" : "transparent",
                    transition: "background 0.35s ease, border-color 0.35s ease",
                    transitionDelay: on ? `${(col - D1_START) * 28 + row * 22}ms` : "0ms",
                  }}
                />
              );
            })}
          </div>

          {/* stage labels aligned under the matrix */}
          <div className="grid grid-cols-3 md:grid-cols-6" style={{ borderTop: "1px solid var(--line-light)" }}>
            {stages.map((s, i) => {
              const on = opened === i || hovered === i;
              return (
                <button
                  key={s.n}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  onClick={() => setOpened((prev) => (prev === i ? null : i))}
                  aria-expanded={opened === i}
                  className="text-left p-4 md:p-5 transition-colors"
                  style={{
                    borderLeft: i % 6 === 0 ? undefined : "1px solid var(--line-light)",
                    background: on ? "var(--paper)" : "transparent",
                  }}
                >
                  <span className="font-mono text-orange text-xs">{s.n}</span>
                  <span
                    className="block font-mono text-[12px] tracking-[0.02em] mt-1"
                    style={{ color: on ? "var(--ink)" : "rgba(26,26,26,0.5)" }}
                  >
                    {s.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* выдвижная панель: технологический стек открытого этапа + CTA */}
          <AnimatePresence initial={false}>
            {a && (
              <motion.div
                key="panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: "hidden", borderTop: "1px solid var(--line-light)" }}
              >
                <div className="p-6 md:p-9">
                  <div key={a.n} className="env-slide grid md:grid-cols-[auto_1fr_auto] gap-5 md:gap-10 md:items-center">
                    <div className="font-mono text-orange" style={{ fontSize: "clamp(34px, 4.4vw, 60px)", lineHeight: 1 }}>
                      {a.n}
                    </div>
                    <div>
                      <h3 className="font-mono text-ink text-lg mb-2 tracking-[0.02em]">{a.name}</h3>
                      <p className="font-body text-ink/60 max-w-xl" style={{ fontSize: 15, lineHeight: 1.55 }}>
                        {a.desc}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      {a.tech.map((tt) => (
                        <span
                          key={tt}
                          className="font-mono text-[10px] tracking-[0.08em] uppercase px-3 py-2 text-ink/80 whitespace-nowrap"
                          style={{ border: "1px solid rgba(255,90,0,0.5)" }}
                        >
                          {tt}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8">
                    <Link href="/digital" className="btn btn-orange">
                      Подробнее о цифровой среде STRUKTURA+
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
