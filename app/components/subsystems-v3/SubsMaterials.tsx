"use client";
import { useState, type MouseEvent } from "react";
import SectionHead from "../SectionHead";
import { Lead, Reveal } from "./shared";
import MaterialObject, { type MaterialShape } from "./three/MaterialObjects";

const materials: { shape: MaterialShape; name: string; points: string[] }[] = [
  { shape: "metal", name: "Металл", points: ["Сплав и толщина", "Масса и формат", "Крепление", "Тепловое расширение"] },
  { shape: "glass", name: "Стекло", points: ["Тип и толщина", "Масса", "Локальные напряжения", "Безопасность"] },
  { shape: "stone", name: "Камень", points: ["Плотность", "Анкеровка", "Кромки и вырезы", "Ремонтопригодность"] },
  { shape: "ceramic", name: "Керамика", points: ["Формат", "Допуски", "Температурная работа", "Замена панели"] },
  { shape: "composite", name: "Композиты", points: ["Жёсткость", "Радиусы", "Крепление", "Пожарные требования"] },
];

const track = (e: MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export default function SubsMaterials() {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section id="materials" className="py-20 md:py-32">
      <div className="container-x">
        <SectionHead index="05" kicker="Материал — входной параметр системы" />
        <Lead>Здесь показываем не каталог материалов, а то, как свойства материала меняют подсистему.</Lead>

        <Reveal stagger className="grid gap-px border border-black/10 bg-black/10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {materials.map((m, i) => (
            <article
              key={m.shape}
              onMouseMove={track}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="sv3-card group flex flex-col bg-paper p-6 transition-colors hover:bg-white md:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] text-orange">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/35">Материал</span>
              </div>

              <MaterialObject shape={m.shape} hover={hover === i} className="-mx-2 my-4 aspect-square" />

              <h3 className="text-[clamp(20px,1.6vw,24px)] text-ink">{m.name}</h3>
              <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40">Влияет на подсистему</span>
              <ul className="mt-4 border-t border-black/10">
                {m.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 border-b border-black/10 py-2.5 font-body text-[14px] text-ink/70">
                    <span className="h-1.5 w-1.5 shrink-0 bg-orange transition-transform duration-500 group-hover:rotate-45" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
