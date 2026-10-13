"use client";
import type { MouseEvent, ReactNode } from "react";
import SectionHead from "../SectionHead";
import { IlluAdapt, IlluJoint, IlluProduction, IlluStress } from "./illustrations";
import { Lead, Reveal } from "./shared";

const cards: { title: string; claim: string; visual: ReactNode; link: string }[] = [
  { title: "Адаптивность", claim: "Система разрабатывается под задачу объекта", visual: <IlluAdapt />, link: "#algorithm" },
  { title: "Производство", claim: "Индивидуальная геометрия выпускается по промышленным принципам", visual: <IlluProduction />, link: "#bim-cam" },
  { title: "Сборка", claim: "Способ сборки заложен при разработке", visual: <IlluJoint />, link: "#bim-cam" },
  { title: "Надёжность", claim: "Решения проходят инженерную проверку", visual: <IlluStress />, link: "#verification" },
];

const track = (e: MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export default function SubsPrinciples() {
  return (
    <section id="principles" className="py-20 md:py-32">
      <div className="container-x">
        <SectionHead index="03" kicker="Четыре принципа подсистемы" />
        <Lead>Коротко о главном. Каждый принцип подробно раскрыт ниже.</Lead>
        <Reveal stagger className="grid gap-px border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <a key={c.title} href={c.link} onMouseMove={track} className="sv3-card group flex flex-col bg-paper p-6 hover:bg-white md:p-7">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] text-orange">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-mono text-[14px] text-ink/30 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-orange">→</span>
              </div>
              <div className="my-8 aspect-[210/160]">{c.visual}</div>
              <h3 className="text-[clamp(18px,1.5vw,22px)] text-ink">{c.title}</h3>
              <p className="mt-3 font-body text-[15px] leading-snug text-ink/65">{c.claim}</p>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
