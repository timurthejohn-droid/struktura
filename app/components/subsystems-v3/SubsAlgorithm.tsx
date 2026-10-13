"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import SectionHead from "../SectionHead";
import { Lead, Reveal } from "./shared";

type Scenario = "base" | "material" | "acoustic";

const factors: { name: string; input: string; output: string; scenario?: Scenario }[] = [
  { name: "Геометрия", input: "Кривизна, разбивка, сопряжения поверхностей.", output: "Положение и геометрия элементов, узлы и связь с облицовкой." },
  { name: "Материал", input: "Масса, жёсткость, свойства и ограничения изготовления.", output: "Тип крепления, опоры, температурные перемещения и обработка.", scenario: "material" },
  { name: "Нагрузки", input: "Вес элементов и предусмотренные воздействия.", output: "Сечения, шаг опор, соединения и расчётная схема." },
  { name: "Основание", input: "Фактическая геометрия и положение опорных поверхностей.", output: "Привязки, вылеты, допуски и диапазоны регулировок.", scenario: "base" },
  { name: "Акустика", input: "Требования к облицовке, перфорации и акустическим слоям.", output: "Размещение опор и усилений, креплений и встроенных элементов.", scenario: "acoustic" },
  { name: "Точность", input: "Допуски деталей, основания и требования к швам.", output: "Накопление отклонений, сопряжения, метки и контроль положения." },
  { name: "Монтаж", input: "Доступ, подъём, последовательность и фронты работ.", output: "Разбиение на элементы, крепёж, сборка, регулировки и комплектность." },
  { name: "Нормативы", input: "Требования, применимые к конструкции и условиям её работы.", output: "Расчётные критерии, характеристики материалов и соединений, проверки." },
];

const examples: Record<Scenario, { a: string; b: string; result: string }> = {
  base: { a: "Ровное основание", b: "Основание с перепадом", result: "Меняются привязки, длины опор и диапазоны регулировок" },
  material: { a: "Лёгкий композит", b: "Тяжёлый камень", result: "Уточняются шаг опор, сечения и крепления" },
  acoustic: { a: "Глухая облицовка", b: "Перфорация + акустический слой", result: "Увязываются облицовка, усиления и крепления" },
};

const X0 = 40;
const X1 = 480;
const MAX = 11;
const surf = (x: number) => 96 - Math.sin(((x - X0) / (X1 - X0)) * Math.PI) * 52;
const ease = { duration: 0.8, ease: [0.23, 1, 0.32, 1] as const };

function ModelScheme({ scenario, b }: { scenario: Scenario | null; b: boolean }) {
  const stepped = scenario === "base" && b;
  const heavy = scenario === "material" && b;
  const acoustic = scenario === "acoustic" && b;
  const count = heavy ? 11 : acoustic ? 9 : 7;
  const baseY = (x: number) => (stepped && x > 260 ? 228 : 290);
  const xs = Array.from({ length: MAX }, (_, i) => X0 + 20 + (Math.min(i, count - 1) * (X1 - X0 - 40)) / (count - 1));

  return (
    <svg viewBox="0 0 520 340" className="h-auto w-full" role="img" aria-label="Схема подсистемы, меняющаяся от исходных условий">
      {/* Основание */}
      <motion.path
        initial={false}
        animate={{ d: stepped ? "M20 290H260V228H500" : "M20 290H260V290H500" }}
        transition={ease}
        stroke="#8d8a83"
        strokeWidth="6"
        fill="none"
      />
      {/* Опоры */}
      {xs.map((x, i) => {
        const on = i < count;
        const top = surf(x) + 16;
        return (
          <motion.line
            key={i}
            initial={false}
            animate={{ x1: x, x2: x, y1: top, y2: baseY(x), opacity: on ? 1 : 0, strokeWidth: heavy ? 5 : 2.5 }}
            transition={ease}
            stroke="#e9e7e1"
          />
        );
      })}
      {/* Узлы и диапазоны регулировки */}
      {xs.map((x, i) => {
        const on = i < count;
        const top = surf(x) + 16;
        const range = scenario === "base" ? (stepped && x > 260 ? 10 : 22) : 14;
        return (
          <motion.g key={i} initial={false} animate={{ opacity: on ? 1 : 0, x: 0 }} transition={ease}>
            <motion.rect initial={false} animate={{ x: x - 7, y: top - 4 }} transition={ease} width="14" height="10" fill="#ff5a00" />
            <motion.path
              initial={false}
              animate={{ d: `M${x + 13} ${top - range / 2}v${range}`, opacity: scenario === "base" ? 1 : 0.35 }}
              transition={ease}
              stroke="#ff5a00"
              strokeWidth="1.3"
            />
          </motion.g>
        );
      })}
      {/* Усиления под акустику */}
      {xs.slice(0, count - 1).map((x, i) => (
        <motion.path
          key={`r${i}`}
          initial={false}
          animate={{ opacity: acoustic ? 1 : 0 }}
          transition={ease}
          d={`M${x} ${surf(x) + 40} L${xs[i + 1]} ${surf(xs[i + 1]) + 16}`}
          stroke="#ff5a00"
          strokeWidth="1.2"
          strokeDasharray="3 3"
        />
      ))}
      {/* Акустический слой */}
      <motion.path
        initial={false}
        animate={{ opacity: acoustic ? 1 : 0 }}
        transition={ease}
        d={Array.from({ length: 45 }, (_, i) => {
          const x = X0 + i * 10;
          return `${i ? "L" : "M"}${x} ${surf(x) + 8 + (i % 2 ? 2 : -2)}`;
        }).join(" ")}
        stroke="#8fb3a4"
        strokeWidth="2"
        fill="none"
      />
      {/* Облицовка */}
      <path
        d={Array.from({ length: 45 }, (_, i) => {
          const x = X0 + i * 10;
          return `${i ? "L" : "M"}${x} ${surf(x)}`;
        }).join(" ")}
        stroke={heavy ? "#b9b3a6" : "#ffffff"}
        strokeWidth={heavy ? 9 : 5}
        fill="none"
        style={{ transition: "stroke .6s, stroke-width .6s" }}
      />
      {Array.from({ length: 21 }, (_, i) => {
        const x = X0 + 10 + i * 21;
        return (
          <motion.circle key={i} initial={false} animate={{ opacity: acoustic ? 1 : 0 }} transition={ease} cx={x} cy={surf(x)} r="1.4" fill="#181818" />
        );
      })}
    </svg>
  );
}

export default function SubsAlgorithm() {
  const [active, setActive] = useState(3);
  const [b, setB] = useState(false);
  const f = factors[active];
  const scenario = f.scenario ?? null;

  // Пример переключается сам: условие A ↔ B — видно, как меняется модель.
  useEffect(() => {
    setB(false);
    if (!scenario) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setB((v) => !v), 2800);
    return () => clearInterval(id);
  }, [scenario]);

  return (
    <section id="algorithm" className="relative overflow-hidden bg-coal-deep py-20 text-white md:py-32">
      <div className="container-x">
        <SectionHead index="04" kicker="Что учитывает алгоритм" theme="dark" />
        <Lead dark>
          В подсистему заложено множество взаимосвязанных условий. Алгоритмы связывают инженерные
          решения между собой — а не только рисуют сложную форму.
        </Lead>

        <Reveal className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Факторы */}
          <ol className="border-t border-white/12">
            {factors.map((x, i) => {
              const on = active === i;
              return (
                <li key={x.name} className={`idx-row border-b border-white/12 ${on ? "on" : ""}`}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-expanded={on}
                    className="flex w-full items-center gap-5 py-4 text-left"
                  >
                    <span className={`font-mono text-[12px] tabular-nums ${on ? "text-orange" : "text-white/35"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={`flex-1 font-mono text-[clamp(15px,1.3vw,19px)] uppercase transition-colors ${on ? "text-white" : "text-white/60 hover:text-white"}`}>
                      {x.name}
                    </span>
                    {x.scenario && (
                      <span className={`font-mono text-[9px] uppercase tracking-[0.14em] ${on ? "text-orange" : "text-white/35"}`}>Пример ●</span>
                    )}
                  </button>
                  <div className="idx-body">
                    <div>
                      <div className="grid gap-4 pb-5 pl-[42px] sm:grid-cols-2">
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">На входе</span>
                          <p className="mt-1 font-body text-[14px] leading-snug text-white/75">{x.input}</p>
                        </div>
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-orange">Что увязываем</span>
                          <p className="mt-1 font-body text-[14px] leading-snug text-white/75">{x.output}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Модель */}
          <div className="relative self-start border border-white/12 lg:sticky lg:top-24">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            {/* уголки вьюпорта */}
            {["left-2 top-2 border-l border-t", "right-2 top-2 border-r border-t", "left-2 bottom-2 border-l border-b", "right-2 bottom-2 border-r border-b"].map((c) => (
              <span key={c} aria-hidden className={`absolute h-3 w-3 border-orange ${c}`} />
            ))}
            <div className="relative p-5 md:p-8">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">Единая цифровая модель · {f.name}</span>
                {scenario && (
                  <div className="flex border border-white/15">
                    {(["a", "b"] as const).map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setB(k === "b")}
                        aria-pressed={b === (k === "b")}
                        className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
                          b === (k === "b") ? "bg-white text-ink" : "text-white/55 hover:text-white"
                        }`}
                      >
                        {examples[scenario][k]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <ModelScheme scenario={scenario} b={b} />
              <div className="mt-4 flex min-h-[44px] items-center gap-4 border-t border-white/12 pt-4">
                <span className={`h-2 w-2 shrink-0 ${scenario ? "bg-orange sv3-blink" : "bg-white/25"}`} />
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/80">
                  {scenario ? examples[scenario].result : "Выберите «Материал», «Основание» или «Акустика» — модель перестроится"}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
