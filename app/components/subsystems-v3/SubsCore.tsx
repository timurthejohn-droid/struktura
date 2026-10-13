"use client";
import { useRef, useState } from "react";
import SectionHead from "../SectionHead";
import { useScrollProgress } from "./hooks";
import SubsCompare from "./SubsCompare";
import Stage from "./three/Stage";
import RealSubsystem from "./three/RealSubsystem";
import { createShellState, type ShellLayer } from "./three/state";

// Рассказ при прокрутке: конструкция раскладывается на слои и собирается обратно.
const steps: { at: number; layer: ShellLayer; tag: string; title: string; text: string }[] = [
  { at: 0, layer: "all", tag: "Система", title: "Одна конструкция — три задачи", text: "Подсистема несёт облицовку, крепит её и задаёт её точное положение в пространстве." },
  { at: 0.16, layer: "base", tag: "Основание", title: "Фактическое основание", text: "Привязки и вылеты рассчитываются от реальной геометрии опорных поверхностей." },
  { at: 0.32, layer: "bearing", tag: "Несущие элементы", title: "Каркас воспринимает нагрузки", text: "Рёбра и стойки проектируются под форму, материал и нагрузки конкретного объекта." },
  { at: 0.48, layer: "nodes", tag: "Узлы крепления", title: "Узлы задают положение", text: "Каждая точка крепления лежит в модели — со своей координатой и ориентацией." },
  { at: 0.64, layer: "adjust", tag: "Регулировки", title: "Меняется узел — выставляется облицовка", text: "Регулировка заложена в устройство системы: облицовка следует за узлом, геометрия сохраняется." },
  { at: 0.82, layer: "all", tag: "Результат", title: "Силовая основа и точная геометрия", text: "Несущая работа, геометрия и регулировки разработаны совместно — в одной системе." },
];

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function SubsCore() {
  const state = useRef(createShellState({ spin: -0.35 }));
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  const sectionRef = useScrollProgress<HTMLDivElement>((p) => {
    const st = state.current;
    st.explode = smooth(0.08, 0.2, p) * (1 - smooth(0.8, 0.92, p));
    st.spin = -0.35 + p * 0.9;
    let idx = 0;
    steps.forEach((s, i) => {
      if (p >= s.at) idx = i;
    });
    st.layer = steps[idx].layer;
    setActive(idx);
    setProgress(p);
  });

  return (
    <section id="core" className="bg-paper">
      <div className="container-x pt-20 md:pt-28">
        <SectionHead index="01" kicker="Силовая основа и точная геометрия — в одной системе" />
      </div>

      <div ref={sectionRef} className="relative" style={{ height: "520vh" }}>
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden lg:flex-row">
          {/* Текст шагов */}
          <div className="container-x relative z-10 order-2 flex flex-col justify-end pb-8 lg:order-1 lg:w-[40%] lg:max-w-none lg:justify-center lg:pb-0 lg:pr-0">
            <div className="mb-8 hidden gap-1.5 lg:flex">
              {steps.map((s, i) => (
                <span key={s.tag} className={`h-[3px] flex-1 transition-colors duration-500 ${i <= active ? "bg-orange" : "bg-black/10"}`} />
              ))}
            </div>
            <div className="relative min-h-[210px] lg:min-h-[300px]">
              {steps.map((s, i) => (
                <div
                  key={s.tag}
                  className="absolute inset-0 transition-all duration-700"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform: `translateY(${i === active ? 0 : i < active ? -24 : 24}px)`,
                    transitionTimingFunction: "var(--ease-out)",
                  }}
                  aria-hidden={i !== active}
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-orange">
                    {String(i + 1).padStart(2, "0")} · {s.tag}
                  </span>
                  <h3 className="mt-4 max-w-[460px] text-[clamp(24px,2.6vw,40px)] leading-[1.02] text-ink">{s.title}</h3>
                  <p className="mt-5 max-w-[420px] font-body text-[clamp(15px,1.2vw,18px)] leading-[1.55] text-ink/60">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3D */}
          <div className="relative order-1 h-[58svh] lg:order-2 lg:h-full lg:flex-1">
            <Stage className="absolute inset-0" camera={[8.4, 5.2, 9.6]} target={[0, 3.1, 0]} parallax={0.5} dark={false}>
              <RealSubsystem stateRef={state} dark={false} />
            </Stage>
            {/* HUD */}
            <div className="pointer-events-none absolute right-6 top-6 hidden text-right font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40 md:block lg:right-16 lg:top-24">
              <div>Exploded view</div>
              <div className="mt-1 tabular-nums text-orange">{String(Math.round(progress * 100)).padStart(3, "0")}%</div>
            </div>
            <ul className="pointer-events-none absolute bottom-6 right-6 hidden flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.16em] md:flex lg:bottom-16 lg:right-16">
              {["Оболочка", "Узлы и регулировки", "Несущие элементы", "Основание"].map((l, i) => {
                const on = ["shell", "nodes", "bearing", "base"][i] === steps[active].layer || (steps[active].layer === "adjust" && i < 2);
                return (
                  <li key={l} className={`flex items-center justify-end gap-3 transition-colors ${on ? "text-ink" : "text-ink/35"}`}>
                    {l}
                    <span className={`h-2 w-2 transition-colors ${on ? "bg-orange" : "bg-black/15"}`} />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <SubsCompare />
    </section>
  );
}
