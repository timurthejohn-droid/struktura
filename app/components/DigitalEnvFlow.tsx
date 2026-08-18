"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useReveal } from "./useReveal";

const stages = [
  { n: "01", name: "Предпроект", desc: "Концепция, ТЗ, оценка реализуемости и предварительные решения.", tech: ["Rhino", "AutoCAD"] },
  { n: "02", name: "R&D", desc: "Инженерный поиск, параметрика, прототипирование узлов и форм.", tech: ["Grasshopper", "Kangaroo"] },
  { n: "03", name: "Проектирование", desc: "BIM-модель, КМД, рабочая документация, проверка коллизий.", tech: ["Revit", "Tekla"] },
  { n: "04", name: "Производство", desc: "ЧПУ-раскрой, гибка, сварка и контроль качества по модели.", tech: ["BIM2CAM", "ЧПУ"] },
  { n: "05", name: "Логистика", desc: "Маршрутизация, маркировка и комплектация под монтаж.", tech: ["Navisworks", "QR-маркировка"] },
  { n: "06", name: "Монтаж", desc: "Съёмка по модели и контроль геометрии на объекте.", tech: ["ReCap", "Лазерное сканирование"] },
];

const DIGIT_COLS = 5;
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

function cellOn(col: number, row: number, num: string): boolean {
  return DIGITS[num]?.[row][col] === "1";
}

export default function DigitalEnvFlow() {
  const ref = useReveal();
  const [hovered, setHovered] = useState<number | null>(null);

  const a = hovered !== null ? stages[hovered] : null;

  return (
    <section id="digital" className="py-28 md:py-44" style={{ background: "var(--coal)" }}>
      <div className="container-x">
        <div className="mb-10 md:mb-14">
          <div className="flex items-center justify-between gap-4 pb-3">
            <span
              className="font-mono font-medium text-orange"
              style={{ fontSize: 13, letterSpacing: "0.04em" }}
            >
              05
            </span>
            <span
              className="hidden sm:inline font-mono select-none text-white/20"
              style={{ fontSize: 12, letterSpacing: "0.32em" }}
              aria-hidden
            >
              STRUKTURA
              <span style={{ fontSize: 9, verticalAlign: "super", letterSpacing: 0 }}>+</span>
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
            <h2
              className="font-mono uppercase text-white"
              style={{
                fontSize: "clamp(30px, 4.6vw, 72px)",
                lineHeight: 0.98,
                letterSpacing: "-0.01em",
              }}
            >
              Цифровая среда
            </h2>
            <Link href="/digital" className="btn btn-orange md:mt-2">
              Подробнее о цифровой среде
            </Link>
          </div>
        </div>

        {/* intro */}
        <div ref={ref} className="reveal mb-14 md:mb-20">
          <p className="font-body max-w-2xl text-white/70" style={{ fontSize: "clamp(15px, 1.2vw, 19px)", lineHeight: 1.6 }}>
            Единая цифровая среда связывает все этапы проекта в&nbsp;одну систему: данные
            передаются между этапами без&nbsp;потерь, а&nbsp;каждый процесс работает
            на&nbsp;общий результат.
          </p>
        </div>

        {/* environment board */}
        <div style={{ border: "1px solid var(--line-dark)", background: "var(--coal)" }}>
          {/* stage cells: each digit appears directly above the hovered stage */}
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
            style={{ gap: 1, background: "var(--line-dark)" }}
          >
            {stages.map((s, i) => {
              const on = hovered === i;
              const digit = String(i + 1);
              return (
                <div
                  key={s.n}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background: on ? "#211d1a" : "var(--coal)",
                  }}
                >
                  <div
                    className="flex h-[260px] items-center justify-center p-4 md:h-[230px] md:p-5 xl:h-[280px]"
                    style={{
                      borderBottom: "1px solid var(--line-dark)",
                    }}
                    aria-hidden="true"
                  >
                    <div
                      className="grid w-full max-w-[360px]"
                      style={{
                        gridTemplateColumns: `repeat(${DIGIT_COLS}, minmax(0, 1fr))`,
                        gap: 6,
                      }}
                    >
                      {Array.from({ length: DIGIT_COLS * ROWS }).map((_, idx) => {
                        const col = idx % DIGIT_COLS;
                        const row = Math.floor(idx / DIGIT_COLS);
                        const lit = hovered === i && cellOn(col, row, digit);
                        return (
                          <span
                            key={idx}
                            style={{
                              aspectRatio: "1 / 1",
                              border: `1px solid ${lit ? "rgba(255,90,0,0.9)" : "rgba(255,90,0,0.2)"}`,
                              background: lit ? "var(--orange)" : "transparent",
                              transition: "background 0.35s ease, border-color 0.35s ease",
                              transitionDelay: lit ? `${col * 28 + row * 22}ms` : "0ms",
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    className="w-full text-left p-4 md:p-5 transition-colors"
                  >
                    <span className="font-mono text-orange text-xs">{s.n}</span>
                    <span
                      className="block font-mono text-[12px] tracking-[0.02em] mt-1"
                      style={{ color: on ? "#fff" : "rgba(255,255,255,0.55)" }}
                    >
                      {s.name}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* выдвижная панель: технологический стек наведённого этапа */}
          <AnimatePresence initial={false}>
            {a && (
              <motion.div
                key="panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: "hidden", borderTop: "1px solid var(--line-dark)" }}
              >
                <div className="p-6 md:p-9">
                  <div key={a.n} className="env-slide grid md:grid-cols-[auto_1fr_auto] gap-5 md:gap-10 md:items-center">
                    <div className="font-mono text-orange" style={{ fontSize: "clamp(34px, 4.4vw, 60px)", lineHeight: 1 }}>
                      {a.n}
                    </div>
                    <div>
                      <h3 className="font-mono text-white text-lg mb-2 tracking-[0.02em]">{a.name}</h3>
                      <p className="font-body text-white/60 max-w-xl" style={{ fontSize: 15, lineHeight: 1.55 }}>
                        {a.desc}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      {a.tech.map((tt) => (
                        <span
                          key={tt}
                          className="font-mono text-[10px] tracking-[0.08em] uppercase px-3 py-2 text-white/80 whitespace-nowrap"
                          style={{ border: "1px solid rgba(255,90,0,0.5)" }}
                        >
                          {tt}
                        </span>
                      ))}
                    </div>
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
