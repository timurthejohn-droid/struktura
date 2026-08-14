"use client";
import { useEffect, useRef, useState } from "react";
import SectionHead from "./SectionHead";
import CursorGuides from "./CursorGuides";
import SubsystemModel from "./SubsystemModel";
import { useReveal } from "./useReveal";

const steps = [
  {
    n: "01",
    label: "Адаптивность",
    value: "Система рассчитывается под конкретный проект",
    desc: "Геометрия, материал, нагрузки, требуемая точность, способ крепления и монтажный сценарий становятся параметрами единой цифровой модели.",
  },
  {
    n: "02",
    label: "Производство",
    value: "Индивидуально для проекта. Серийно по качеству",
    desc: "Экструзионные профили, ЧПУ, роботизированные комплексы и аддитивные технологии позволяют выпускать уникальные решения по принципам промышленного производства.",
  },
  {
    n: "03",
    label: "Сборка",
    value: "Конструкция помогает собрать себя правильно",
    desc: "Цифровая маркировка и позиционирующие соединения определяют место каждого элемента, задают последовательность сборки, сокращают время монтажа и снижают вероятность ошибок.",
  },
  {
    n: "04",
    label: "Надёжность",
    value: "Расчёты, прототипирование и испытания",
    desc: "Разработанные системы и узлы проходят расчётную проверку и натурные испытания. Решение для каждого объекта проверяется с учётом нагрузок, условий эксплуатации, требований проекта, действующего законодательства, технических регламентов и применимых строительных норм.",
  },
];

const drawings = ["07.01.00", "07.02.00", "07.03.00", "07.04.00"];
const titles = ["АДАПТИВНОСТЬ", "ПРОИЗВОДСТВО", "СБОРКА", "НАДЁЖНОСТЬ"];
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

function SubsystemViz({ progress, assemblyProgress, zoomProgress, spinProgress, panelProgress, active, modelEnabled }: { progress: number; assemblyProgress: number; zoomProgress: number; spinProgress: number; panelProgress: number; active: number; modelEnabled: boolean }) {
  return (
    <div className="relative h-[calc(100vh-88px)] min-h-[640px] w-full" style={{ background: "var(--coal)" }}>
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

      {modelEnabled && <SubsystemModel assemblyProgress={assemblyProgress} zoomProgress={zoomProgress} spinProgress={spinProgress} panelProgress={panelProgress} showTopPanels={active === steps.length - 1} />}

      {/* drawing stamp */}
      <div className="absolute bottom-5 left-5 right-5 z-10">
        <div className="flex" style={{ border: "1px solid rgba(255,90,0,0.55)", background: "var(--coal)" }}>
          <div className="flex items-center justify-center px-5" style={{ borderRight: "1px solid rgba(255,90,0,0.55)", background: "var(--coal)" }}>
            <span className="font-mono text-orange" style={{ fontSize: 26, letterSpacing: "0.04em" }}>
              07<span style={{ fontSize: 14, verticalAlign: "super" }}>+</span>
            </span>
          </div>
          <div className="flex-1" style={{ background: "var(--coal)" }}>
            <div className="px-4 py-2.5 font-mono text-orange uppercase" style={{ fontSize: 10, letterSpacing: "0.13em", borderBottom: "1px solid rgba(255,90,0,0.4)", background: "var(--coal)" }}>
              {titles[active]}
            </div>
            <div className="px-4 py-2.5 font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.13em", color: "rgba(255,90,0,0.85)", borderBottom: "1px solid rgba(255,90,0,0.4)", background: "var(--coal)" }}>
              Чертёж №: {drawings[active]}
            </div>
            <div className="px-4 py-2.5 font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.13em", color: "rgba(255,90,0,0.85)", background: "var(--coal)" }}>
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
  const [assemblyProgress, setAssemblyProgress] = useState(0);
  const [modelEnabled, setModelEnabled] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setModelEnabled(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setModelEnabled(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
      const assemblyStartTop = vh * 0.78;
      const assemblyEndTop = denom > 0 ? start - denom / steps.length : start;
      const assembly = (assemblyStartTop - r.top) / (assemblyStartTop - assemblyEndTop);
      setProgress(clamp01(p));
      setAssemblyProgress(clamp01(assembly));
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
  const zoomProgress = clamp01((progress - 0.2) / 0.3) * clamp01((assemblyProgress - 0.82) / 0.18);
  const spinProgress = clamp01((progress - 0.5) / 0.25);
  const panelProgress = clamp01((progress - 0.55) / 0.45);

  return (
    <section id="subsystems" className="relative py-24 md:py-36" style={{ background: "var(--coal)" }}>
      <CursorGuides />
      <div className="container-x">
        {/* reveal — только на шапке: ниже sticky-чертёж, transform его сломал бы */}
        <div className="reveal" ref={headRevealRef}>
        <SectionHead index="01" kicker="Подсистемы. Ядровое решение STRUKTURA" theme="dark" />

        <div className="mb-14 max-w-3xl lg:mb-24">
            <p className="font-body text-white/65" style={{ fontSize: "clamp(16px, 1.25vw, 20px)", lineHeight: 1.6 }}>
              Мы выстроили систему реализации сложных архитектурных проектов, результатом
              которой стали подсистемы STRUKTURA. Физическое воплощение опыта
              и&nbsp;индивидуальные инженерные решения для ваших задач.
            </p>
        </div>
        </div>

        {/* scroll-driven: steps (left) + sticky visual (right) */}
        <div ref={wrapRef} className="flex flex-col lg:grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-20">
          {/* visual — first on mobile, sticky on the right on desktop */}
          <div className="order-1 lg:order-2 w-full">
            <div className="lg:sticky" style={{ top: 88 }}>
              <SubsystemViz progress={progress} assemblyProgress={assemblyProgress} zoomProgress={zoomProgress} spinProgress={spinProgress} panelProgress={panelProgress} active={active} modelEnabled={modelEnabled} />
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
                {i === steps.length - 1 && (
                  <p className="font-mono text-orange mt-8 max-w-lg uppercase" style={{ fontSize: 13, lineHeight: 1.7, letterSpacing: "0.08em", opacity: active === i ? 0.95 : 0.25, transition: "opacity 0.4s ease" }}>
                    Фасады · интерьеры · потолки · арт-объекты · кинетические и специальные конструкции
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
