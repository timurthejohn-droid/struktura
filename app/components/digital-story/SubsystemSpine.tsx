"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SectionHead from "../SectionHead";
import Reveal from "../materials/Reveal";
import { GlassCore, GlowDefs, ORANGE, WireForm } from "./svgKit";

// Подсистема — инженерный хребет внутри ядра. Четыре пункта по логике эскиза:
// узлы, расчёты, деталировка, решения для монтажа. Пункт подсвечивает своё место на схеме.
const ITEMS = [
  { title: "Узлы крепления", text: "Каждое соединение каркаса с формой проработано как отдельный узел." },
  { title: "Расчёт нагрузок", text: "Нагрузки и допуски считаются по модели — до изготовления." },
  { title: "Деталировка", text: "Каждый узел раскрыт до деталей, которые получит производство." },
  { title: "Решения для монтажа", text: "Очерёдность сборки и регулировки заложены заранее." },
];
const LEVELS = [110, 175, 240, 305, 370];
const L = 128; // левый край рёбер
const R = 332; // правый край рёбер
const MARKS = [
  { x: L, y: 175 },
  { x: 230, y: 34 },
  { x: R + 50, y: 196 },
  { x: 74, y: 370 },
];
const AMBER = "#ffb340";

export default function SubsystemSpine() {
  const [on, setOn] = useState(0);
  const [hold, setHold] = useState(false);

  // пока посетитель не выбрал пункт — пункты подсвечиваются по очереди
  useEffect(() => {
    if (hold || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setOn((v) => (v + 1) % ITEMS.length), 3400);
    return () => window.clearInterval(t);
  }, [hold]);

  const lit = (i: number) => (on === i ? 1 : 0.22);
  const pick = (i: number) => {
    setOn(i);
    setHold(true);
  };

  return (
    <section className="ds-section ds-b">
      <div className="container-x">
        <Reveal>
          <SectionHead index="05" kicker="Подсистема — инженерный хребет" theme="dark" />
        </Reveal>
        <div className="ds-split">
          <Reveal>
            <p className="ds-lead">
              Внутри ядра — несущая подсистема STRUKTURA+. Она превращает форму в&nbsp;реализуемую конструкцию.
            </p>
            <p className="ds-body ds-muted mt-6 max-w-[520px]">
              Подсистема постепенно обрастает инженерными решениями. R&amp;D проверяет их&nbsp;на&nbsp;mockup, поэтому
              реализуемость подтверждается до&nbsp;серийного изготовления.
            </p>
            <div className="ds-items">
              {ITEMS.map((it, i) => (
                <button
                  key={it.title}
                  type="button"
                  className={`ds-item${on === i ? " on" : ""}`}
                  onMouseEnter={() => pick(i)}
                  onFocus={() => pick(i)}
                  onClick={() => pick(i)}
                >
                  <span className="ds-item-n">{i + 1}</span>
                  <span>
                    <b>{it.title}</b>
                    <span className="ds-body ds-muted">{it.text}</span>
                  </span>
                </button>
              ))}
            </div>
            <Link href="/subsystems" className="btn btn-orange mt-10">
              Подробнее о подсистемах
            </Link>
          </Reveal>

          <Reveal className="ds-figure ds-figure--bare">
            <svg viewBox="0 0 460 440" role="img" aria-label="Схема подсистемы внутри ядра: стойка, рёбра, раскосы и узлы">
              <GlowDefs id="sp" />
              <GlassCore id="sp" cx={230} cy={240} r={200} warm={0.55} />
              <WireForm cx={230} cy={240} r={190} opacity={0.16} />

              <g filter="url(#sp-glow)">
                {/* раскосы */}
                {LEVELS.slice(0, -1).map((y, i) => (
                  <line key={y} x1={i % 2 ? L : R} y1={y} x2={i % 2 ? R : L} y2={LEVELS[i + 1]} stroke={ORANGE} strokeOpacity="0.45" strokeWidth="1.4" />
                ))}
                {/* рёбра */}
                {LEVELS.map((y) => (
                  <line key={y} x1={L} y1={y} x2={R} y2={y} stroke={ORANGE} strokeWidth="2.6" />
                ))}
                {/* стойка */}
                <line x1="230" y1="78" x2="230" y2="402" stroke={ORANGE} strokeWidth="5" />
              </g>

              {/* узлы крепления */}
              <g style={{ opacity: 0.45 + 0.55 * (on === 0 ? 1 : 0), transition: "opacity 0.4s" }} filter="url(#sp-glow)">
                {LEVELS.flatMap((y) => [L, R].map((x) => <rect key={`${x}-${y}`} x={x - 5} y={y - 5} width="10" height="10" fill="#ffd2b8" />))}
                {LEVELS.map((y) => (
                  <rect key={y} x={225} y={y - 5} width="10" height="10" fill="#ffd2b8" />
                ))}
              </g>

              {/* расчёт нагрузок */}
              <g style={{ opacity: lit(1), transition: "opacity 0.4s" }} filter="url(#sp-glow)">
                {[150, 230, 310].map((x, k) => (
                  <g key={x}>
                    <line x1={x} y1="48" x2={x} y2="86" stroke={AMBER} strokeWidth="1.6" />
                    <path d={`M${x - 6} 80 L${x} 94 L${x + 6} 80 z`} fill={AMBER}>
                      <animateTransform attributeName="transform" type="translate" values="0 -4;0 2;0 -4" dur="1.8s" begin={`${k * 0.3}s`} repeatCount="indefinite" />
                    </path>
                  </g>
                ))}
              </g>

              {/* деталировка: лупа на узле */}
              <g style={{ opacity: lit(2), transition: "opacity 0.4s" }}>
                <circle cx={R} cy="240" r="30" fill="rgba(14,14,14,0.55)" stroke="#fff" strokeWidth="1.2" filter="url(#sp-glow)" />
                <g transform={`translate(${R - 14} 228)`} stroke="#ffd2b8" fill="none" strokeWidth="1.2">
                  <path d="M0 22 H28 M5 22 V8 H23 V22 M10 8 V3 H18 V8" />
                  <circle cx="5" cy="22" r="1.6" fill={ORANGE} stroke="none" />
                </g>
                <line x1={R + 21} y1="261" x2={R + 40} y2="280" stroke="#fff" strokeWidth="2.4" />
              </g>

              {/* монтаж: очерёдность снизу вверх */}
              <g style={{ opacity: lit(3), transition: "opacity 0.4s" }}>
                <line x1="74" y1="372" x2="74" y2="120" stroke="#fff" strokeOpacity="0.6" strokeDasharray="3 5" className="ds-flow-up" />
                <path d="M68 128 L74 112 L80 128 z" fill="#fff" />
                {[370, 305, 240].map((y, i) => (
                  <g key={y}>
                    <line x1="80" y1={y} x2={L - 8} y2={y} stroke="#fff" strokeOpacity="0.3" />
                    <text x="96" y={y - 6} className="ds-svg-label" style={{ fill: "#fff" }}>
                      {i + 1}
                    </text>
                  </g>
                ))}
              </g>

              {/* метки пунктов */}
              {MARKS.map((m, i) => (
                <g key={i} onMouseEnter={() => pick(i)} style={{ cursor: "pointer" }}>
                  <circle cx={m.x} cy={m.y} r={on === i ? 13 : 10} fill={on === i ? ORANGE : "#141414"} stroke={ORANGE} strokeWidth="1.4" filter={on === i ? "url(#sp-glow)" : undefined} style={{ transition: "r 0.3s" }} />
                  <text x={m.x} y={m.y + 4} textAnchor="middle" className="ds-svg-label" style={{ fill: on === i ? "#fff" : ORANGE, letterSpacing: 0 }}>
                    {i + 1}
                  </text>
                </g>
              ))}
            </svg>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
