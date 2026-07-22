"use client";
import { useEffect, useRef, useState } from "react";
import SectionHead from "./SectionHead";
import CursorGuides from "./CursorGuides";
import SubsystemModel from "./SubsystemModel";
import { useReveal } from "./useReveal";

const steps = [
  {
    n: "01",
    label: "Геометрия",
    value: "Любая форма, вплоть до двойной кривизны",
    desc: "Реализуем любую форму — от плоских панелей до поверхностей двойной кривизны. Геометрия не ограничивает архитектурную идею.",
  },
  {
    n: "02",
    label: "Точность",
    value: "Допуск ЧПУ — до 0.1 мм",
    desc: "Цифровая модель напрямую управляет станками с ЧПУ. Каждый элемент изготавливается с допуском до 0.1 мм — без подгонки на объекте.",
  },
  {
    n: "03",
    label: "Узлы",
    value: "Собственная R&D-разработка соединений",
    desc: "Узлы и крепёж — наша R&D-разработка: скрытые соединения, сборка без видимого крепежа, ремонтопригодность.",
  },
  {
    n: "04",
    label: "Применение",
    value: "Фасады · интерьеры · арт · несущие",
    desc: "Одна подсистема адаптируется под задачу: фасады, интерьеры, арт-объекты и несущие конструкции в любом проекте.",
  },
];

const drawings = ["07.01.00", "07.02.00", "07.03.00", "07.04.00"];
const titles = ["ГЕОМЕТРИЯ ФОРМЫ", "ТОЧНОСТЬ — ДОПУСК 0.1 ММ", "УЗЛОВЫЕ СОЕДИНЕНИЯ", "ОБЛАСТИ ПРИМЕНЕНИЯ"];

function SubsystemViz({ progress, active }: { progress: number; active: number }) {
  return (
    <div className="relative w-full" style={{ aspectRatio: "4 / 5", background: "var(--coal)" }}>
      {/* corner ticks */}
      {(
        [
          { top: 10, left: 10, bt: true, bl: true },
          { top: 10, right: 10, bt: true, br: true },
          { bottom: 10, left: 10, bb: true, bl: true },
          { bottom: 10, right: 10, bb: true, br: true },
        ] as { top?: number; bottom?: number; left?: number; right?: number; bt?: boolean; bb?: boolean; bl?: boolean; br?: boolean }[]
      ).map((c, i) => {
        const e = "1px solid rgba(255,90,0,0.6)";
        return (
          <span key={i} className="absolute z-10" style={{ top: c.top, bottom: c.bottom, left: c.left, right: c.right, width: 12, height: 12, borderTop: c.bt ? e : undefined, borderBottom: c.bb ? e : undefined, borderLeft: c.bl ? e : undefined, borderRight: c.br ? e : undefined }} />
        );
      })}

      <span className="absolute right-5 top-4 z-10 font-mono text-orange/70" style={{ fontSize: 10, letterSpacing: "0.2em" }}>
        АКСОНОМЕТРИЯ
      </span>
      {/* scroll progress bar */}
      <div className="absolute left-5 top-4 z-10 h-[2px] w-24" style={{ background: "rgba(255,90,0,0.2)" }}>
        <div className="h-full" style={{ width: `${progress * 100}%`, background: "var(--orange)" }} />
      </div>

      <SubsystemModel progress={progress} />

      {/* drawing stamp */}
      <div className="absolute bottom-5 left-5 right-5 z-10">
        <div className="flex" style={{ border: "1px solid rgba(255,90,0,0.55)" }}>
          <div className="flex items-center justify-center px-5" style={{ borderRight: "1px solid rgba(255,90,0,0.55)" }}>
            <span className="font-mono text-orange" style={{ fontSize: 26, letterSpacing: "0.04em" }}>
              07<span style={{ fontSize: 14, verticalAlign: "super" }}>+</span>
            </span>
          </div>
          <div className="flex-1">
            <div className="px-4 py-2.5 font-mono text-orange uppercase" style={{ fontSize: 10, letterSpacing: "0.13em", borderBottom: "1px solid rgba(255,90,0,0.4)" }}>
              {titles[active]}
            </div>
            <div className="px-4 py-2.5 font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.13em", color: "rgba(255,90,0,0.85)", borderBottom: "1px solid rgba(255,90,0,0.4)" }}>
              Чертёж №: {drawings[active]}
            </div>
            <div className="px-4 py-2.5 font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.13em", color: "rgba(255,90,0,0.85)" }}>
              Масштаб: 1/100
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Subsystems() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const headRevealRef = useReveal();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let raf = 0;
    const calc = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.12;
      const denom = r.height - vh;
      const p = denom > 0 ? (start - r.top) / denom : 0;
      setProgress(Math.max(0, Math.min(1, p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const active = Math.max(0, Math.min(steps.length - 1, Math.floor(progress * steps.length - 1e-6)));

  return (
    <section id="subsystems" className="relative py-24 md:py-36" style={{ background: "var(--coal)" }}>
      <CursorGuides />
      <div className="container-x">
        {/* reveal — только на шапке: ниже sticky-чертёж, transform его сломал бы */}
        <div className="reveal" ref={headRevealRef}>
        <SectionHead index="07" kicker="Подсистемы STRUKTURA" theme="dark" />

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-20 mb-14 lg:mb-24">
          <h2 className="text-white" style={{ fontSize: "clamp(28px, 3.4vw, 54px)", lineHeight: 1.05 }}>
            Физическое воплощение опыта
          </h2>
          <div>
            <p className="font-body text-white/65" style={{ fontSize: "clamp(16px, 1.25vw, 20px)", lineHeight: 1.6 }}>
              Мы выстроили систему реализации сложных архитектурных проектов, результатом которой
              стали <span className="text-white">подсистемы STRUKTURA</span> — индивидуальные
              инженерные решения под ваши задачи. Прокрутите — чертёж справа собирается на ваших
              глазах.
            </p>
            <a href="/subsystems" className="btn btn-ghost-dark mt-8">
              Подробнее →
            </a>
          </div>
        </div>
        </div>

        {/* scroll-driven: steps (left) + sticky visual (right) */}
        <div ref={wrapRef} className="flex flex-col lg:grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-20">
          {/* visual — first on mobile, sticky on the right on desktop */}
          <div className="order-1 lg:order-2 w-full">
            <div className="lg:sticky" style={{ top: "12vh" }}>
              <SubsystemViz progress={progress} active={active} />
            </div>
          </div>

          {/* steps */}
          <div className="order-2 lg:order-1 w-full">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className="py-10 lg:min-h-[80vh] flex flex-col justify-center"
                style={{ borderTop: i ? "1px solid var(--line-dark)" : undefined }}
              >
                <span className="font-mono text-orange text-sm mb-5">{s.n}</span>
                <h3 className="font-mono text-white mb-4" style={{ fontSize: "clamp(24px, 2.6vw, 42px)", opacity: active === i ? 1 : 0.32, transition: "opacity 0.4s ease" }}>
                  {s.label}
                </h3>
                <p className="font-mono text-white mb-5" style={{ fontSize: "clamp(15px, 1.3vw, 20px)", opacity: active === i ? 0.85 : 0.28, transition: "opacity 0.4s ease" }}>
                  {s.value}
                </p>
                <p className="font-body text-white/55 max-w-md" style={{ fontSize: 15, lineHeight: 1.6, opacity: active === i ? 1 : 0.25, transition: "opacity 0.4s ease" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
