"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHead from "../SectionHead";
import Reveal from "../materials/Reveal";
import { GlassCore, GlowDefs, LAYER, LayerRings, Link2, Node, Spine, Tag, WireForm, arc } from "./svgKit";

// Путь одного объекта — пять шагов второй главы эскиза. Рядом — то же ядро:
// на каждом шаге к нему подключаются новые участники и проявляются новые слои.
const STEPS = [
  {
    title: "Замысел входит в модель",
    text: "Архитектурная форма и требования заказчика задают основу модели объекта. Генподрядчик добавляет данные об основании.",
    outcome: "Все участники начинают работу с общей основой.",
  },
  {
    title: "Разрабатываем и проверяем решение",
    text: "Проявляется подсистема: узлы, расчёты, деталировка и способ сборки. R&D проверяет решения на mockup.",
    outcome: "Реализуемость подтверждена до серийного изготовления.",
  },
  {
    title: "Увязываем проектные данные",
    text: "Обмеры уточняют основание. Геометрия, элементы и документация становятся детальными и связанными.",
    outcome: "Сопряжения и задания рассматриваются в одной системе.",
  },
  {
    title: "Организуем изготовление и поставки",
    text: "Профильные производства получают связанные задания, возвращают готовность и вопросы. Комплекты едут на объект.",
    outcome: "Разные исполнители работают над согласованными частями.",
  },
  {
    title: "Модель работает на площадке",
    text: "Монтаж идёт по схемам и данным модели. Обмеры, статусы и уточнения возвращаются в систему.",
    outcome: "Проект сохраняет связь с фактической сборкой.",
  },
];

const CX = 260;
const CY = 250;
const CR = 104;
const NODES = [
  { name: "Архитектор / Заказчик", x: 96, y: 92, c: LAYER[0], step: 0, anchor: "middle" as const },
  { name: "Генподрядчик", x: 424, y: 92, c: LAYER[0], step: 0, anchor: "middle" as const },
  { name: "R&D / Mockup", x: 54, y: 252, c: LAYER[2], step: 1, anchor: "start" as const },
  { name: "Проектирование", x: 104, y: 410, c: LAYER[3], step: 2, anchor: "middle" as const },
  { name: "Производства", x: 466, y: 252, c: LAYER[4], step: 3, anchor: "end" as const },
  { name: "Логистика", x: 416, y: 410, c: LAYER[4], step: 3, anchor: "middle" as const },
  { name: "Площадка", x: 260, y: 470, c: LAYER[5], step: 4, anchor: "middle" as const },
];

function JourneyCore({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 520 520" aria-hidden>
      <GlowDefs id="jc" />
      <ellipse cx={CX} cy={CY + 10} rx="246" ry="236" fill="none" stroke="rgba(255,255,255,0.07)" strokeDasharray="2 7" />
      {NODES.map((n) => {
        const on = n.step <= step;
        return (
          <g key={n.name} style={{ opacity: on ? 1 : 0, transition: "opacity 0.6s ease" }}>
            {on && <Link2 id="jc" d={arc(CX, CY, CR, n.x, n.y, 26)} c={n.c} dur={3 + n.step * 0.4} opacity={n.step === step ? 0.7 : 0.35} />}
            <Node id="jc" x={n.x} y={n.y} c={n.c} s={n.step === step ? 7 : 5} />
          </g>
        );
      })}
      <GlassCore id="jc" cx={CX} cy={CY} r={CR} />
      <WireForm cx={CX} cy={CY} r={CR} opacity={0.35} />
      <LayerRings id="jc" cx={CX} cy={CY} r={CR} count={Math.min(6, step + 2)} />
      <g style={{ opacity: step >= 1 ? 1 : 0, transition: "opacity 0.6s ease" }}>
        <Spine id="jc" cx={CX} cy={CY} r={CR} />
      </g>
      {/* подписи только у участников текущего шага — чтобы схема не перегружалась */}
      {NODES.filter((n) => n.step === step).map((n) => (
        <Tag
          key={n.name}
          x={n.anchor === "start" ? n.x - 6 : n.anchor === "end" ? n.x + 6 : n.x}
          y={n.y > CY ? n.y + 28 : n.y - 26}
          text={n.name}
          c={n.c}
          anchor={n.anchor}
        />
      ))}
    </svg>
  );
}

export default function ObjectJourney() {
  const listRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [current, setCurrent] = useState(0);

  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 60%", "end 60%"] });
  const fill = useTransform(scrollYProgress, (v) => `${Math.max(0, Math.min(1, v)) * 100}%`);

  // текущий шаг — тот, что пересёк середину экрана
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="ds-journey" className="ds-section ds-a">
      <div className="container-x">
        <Reveal>
          <SectionHead index="06" kicker="Путь одного объекта" theme="dark" />
        </Reveal>
        <Reveal className="mb-14 max-w-[760px] md:mb-20">
          <p className="ds-lead">
            Теперь та&nbsp;же среда — на&nbsp;одном объекте. Пять шагов, на&nbsp;каждом ядро получает новые данные
            и&nbsp;новых участников.
          </p>
        </Reveal>

        <div className="ds-journey-grid">
          <div ref={listRef} className="ds-journey">
            <div className="ds-journey-line" aria-hidden>
              <motion.div className="ds-journey-fill" style={{ height: fill }} />
            </div>
            {STEPS.map((s, i) => (
              <div key={s.title} ref={(el) => void (stepRefs.current[i] = el)} data-i={i} className={`ds-jstep${i <= current ? " on" : ""}${i === current ? " now" : ""}`}>
                <div className="ds-jdot">{String(i + 1).padStart(2, "0")}</div>
                <div className="ds-jbody">
                  <h3>{s.title}</h3>
                  <p className="ds-body ds-muted">{s.text}</p>
                  <p className="ds-outcome">{s.outcome}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="ds-journey-visual">
            <div className="ds-journey-sticky">
              <JourneyCore step={current} />
              <div className="ds-journey-caption">
                <span>Шаг {String(current + 1).padStart(2, "0")} / 05</span>
                <span>{STEPS[current].title}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
