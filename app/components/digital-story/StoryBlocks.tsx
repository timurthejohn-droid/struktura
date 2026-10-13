import Link from "next/link";
import SectionHead from "../SectionHead";
import Reveal from "../materials/Reveal";
import HeroCore from "./HeroCore";
import { GREEN, GlassCore, GlowDefs, LAYER, LayerRings, Link2, Node, ORANGE, Spine, Tag, WireForm, arc } from "./svgKit";

// Блоки страницы «Цифровая среда» в классическом формате.
// Иллюстрации — то же цифровое ядро, что в 3D-схеме, на разных стадиях истории.

/* ─────────────── Первый экран ─────────────── */

export function DsHero() {
  return (
    <section className="ds-hero">
      <HeroCore />
      <div className="ds-hero-shade" aria-hidden />
      <div className="container-x ds-hero-in">
        <div className="ds-hero-text">
          <div className="eyebrow text-orange">Цифровая среда STRUKTURA+</div>
          <h1>
            Одна модель —<br />
            от&nbsp;замысла <span className="text-orange">до&nbsp;собранного объекта</span>
          </h1>
          <p className="ds-lead ds-muted">
            Цифровая среда — технологическая основа нашей работы. Она связывает архитектуру, инженерию, производство
            и&nbsp;монтаж, чтобы сложная идея дошла до&nbsp;объекта без&nbsp;потерь.
          </p>
          <div className="ds-hero-cta">
            <a href="#contact" className="btn btn-orange">
              Обсудить проект
            </a>
          </div>
        </div>

        <nav className="ds-toc" aria-label="Содержание">
          {[
            ["01", "Где теряется идея", "#ds-problem"],
            ["02", "Решение — общее ядро", "#ds-solution"],
            ["04", "Как устроено ядро", "#ds-scheme"],
            ["06", "Путь одного объекта", "#ds-journey"],
          ].map(([n, t, href]) => (
            <a key={n} href={href}>
              <span>{n}</span>
              <span>{t}</span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}

/* ─────────────── 01 · Проблема ─────────────── */

const LOSSES = [
  { x: 170, y: 88, text: "Коллизии разделов", dx: 16, anchor: "start" as const },
  { x: 340, y: 145, text: "Ошибки передачи в производство", dx: 16, anchor: "start" as const },
  { x: 510, y: 208, text: "Переделки на объекте", dx: -16, anchor: "end" as const },
];

export function DsProblem() {
  return (
    <section id="ds-problem" className="ds-section ds-a">
      <div className="container-x">
        <Reveal>
          <SectionHead index="01" kicker="Где теряется идея" theme="dark" />
        </Reveal>
        <div className="ds-split">
          <Reveal>
            <p className="ds-lead">
              Обычно сложный объект проходит путь по&nbsp;эстафете: архитектор → проектировщики → производство →
              монтаж.
            </p>
            <p className="ds-body ds-muted mt-6 max-w-[520px]">
              На&nbsp;каждой передаче часть данных теряется или искажается. Ошибки находят поздно — на&nbsp;производстве
              или уже на&nbsp;площадке, когда исправлять дороже всего. К&nbsp;финалу приходит уже не&nbsp;тот объект,
              который задумывал архитектор.
            </p>
          </Reveal>

          <Reveal className="ds-figure">
            <svg viewBox="0 0 640 330" role="img" aria-label="Схема: при эстафете замысел теряется на каждой передаче, в единой среде — сохраняется">
              <GlowDefs id="pb" />
              <linearGradient id="pb-loss" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#ff6a3d" stopOpacity="0.02" />
                <stop offset="1" stopColor="#ff6a3d" stopOpacity="0.26" />
              </linearGradient>
              {[60, 120, 180, 240].map((y) => (
                <line key={y} x1="40" y1={y} x2="620" y2={y} stroke="rgba(255,255,255,0.05)" />
              ))}
              {[80, 250, 420, 590].map((x) => (
                <line key={x} x1={x} y1="40" x2={x} y2="280" stroke="rgba(255,255,255,0.06)" strokeDasharray="2 6" />
              ))}
              <line x1="40" y1="280" x2="620" y2="280" stroke="rgba(255,255,255,0.18)" />
              <text x="26" y="160" className="ds-svg-axis" transform="rotate(-90 26 160)" textAnchor="middle">
                Сохранность замысла
              </text>
              {[
                [80, "Замысел"],
                [250, "Проект"],
                [420, "Производство"],
                [590, "Монтаж"],
              ].map(([x, t]) => (
                <text key={t as string} x={x as number} y="304" textAnchor="middle" className="ds-svg-axis">
                  {t}
                </text>
              ))}
              {/* потери — растущий разрыв между замыслом и тем, что доходит до объекта */}
              <path
                className="ds-pop"
                style={{ transitionDelay: "1.2s" }}
                d="M80 60 H590 V240 H520 L500 175 H350 L330 115 H180 L160 60 Z"
                fill="url(#pb-loss)"
              />
              <path className="ds-draw" style={{ ["--len" as string]: 800 }} d="M80 60 H160 L180 115 H330 L350 175 H500 L520 240 H590" fill="none" stroke="#8a857d" strokeWidth="2" />
              <path
                className="ds-draw"
                style={{ ["--len" as string]: 520, transitionDelay: "0.35s" }}
                d="M80 60 H590"
                fill="none"
                stroke={ORANGE}
                strokeWidth="2.6"
                filter="url(#pb-glow)"
              />
              {LOSSES.map((l, i) => (
                <g key={l.text} className="ds-pop" style={{ transitionDelay: `${0.7 + i * 0.25}s` }}>
                  <circle cx={l.x} cy={l.y} r="5" fill="#ff6a3d" filter="url(#pb-glow)" />
                  <circle cx={l.x} cy={l.y} r="5" fill="none" stroke="#ff6a3d" className="ds-ping" style={{ animationDelay: `${i * 0.5}s` }} />
                  <text x={l.x + l.dx} y={l.y + 4} textAnchor={l.anchor} className="ds-svg-loss">
                    {l.text}
                  </text>
                </g>
              ))}
              <text x="582" y="84" textAnchor="end" className="ds-svg-loss ds-pop" style={{ transitionDelay: "1.4s", fill: "#ff8a5c" }}>
                Разрыв
              </text>
            </svg>
            <div className="ds-legend">
              <span>
                <i style={{ background: ORANGE, boxShadow: `0 0 8px ${ORANGE}` }} />
                Единая цифровая среда
              </span>
              <span>
                <i style={{ background: "#8a857d" }} />
                Эстафета
              </span>
              <span className="ml-auto">Схема для иллюстрации</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── 02 · Решение ─────────────── */

const RELAY = ["Замысел", "Проект", "Расчёты", "Производство", "Монтаж"];
const HUB = [
  { name: "Архитектор", a: -2.45, c: LAYER[0] },
  { name: "R&D", a: -0.7, c: LAYER[2] },
  { name: "Проектирование", a: Math.PI, c: LAYER[3] },
  { name: "Производства", a: 0, c: LAYER[4] },
  { name: "Логистика", a: 0.75, c: LAYER[4] },
  { name: "Площадка", a: 2.3, c: LAYER[5] },
];

export function DsSolution() {
  return (
    <section id="ds-solution" className="ds-section ds-b">
      <div className="container-x">
        <Reveal>
          <SectionHead index="02" kicker="Решение — общее ядро" theme="dark" />
        </Reveal>
        <Reveal className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <p className="ds-lead">
            Вместо эстафеты все участники работают с&nbsp;<span className="text-orange">одной моделью</span> объекта.
          </p>
          <p className="ds-body ds-muted">
            Данные не&nbsp;передаются из&nbsp;рук в&nbsp;руки — они хранятся в&nbsp;общем цифровом ядре. Каждый участник
            получает из&nbsp;него свою часть и&nbsp;возвращает результат обратно. Ядро сохраняется на&nbsp;всём пути —
            от&nbsp;первого эскиза до&nbsp;монтажа.
          </p>
        </Reveal>

        <Reveal className="ds-versus">
          <figure>
            <figcaption>
              <span className="ds-note">Как обычно</span>
              <b>Эстафета</b>
            </figcaption>
            <svg viewBox="0 0 520 230" aria-hidden>
              <GlowDefs id="rl" />
              <path id="rl-path" d="M40 110 H480" stroke="rgba(255,255,255,0.18)" />
              {RELAY.map((r, i) => {
                const x = 40 + i * 110;
                return (
                  <g key={r} opacity={1 - i * 0.16}>
                    <circle cx={x} cy="110" r="16" fill="#151515" stroke="rgba(255,255,255,0.55)" />
                    <circle cx={x} cy="110" r="3" fill="#fff" />
                    <text x={x} y="152" textAnchor="middle" className="ds-svg-label" style={{ fill: "rgba(255,255,255,0.7)" }}>
                      {r}
                    </text>
                    {i < RELAY.length - 1 && (
                      // на каждой передаче часть данных «выпадает»
                      <circle cx={x + 55} cy="110" r="2.4" fill="#ff6a3d" filter="url(#rl-glow)">
                        <animate attributeName="cy" values="110;170" dur="2.4s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
                        <animate attributeName="opacity" values="1;0" dur="2.4s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              })}
              {[0, 1, 2].map((k) => (
                <circle key={k} r="3" fill="#fff" filter="url(#rl-glow)">
                  <animateMotion dur="4.8s" begin={`${-k * 1.6}s`} repeatCount="indefinite" path="M40 110 H480" />
                  <animate attributeName="opacity" values="1;0.85;0.6;0.4;0.2" dur="4.8s" begin={`${-k * 1.6}s`} repeatCount="indefinite" />
                  <animate attributeName="r" values="3.4;3;2.4;1.9;1.4" dur="4.8s" begin={`${-k * 1.6}s`} repeatCount="indefinite" />
                </circle>
              ))}
              <text x="260" y="204" textAnchor="middle" className="ds-svg-loss" style={{ fill: "#ff8a5c" }}>
                На каждой передаче — потери данных
              </text>
            </svg>
          </figure>
          <figure>
            <figcaption>
              <span className="ds-note">Как у нас</span>
              <b className="text-orange">Цифровое ядро</b>
            </figcaption>
            <svg viewBox="0 0 520 260" aria-hidden>
              <GlowDefs id="hb" />
              {HUB.map((h) => {
                const x = 260 + Math.cos(h.a) * 200;
                const y = 130 + Math.sin(h.a) * 96;
                return (
                  <g key={h.name}>
                    <Link2 id="hb" d={arc(260, 130, 60, x, y, 18)} c={h.c} dur={3 + Math.abs(h.a)} />
                    <Node id="hb" x={x} y={y} c={h.c} s={5} />
                    <text x={x} y={y + (y > 130 ? 24 : -14)} textAnchor="middle" className="ds-svg-label" style={{ fill: "rgba(255,255,255,0.75)" }}>
                      {h.name}
                    </text>
                  </g>
                );
              })}
              <GlassCore id="hb" cx={260} cy={130} r={60} />
              <LayerRings id="hb" cx={260} cy={130} r={60} />
            </svg>
          </figure>
        </Reveal>

        <Reveal className="ds-points reveal-stagger">
          {[
            ["Одна модель", "Архитектура, подсистема, производство и площадка опираются на данные одного объекта."],
            ["Данные в обе стороны", "Задания уходят к участникам, статусы и уточнения возвращаются в ядро."],
            ["Ядро сохраняется", "Изменения рассматриваются вместе с последствиями для всех связанных элементов."],
          ].map(([t, d], i) => (
            <div key={t}>
              <span className="ds-points-n">{String(i + 1).padStart(2, "0")}</span>
              <b>{t}</b>
              <p className="ds-body ds-muted">{d}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────── 03 · Как мы это построили: одно ядро в трёх стадиях ─────────────── */

const DATA_IN = [
  [30, 40],
  [230, 36],
  [20, 150],
  [240, 170],
  [130, 14],
];

export function DsEvolution() {
  return (
    <section className="ds-section ds-a">
      <div className="container-x">
        <Reveal>
          <SectionHead index="03" kicker="Как мы это построили" theme="dark" />
        </Reveal>
        <Reveal className="mb-12 max-w-[760px] md:mb-16">
          <p className="ds-lead">
            Ядро выросло внутри компании за&nbsp;годы работы — от&nbsp;проекта к&nbsp;проекту, в&nbsp;три больших шага.
          </p>
        </Reveal>

        <Reveal className="ds-evo reveal-stagger">
          <article>
            <svg viewBox="0 0 260 220" aria-hidden>
              <GlowDefs id="e1" />
              <GlassCore id="e1" cx={130} cy={110} r={74} warm={0.6} />
              <WireForm cx={130} cy={110} r={74} opacity={0.75} />
            </svg>
            <div className="ds-evo-step">
              <span>01</span>3D-геометрия
            </div>
            <p className="ds-body ds-muted">
              Сложная форма описывается точной цифровой геометрией. Архитектура и&nbsp;инженерия работают с&nbsp;ней как
              с&nbsp;общей основой.
            </p>
          </article>

          <article>
            <svg viewBox="0 0 260 220" aria-hidden>
              <GlowDefs id="e2" />
              {DATA_IN.map(([x, y], i) => (
                <rect key={i} width="7" height="7" fill={LAYER[(i + 1) % LAYER.length]} filter="url(#e2-glow)">
                  <animateMotion dur="3.2s" begin={`${-i * 0.64}s`} repeatCount="indefinite" path={`M${x} ${y} L${130 + (x - 130) * 0.35} ${110 + (y - 110) * 0.35}`} />
                  <animate attributeName="opacity" values="0;1;1;0" dur="3.2s" begin={`${-i * 0.64}s`} repeatCount="indefinite" />
                </rect>
              ))}
              <GlassCore id="e2" cx={130} cy={110} r={74} warm={0.8} />
              <WireForm cx={130} cy={110} r={74} opacity={0.4} />
              <LayerRings id="e2" cx={130} cy={110} r={74} />
            </svg>
            <div className="ds-evo-step">
              <span>02</span>Алгоритмы и связанные данные
            </div>
            <p className="ds-body ds-muted">
              Правила связывают множество разных элементов, а&nbsp;данные — их&nbsp;свойства. Сложность масштабируется
              без&nbsp;потери связей между деталями.
            </p>
          </article>

          <article>
            <svg viewBox="0 0 260 220" aria-hidden>
              <GlowDefs id="e3" />
              {[
                [236, 38, LAYER[3]],
                [248, 112, LAYER[4]],
                [228, 188, LAYER[5]],
              ].map(([x, y, c]) => (
                <g key={c as string}>
                  <Link2 id="e3" d={arc(110, 110, 64, x as number, y as number, 12)} c={c as string} dur={2.8} />
                  <Node id="e3" x={x as number} y={y as number} c={c as string} s={5} />
                </g>
              ))}
              <GlassCore id="e3" cx={110} cy={110} r={64} />
              <WireForm cx={110} cy={110} r={64} opacity={0.35} />
              <LayerRings id="e3" cx={110} cy={110} r={64} />
            </svg>
            <div className="ds-evo-step">
              <span>03</span>Инструменты исполнения
            </div>
            <p className="ds-body ds-muted">
              Среда вышла за&nbsp;пределы проектирования: соединяет инженерную работу, производства и&nbsp;площадку.
            </p>
          </article>
        </Reveal>

        <Reveal className="ds-quote">
          <p className="ds-lead">
            Мы развиваем среду от&nbsp;проекта к&nbsp;проекту: уточняем методы, дополняем базу решений, автоматизируем
            повторяющуюся работу.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────── 07 · Информация возвращается ─────────────── */

const LOOP_R = 168;
const LOOP = { cx: 280, cy: 228 };
const outPath = `M${LOOP.cx} ${LOOP.cy - LOOP_R} A${LOOP_R} ${LOOP_R} 0 0 1 ${LOOP.cx} ${LOOP.cy + LOOP_R}`;
const backPath = `M${LOOP.cx} ${LOOP.cy + LOOP_R} A${LOOP_R} ${LOOP_R} 0 0 1 ${LOOP.cx} ${LOOP.cy - LOOP_R}`;

export function DsFeedback() {
  return (
    <section className="ds-section ds-a">
      <div className="container-x">
        <Reveal>
          <SectionHead index="07" kicker="Информация возвращается" theme="dark" />
        </Reveal>
        <div className="ds-split">
          <Reveal>
            <p className="ds-lead">
              Модель не&nbsp;заканчивается на&nbsp;чертежах. Факт с&nbsp;площадки возвращается в&nbsp;ядро.
            </p>
            <p className="ds-body ds-muted mt-6 max-w-[520px]">
              Монтаж идёт по&nbsp;схемам и&nbsp;данным модели. Всё, что выясняется на&nbsp;объекте, попадает обратно
              и&nbsp;затрагивает связанные элементы — решения обновляются вовремя, а&nbsp;не&nbsp;после переделок.
            </p>
            <div className="ds-list">
              {[
                ["Обмеры", "Фактическое основание уточняет геометрию модели."],
                ["Статусы", "Что изготовлено, доставлено и смонтировано — видно в одной системе."],
                ["Уточнения", "Изменения с площадки сразу связываются с заданиями и элементами."],
              ].map(([t, d]) => (
                <div key={t}>
                  <b>{t}</b>
                  <span className="ds-body ds-muted">{d}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="ds-figure ds-figure--bare">
            <svg viewBox="0 0 560 460" role="img" aria-label="Цикл: модель — задания — площадка — факт — снова модель">
              <GlowDefs id="lp" />
              <circle cx={LOOP.cx} cy={LOOP.cy} r={LOOP_R} fill="none" stroke="rgba(255,255,255,0.06)" />
              <path d={outPath} fill="none" stroke={ORANGE} strokeOpacity="0.55" strokeWidth="1.4" filter="url(#lp-glow)" />
              <path d={backPath} fill="none" stroke={GREEN} strokeOpacity="0.55" strokeWidth="1.4" filter="url(#lp-glow)" />
              <g filter="url(#lp-glow)">
                {[0, 1, 2, 3].map((k) => (
                  <circle key={`o${k}`} r="3.2" fill={ORANGE}>
                    <animateMotion dur="4.4s" begin={`${-k * 1.1}s`} repeatCount="indefinite" path={outPath} />
                  </circle>
                ))}
                {[0, 1, 2, 3].map((k) => (
                  <circle key={`g${k}`} r="3.2" fill={GREEN}>
                    <animateMotion dur="4.4s" begin={`${-k * 1.1}s`} repeatCount="indefinite" path={backPath} />
                  </circle>
                ))}
              </g>
              <GlassCore id="lp" cx={LOOP.cx} cy={LOOP.cy} r={78} />
              <WireForm cx={LOOP.cx} cy={LOOP.cy} r={78} opacity={0.3} />
              <LayerRings id="lp" cx={LOOP.cx} cy={LOOP.cy} r={78} />
              <Spine id="lp" cx={LOOP.cx} cy={LOOP.cy} r={78} />
              <Node id="lp" x={LOOP.cx} y={LOOP.cy - LOOP_R} c={ORANGE} />
              <Node id="lp" x={LOOP.cx + LOOP_R} y={LOOP.cy} c={ORANGE} />
              <Node id="lp" x={LOOP.cx} y={LOOP.cy + LOOP_R} c={GREEN} />
              <Node id="lp" x={LOOP.cx - LOOP_R} y={LOOP.cy} c={GREEN} />
              <Tag x={LOOP.cx} y={LOOP.cy - LOOP_R - 26} text="Модель" c={ORANGE} />
              <Tag x={LOOP.cx + LOOP_R + 16} y={LOOP.cy} text="Задания" c={ORANGE} anchor="start" />
              <Tag x={LOOP.cx} y={LOOP.cy + LOOP_R + 26} text="Площадка" c={GREEN} />
              <Tag x={LOOP.cx - LOOP_R - 16} y={LOOP.cy} text="Факт" c={GREEN} anchor="end" />
            </svg>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── 08 · Что это даёт ─────────────── */

function BenefitIcon({ i }: { i: number }) {
  const id = `bf${i}`;
  return (
    <svg viewBox="0 0 120 90" aria-hidden className="ds-benefit-icon">
      <GlowDefs id={id} />
      {i === 2 &&
        [
          [104, 18, LAYER[3]],
          [110, 45, LAYER[4]],
          [104, 72, LAYER[5]],
        ].map(([x, y, c]) => <Link2 key={c as string} id={id} d={arc(46, 45, 30, x as number, y as number, 6)} c={c as string} back={false} dur={2.4} />)}
      {i === 3 && (
        <path d="M86 70 A40 40 0 1 1 92 30" fill="none" stroke={GREEN} strokeWidth="1.6" filter={`url(#${id}-glow)`} strokeDasharray="3 5" className="ds-flow" />
      )}
      <GlassCore id={id} cx={i === 2 ? 46 : 60} cy={45} r={30} warm={0.7} />
      {i === 0 && <WireForm cx={60} cy={45} r={30} opacity={0.7} />}
      {i === 1 && <Spine id={id} cx={60} cy={45} r={30} levels={3} />}
      {i >= 2 && <LayerRings id={id} cx={i === 2 ? 46 : 60} cy={45} r={30} count={6} spin={false} />}
    </svg>
  );
}

const BENEFITS = [
  ["Замысел сохраняется", "Архитектурная идея не теряется при передаче между участниками: все работают с одной моделью."],
  ["Решения проверены до изготовления", "Узлы, расчёты и способ сборки подтверждаются в модели и на mockup — до серийного производства."],
  ["Исполнители работают согласованно", "Производства, логистика и монтаж получают связанные задания и возвращают статусы в общую систему."],
  ["Проект связан с фактом", "Обмеры и уточнения с площадки возвращаются в модель, и связанные решения обновляются вовремя."],
];

export function DsBenefits() {
  return (
    <section className="ds-section ds-b">
      <div className="container-x">
        <Reveal>
          <SectionHead index="08" kicker="Что это даёт заказчику" theme="dark" />
        </Reveal>
        <Reveal className="ds-benefits reveal-stagger">
          {BENEFITS.map(([t, d], i) => (
            <article key={t} className="ds-benefit">
              <div className="flex items-start justify-between">
                <span className="ds-benefit-n">{String(i + 1).padStart(2, "0")}</span>
                <BenefitIcon i={i} />
              </div>
              <h3>{t}</h3>
              <p className="ds-body ds-muted">{d}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────── Финал: светлое ядро, как в конце 3D-истории ─────────────── */

export function DsFinal() {
  return (
    <section className="ds-final">
      <div className="container-x ds-final-grid">
        <Reveal>
          <div className="eyebrow text-orange">Цифровое ядро STRUKTURA</div>
          <h2 className="ds-final-title">
            Связываем сложные решения и&nbsp;<span className="text-orange">реализуем их&nbsp;на&nbsp;объекте</span>
          </h2>
          <p className="ds-lead ds-muted mt-8 max-w-[560px]">
            Цифровая среда — одна из&nbsp;основ STRUKTURA. Расскажем, как она будет работать на&nbsp;вашем проекте.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#contact" className="btn btn-orange">
              Обсудить проект
            </a>
            <Link href="/subsystems" className="btn btn-ghost-dark">
              Подсистемы
            </Link>
            <Link href="/ipd" className="btn btn-ghost-dark">
              Принципы IPD
            </Link>
          </div>
        </Reveal>

        <Reveal className="ds-pearl">
          <svg viewBox="0 0 520 520" aria-hidden>
            <GlowDefs id="fn" />
            <circle cx="260" cy="260" r="200" fill={ORANGE} opacity="0.35" filter="url(#fn-halo)" />
            {/* участники на орбите вокруг собранного ядра */}
            <g transform="rotate(-8 260 260)">
              <ellipse cx="260" cy="260" rx="220" ry="70" fill="none" stroke="rgba(255,255,255,0.12)" strokeDasharray="2 6" />
              <g filter="url(#fn-glow)">
                {[0, 1, 2, 3, 4, 5, 6].map((k) => (
                  <circle key={k} r="4" fill={LAYER[k % LAYER.length]}>
                    <animateMotion dur="28s" begin={`${-k * 4}s`} repeatCount="indefinite" path="M40 260 A220 70 0 1 1 480 260 A220 70 0 1 1 40 260" />
                  </circle>
                ))}
              </g>
            </g>
            <circle cx="260" cy="260" r="160" fill="url(#fn-pearl)" />
            <circle cx="260" cy="260" r="172" fill="none" stroke={ORANGE} strokeWidth="2" filter="url(#fn-glow)" />
            <text x="260" y="268" textAnchor="middle" className="ds-pearl-word">
              STRUKTURA
              <tspan className="ds-pearl-plus" dy="-14">
                +
              </tspan>
            </text>
            <text x="260" y="300" textAnchor="middle" className="ds-pearl-sub">
              Цифровое ядро
            </text>
          </svg>
        </Reveal>
      </div>
    </section>
  );
}
