"use client";
import { useEffect, useRef, useState } from "react";
import Stage from "./three/Stage";
import RealSubsystem from "./three/RealSubsystem";
import { createShellState } from "./three/state";

// «Прорывная инженерная технология» — раскрыта через конкретные особенности.
const features = [
  { title: "Собственные алгоритмы", text: "Геометрия, нагрузки, материал и монтаж увязаны в одной модели" },
  { title: "Силовая + позиционирующая функция", text: "Одна система несёт облицовку и выставляет её в пространстве" },
  { title: "Изготовление из модели", text: "Данные модели напрямую становятся производственными заданиями" },
  { title: "Принципы сборки", text: "Сопряжения, метки и регулировки заложены при разработке" },
];

export default function SubsHero() {
  const state = useRef(createShellState({ assemble: 0, spin: -0.5 }));
  // На телефоне модель стоит в потоке под заголовком, на десктопе — фоном справа
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Интро: панели слетаются на каркас, затем модель медленно вращается.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      state.current.assemble = 1.3;
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      state.current.assemble = Math.min(1.3, Math.max(0, (t - 0.4) / 2.4) * 1.3);
      state.current.spin = -0.5 + t * 0.06;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-coal-deep text-white">
      {/* Чертёжная сетка */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at 65% 45%, #000 20%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -z-10 h-[620px] w-[620px] rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(circle, #ff5a00 0%, transparent 65%)", right: "8%", top: "18%" }}
      />

      {wide && (
        <Stage className="absolute inset-0 left-[28%]" camera={[7.4, 5.2, 8.4]} target={[-1.3, 3.3, 0]} parallax={1.1}>
          <RealSubsystem stateRef={state} />
        </Stage>
      )}

      <div className="pointer-events-none container-x relative z-10 flex min-h-[100svh] flex-col pb-10 pt-24 md:pt-28">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 rise-in" style={{ animationDelay: "0.05s" }}>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Подсистемы STRUKTURA</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">10+ лет инженерной эволюции</span>
        </div>

        <div className="flex flex-1 flex-col justify-start py-12 md:justify-center md:py-14">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-orange rise-in" style={{ animationDelay: "0.12s" }}>
            Прорывная инженерная технология
          </p>
          <h1 className="max-w-[820px] text-[clamp(38px,6.4vw,104px)] leading-[0.93] rise-in" style={{ animationDelay: "0.18s" }}>
            От цифровой модели —<br />к <span className="text-orange">физической</span> системе
          </h1>
          <p
            className="mt-8 max-w-[480px] font-body text-white/60 rise-in"
            style={{ fontSize: "clamp(15px, 1.2vw, 18px)", lineHeight: 1.55, animationDelay: "0.26s" }}
          >
            Собственная инженерная технология, которая объединяет несущую функцию, крепление
            облицовки и её точное позиционирование в пространстве.
          </p>
          {!wide && (
            <Stage className="-mx-6 mt-6 h-[300px]" camera={[6.2, 4.6, 7]} target={[0, 3.2, 0]} parallax={0.4}>
              <RealSubsystem stateRef={state} />
            </Stage>
          )}
        </div>

        <ul className="grid gap-px border-t border-white/10 bg-coal-deep/60 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4 rise-in" style={{ animationDelay: "0.4s" }}>
          {features.map((f, i) => (
            <li key={f.title} className="py-5 pr-6 lg:border-r lg:border-white/10 lg:pl-5 lg:first:pl-0 lg:last:border-r-0">
              <span className="font-mono text-[11px] text-orange">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-[13px] leading-tight">{f.title}</h3>
              <p className="mt-2 font-body text-[13px] leading-snug text-white/50">{f.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
