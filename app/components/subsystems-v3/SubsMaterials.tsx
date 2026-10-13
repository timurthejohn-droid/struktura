"use client";
import { useState } from "react";
import SectionHead from "../SectionHead";
import { Lead, Reveal } from "./shared";
import MaterialFragment, { type MatParams } from "./three/MaterialFragment";
import Stage from "./three/Stage";

type Mat = {
  id: string;
  name: string;
  swatch: string;
  params: MatParams;
  /** относительные оценки 1–5 для наглядности */
  scores: { mass: number; supports: number; thermal: number };
  fixing: string;
  service: string;
};

const materials: Mat[] = [
  {
    id: "metal", name: "Металл", swatch: "linear-gradient(135deg,#e9ecef,#9ea4aa 55%,#d7dbde)",
    params: { color: "#f0f2f4", metalness: 0.4, roughness: 0.3, transmission: 0, clearcoat: 0, thick: 0.035, supports: 3, rail: 1, gap: 0.05 },
    scores: { mass: 2, supports: 2, thermal: 5 },
    fixing: "Навесные кассеты, регулируемые кронштейны", service: "Демонтаж отдельной кассеты",
  },
  {
    id: "glass", name: "Стекло", swatch: "linear-gradient(135deg,#e6f3f5,#9fc6cc 60%,#dff0f2)",
    params: { color: "#d8eef0", metalness: 0, roughness: 0.04, transmission: 0.92, clearcoat: 1, thick: 0.05, supports: 4, rail: 1.25, gap: 0.03 },
    scores: { mass: 4, supports: 4, thermal: 2 },
    fixing: "Точечные и линейные держатели с прокладками", service: "Безопасная замена элемента",
  },
  {
    id: "stone", name: "Камень", swatch: "linear-gradient(135deg,#ddd3c1,#b7a98f 60%,#d4c8b3)",
    params: { color: "#cbbda4", metalness: 0, roughness: 0.92, transmission: 0, clearcoat: 0, thick: 0.11, supports: 5, rail: 1.7, gap: 0.04 },
    scores: { mass: 5, supports: 5, thermal: 2 },
    fixing: "Анкеровка в кромку, пазы и вырезы", service: "Доступ к анкерам, ремонтопригодность",
  },
  {
    id: "cer", name: "Керамика", swatch: "linear-gradient(135deg,#e7a17f,#b85a35 60%,#d98058)",
    params: { color: "#c8693f", metalness: 0, roughness: 0.38, transmission: 0, clearcoat: 0.6, thick: 0.06, supports: 4, rail: 1.3, gap: 0.06 },
    scores: { mass: 3, supports: 3, thermal: 2 },
    fixing: "Скрытые кляммеры и подрезные анкеры", service: "Модульная замена одной панели",
  },
  {
    id: "comp", name: "Композиты", swatch: "linear-gradient(135deg,#ffffff,#d9d9d4 60%,#f3f3ef)",
    params: { color: "#f1f0eb", metalness: 0.05, roughness: 0.55, transmission: 0, clearcoat: 0.3, thick: 0.045, supports: 2, rail: 0.8, gap: 0.035 },
    scores: { mass: 1, supports: 1, thermal: 4 },
    fixing: "Закладные, клеевые и механические узлы", service: "Учёт пожарных требований",
  },
];

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-[130px_1fr] items-center gap-4 py-2.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/50">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="h-2 flex-1 transition-colors duration-500"
            style={{ background: i <= value ? "var(--orange)" : "rgba(26,26,26,0.08)", transitionDelay: `${i * 40}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function SubsMaterials() {
  const [active, setActive] = useState(0);
  const m = materials[active];

  return (
    <section id="materials" className="py-20 md:py-32">
      <div className="container-x">
        <SectionHead index="05" kicker="Материал — входной параметр системы" />
        <Lead>
          Свойства материала меняют подсистему: массу, шаг опор, тип крепления, температурную работу
          и обслуживание. Выберите материал — конструкция перестроится.
        </Lead>

        <Reveal className="grid overflow-hidden border border-black/10 bg-white lg:grid-cols-[1.35fr_0.65fr]">
          <div className="relative h-[420px] bg-gradient-to-b from-[#f7f6f2] to-[#ebe8e1] md:h-[560px]">
            <Stage className="absolute inset-0" camera={[5.4, 2.1, 7.6]} target={[0.9, -0.1, -0.5]} fov={34} parallax={0.6} dark={false}>
              <MaterialFragment params={m.params} />
            </Stage>
            <div className="pointer-events-none absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45">
              Фрагмент · облицовка на подсистеме
            </div>
            <div className="absolute inset-x-0 bottom-0 flex gap-px overflow-x-auto bg-black/10">
              {materials.map((x, i) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  className={`flex min-w-[120px] flex-1 items-center gap-3 px-4 py-4 text-left transition-colors ${
                    active === i ? "bg-ink text-white" : "bg-white/85 text-ink/70 backdrop-blur hover:bg-white"
                  }`}
                >
                  <span className="h-6 w-6 shrink-0 rounded-full border border-black/10" style={{ background: x.swatch }} />
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em]">{x.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col border-t border-black/10 p-6 md:p-8 lg:border-l lg:border-t-0">
            <span className="font-mono text-[11px] text-orange">{String(active + 1).padStart(2, "0")} / 05</span>
            <h3 key={m.id} className="env-slide mt-3 text-[clamp(28px,2.8vw,44px)] text-ink">{m.name}</h3>
            <div className="mt-6 border-y border-black/10 py-2">
              <Meter label="Масса" value={m.scores.mass} />
              <Meter label="Частота опор" value={m.scores.supports} />
              <Meter label="Темп. деформации" value={m.scores.thermal} />
            </div>
            <dl key={`d-${m.id}`} className="env-slide mt-2">
              <div className="border-b border-black/10 py-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45">Крепление</dt>
                <dd className="mt-1 font-body text-[15px] text-ink">{m.fixing}</dd>
              </div>
              <div className="border-b border-black/10 py-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45">Обслуживание</dt>
                <dd className="mt-1 font-body text-[15px] text-ink">{m.service}</dd>
              </div>
            </dl>
            <p className="mt-auto pt-6 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-ink/35">
              Шкалы — относительное сравнение групп материалов. Конкретные значения задаёт расчёт под объект.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
