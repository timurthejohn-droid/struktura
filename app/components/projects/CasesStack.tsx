"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cases, type CaseItem } from "./casesData";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Стопка кейсов: панели-экраны закреплены (sticky) внутри общей секции,
// поэтому следующая наезжает снизу на предыдущую, а та уходит вглубь —
// масштаб и затемнение. Прогресс считаем один раз на всю секцию и раздаём
// панелям: у каждой свой отрезок [i, i+1] внутри общей шкалы.

function CasePanel({
  item,
  index,
  total,
  progress,
  steps,
}: {
  item: CaseItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  steps: number;
}) {
  const reduced = useReducedMotion();
  const span = 1 / steps;
  const pin = index / steps; // момент, когда панель встала под шапку
  // Отрезки держим внутри [0,1]: у первой панели нет «въезда» (она уже на месте),
  // у последней — «выезда» (её никто не накрывает).
  const enter = Math.max(0, pin - span);
  const exit = Math.min(1, pin + span);
  const canEnter = enter < pin;
  const canExit = pin < exit;

  const exitRange: [number, number] = canExit ? [pin, exit] : [0, 1];
  const scale = useTransform(progress, exitRange, canExit ? [1, 0.92] : [1, 1]);
  const veil = useTransform(progress, exitRange, canExit ? [0, 0.66] : [0, 0]);
  const contentY = useTransform(
    progress,
    canExit ? [pin, pin + span * 0.8] : [0, 1],
    canExit ? [0, -60] : [0, 0],
  );
  const contentOpacity = useTransform(
    progress,
    canExit ? [pin, pin + span * 0.56] : [0, 1],
    canExit ? [1, 0] : [1, 1],
  );

  const imageStops = [...(canEnter ? [enter] : []), pin, ...(canExit ? [exit] : [])];
  const imageShift = [...(canEnter ? ["7%"] : []), "0%", ...(canExit ? ["-6%"] : [])];
  const imageY = useTransform(progress, imageStops, imageShift);

  return (
    <div className="sticky top-0 h-[100svh] overflow-hidden" style={{ zIndex: index + 1 }}>
      <motion.div
        className="absolute inset-0 origin-center overflow-hidden border-t border-white/10 bg-coal"
        style={reduced ? undefined : { scale }}
      >
        {/* Кадр объекта с лёгким параллаксом */}
        <motion.img
          src={`${basePath}${item.image}`}
          alt={`${item.name} — ${item.work}`}
          className="absolute inset-0 h-full w-full object-cover"
          style={reduced ? { scale: 1.04 } : { y: imageY, scale: 1.22 }}
          loading={index === 0 ? "eager" : "lazy"}
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/55" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />

        {/* Номер-призрак */}
        <span
          aria-hidden
          className="pointer-events-none absolute right-[5%] top-[9%] select-none font-mono leading-none text-white/[0.07]"
          style={{ fontSize: "clamp(130px,22vw,340px)" }}
        >
          {item.number}
        </span>

        <motion.div
          className="relative flex h-full flex-col justify-between pb-10 pt-24 md:pb-14 md:pt-28"
          style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        >
          {/* Служебная строка */}
          <div className="container-x flex items-center justify-between border-b border-white/15 pb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
              {item.number} / {String(total).padStart(2, "0")}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">{item.category}</span>
          </div>

          {/* Карточка кейса */}
          <div className="container-x">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-orange">{item.work}</p>
                <h2
                  className="mt-5 max-w-[900px] text-white"
                  style={{ fontSize: "clamp(30px,5.4vw,80px)", lineHeight: 0.96, letterSpacing: "-0.01em" }}
                >
                  {item.name}
                </h2>
                {item.summary && (
                  <p className="mt-6 max-w-[560px] font-body text-[15px] leading-[1.6] text-white/70 md:text-[17px]">
                    {item.summary}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
                  {item.href ? (
                    <a href={`${basePath}${item.href}`} className="btn btn-orange">
                      Смотреть кейс
                      <span aria-hidden>→</span>
                    </a>
                  ) : (
                    <a href={`${basePath}/contacts`} className="btn btn-ghost-dark">
                      Запросить материалы
                      <span aria-hidden>→</span>
                    </a>
                  )}
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 lg:hidden">
                    {item.year}
                  </span>
                </div>
              </div>

              {/* Спецификация: реальные факты кейса, иначе — паспорт из карточки */}
              <dl className="hidden border-t border-white/15 lg:block">
                {(item.facts ?? [
                  { label: "Направление", value: item.category },
                  { label: "Год", value: item.year },
                ]).map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-baseline justify-between gap-4 border-b border-white/10 py-3"
                  >
                    <dt className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                      {fact.label}
                    </dt>
                    <dd className="text-right font-body text-[14px] leading-[1.35] text-white/85">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </motion.div>

        {/* Затемнение уходящей панели */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black"
          style={{ opacity: reduced ? 0 : veil }}
        />
      </motion.div>
    </div>
  );
}

export default function CasesStack() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  const [railOn, setRailOn] = useState(false);
  const reduced = useReducedMotion();

  const total = cases.length;
  const steps = Math.max(total - 1, 1);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(total - 1, Math.max(0, Math.round(value * steps)));
    setActive((current) => (current === next ? current : next));
  });

  // Рейку показываем только пока стопка на экране
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setRailOn(entry.isIntersecting), {
      rootMargin: "-12% 0px -20% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const goTo = (index: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.offsetTop + index * window.innerHeight;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section ref={sectionRef} id="cases" className="relative bg-coal">
      {cases.map((item, index) => (
        <CasePanel
          key={item.slug}
          item={item}
          index={index}
          total={total}
          progress={scrollYProgress}
          steps={steps}
        />
      ))}

      {/* Рейка-индекс */}
      <div
        className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2 md:flex"
        style={{
          opacity: railOn ? 1 : 0,
          visibility: railOn ? "visible" : "hidden",
          transition: "opacity 0.4s var(--ease-out), visibility 0.4s",
        }}
        aria-label="Навигация по кейсам"
      >
        {cases.map((item, index) => {
          const isActive = index === active;
          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Кейс ${item.number}: ${item.name}`}
              aria-current={isActive ? "true" : undefined}
              className="group flex items-center justify-end gap-2 py-1"
            >
              <span
                className="font-mono text-[10px] tracking-[0.14em] transition-colors"
                style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.32)" }}
              >
                {item.number}
              </span>
              <span
                className="block h-px transition-all duration-300 group-hover:bg-white"
                style={{
                  width: isActive ? 28 : 12,
                  background: isActive ? "var(--orange)" : "rgba(255,255,255,0.32)",
                }}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
