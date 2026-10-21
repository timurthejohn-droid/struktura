"use client";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import SectionHead from "./SectionHead";
import { useReveal } from "./useReveal";
// Голограмма (./digital/HeroHologram, layout="card") заменена шаром из точек — без свечения, в стиле айдентики.
import DotSphere from "./DotSphere";

/**
 * «Формула STRUKTURA+» — алгоритмический подход, цифровая среда и IPD одним блоком.
 * Три основы видны сразу; каждая карточка ведёт на свою страницу.
 * Визуал — из прежних блоков главной: оранжевый с диагоналями, голограмма-сфера, светлая сетка IPD.
 */

// Схема принципов — та же геометрия, что на /approach (ApproachVenn): R 200, смещение 145.
const VR = 200;
const VD = 145;
const TIP = 137.75; // острия «звезды» — область пересечения минимум трёх кругов
const COR = 48.92; // её «талия»
const vennCircles = [
  { label: "Детерминированность", cx: 500, cy: 500 - VD, lx: 500, ly: 236 },
  { label: "Конечность", cx: 500 + VD, cy: 500, lx: 742, ly: 508 },
  { label: "Массовость", cx: 500, cy: 500 + VD, lx: 500, ly: 780 },
  { label: "Дискретность", cx: 500 - VD, cy: 500, lx: 258, ly: 508 },
];
const STAR = [
  `M 500 ${500 - TIP}`,
  `A ${VR} ${VR} 0 0 1 ${500 + COR} ${500 - COR}`,
  `A ${VR} ${VR} 0 0 1 ${500 + TIP} 500`,
  `A ${VR} ${VR} 0 0 1 ${500 + COR} ${500 + COR}`,
  `A ${VR} ${VR} 0 0 1 500 ${500 + TIP}`,
  `A ${VR} ${VR} 0 0 1 ${500 - COR} ${500 + COR}`,
  `A ${VR} ${VR} 0 0 1 ${500 - TIP} 500`,
  `A ${VR} ${VR} 0 0 1 ${500 - COR} ${500 - COR}`,
  `A ${VR} ${VR} 0 0 1 500 ${500 - TIP}`,
  "Z",
].join(" ");

/** 4 принципа кругами; при наведении на карточку обводится пересечение и в центре появляется «+». */
function AlgoVenn() {
  return (
    <svg viewBox="140 140 720 720" className="mx-auto aspect-square h-auto w-full max-w-[min(380px,42svh)]" aria-label="Принципы: дискретность, детерминированность, конечность, массовость">
      {vennCircles.map((c) => (
        <circle key={c.label} cx={c.cx} cy={c.cy} r={VR} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={1.4} />
      ))}
      <path d={STAR} pathLength={1} className="formula-star" fill="rgba(255,255,255,0.12)" stroke="#fff" strokeWidth={3} strokeLinejoin="round" />
      <g className="formula-cross" stroke="#fff" strokeWidth={6}>
        <line x1={500} y1={474} x2={500} y2={526} />
        <line x1={474} y1={500} x2={526} y2={500} />
      </g>
      {vennCircles.map((c) => (
        <text
          key={`${c.label}-t`}
          x={c.lx}
          y={c.ly}
          textAnchor="middle"
          fontFamily="'CoFo Sans Mono', monospace"
          fontSize={23}
          letterSpacing={0.5}
          fill="#fff"
        >
          {c.label}
        </text>
      ))}
    </svg>
  );
}

const ipdNodes = [
  { label: "Заказчик", x: 50, y: 12 },
  { label: "Архитектор", x: 88, y: 34 },
  { label: "Инженеры", x: 88, y: 74 },
  { label: "Производство", x: 50, y: 94 },
  { label: "Логистика", x: 12, y: 74 },
  { label: "Монтаж", x: 12, y: 34 },
];

/**
 * Кнопка внизу карточки слева: в покое — квадрат со стрелкой; при наведении на карточку
 * стрелка уезжает вправо и открывает «Подробнее».
 * На мобильном наведения нет — там она раскрыта всегда.
 */
function MoreButton({ tone }: { tone: "white" | "ink" | "orange" }) {
  // Классы целиком строками — Tailwind не видит собранные на лету.
  // < lg: всегда залита; lg: в покое контур, при наведении — заливка.
  const c = {
    white: {
      box: "border-white bg-white text-orange lg:border-white/45 lg:bg-transparent lg:text-white lg:group-hover:border-white lg:group-hover:bg-white lg:group-hover:text-orange lg:group-focus-visible:border-white lg:group-focus-visible:bg-white lg:group-focus-visible:text-orange",
      sep: "bg-orange/25",
    },
    orange: {
      box: "border-orange bg-orange text-white lg:border-white/30 lg:bg-transparent lg:group-hover:border-orange lg:group-hover:bg-orange lg:group-focus-visible:border-orange lg:group-focus-visible:bg-orange",
      sep: "bg-white/30",
    },
    ink: {
      box: "border-orange bg-orange text-white lg:border-black/25 lg:bg-transparent lg:text-ink lg:group-hover:border-orange lg:group-hover:bg-orange lg:group-hover:text-white lg:group-focus-visible:border-orange lg:group-focus-visible:bg-orange lg:group-focus-visible:text-white",
      sep: "bg-white/30",
    },
  }[tone];
  return (
    <span
      aria-hidden
      className={`inline-flex h-12 shrink-0 items-stretch overflow-hidden border transition-colors duration-300 ${c.box}`}
    >
      <span
        className="flex max-w-[220px] items-center whitespace-nowrap px-5 font-mono text-[11px] uppercase tracking-[0.18em] opacity-100 transition-[max-width,padding,opacity] duration-500 [transition-timing-function:var(--ease-out)] lg:max-w-0 lg:px-0 lg:opacity-0 lg:group-hover:max-w-[220px] lg:group-hover:px-5 lg:group-hover:opacity-100 lg:group-focus-visible:max-w-[220px] lg:group-focus-visible:px-5 lg:group-focus-visible:opacity-100"
      >
        Подробнее
      </span>
      <span className={`w-px self-stretch ${c.sep} lg:opacity-0 lg:transition-opacity lg:duration-300 lg:group-hover:opacity-100`} />
      <span className="flex w-12 items-center justify-center text-[18px]">
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
      </span>
    </span>
  );
}

function Card({
  href,
  n,
  role,
  title,
  body,
  className,
  tone,
  visual,
  overlay,
}: {
  href: string;
  n: string;
  role: string;
  title: string;
  body: string;
  className: string;
  tone: "white" | "ink" | "orange";
  visual: ReactNode;
  overlay?: ReactNode;
}) {
  const dark = tone !== "ink";
  return (
    <Link
      href={href}
      className={`group relative flex min-h-[560px] flex-col overflow-hidden p-7 transition-transform duration-500 [transition-timing-function:var(--ease-out)] hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange md:p-9 lg:min-h-[clamp(640px,calc(100svh-120px),1040px)] ${className}`}
    >
      {overlay}
      <div className="relative z-10">
        <span className={`font-mono text-[12px] uppercase tracking-[0.16em] ${dark ? "text-white/75" : "text-ink/55"}`}>
          <span className={tone === "white" ? "text-white" : "text-orange"}>{n}</span> · {role}
        </span>
      </div>

      <div className="relative z-10 flex flex-1 items-center py-8">{visual}</div>

      <div className="relative z-10">
        <h3
          className={`font-mono uppercase ${dark ? "text-white" : "text-ink"}`}
          style={{ fontSize: "clamp(24px, 2.1vw, 34px)", lineHeight: 1.02, letterSpacing: "-0.005em" }}
        >
          {title}
        </h3>
        <p
          className={`mt-4 max-w-[400px] font-body lg:min-h-[6.2em] ${dark ? "text-white/75" : "text-ink-soft"}`}
          style={{ fontSize: "clamp(15px, 1.05vw, 17px)", lineHeight: 1.55 }}
        >
          {body}
        </p>
        <div className="mt-8 flex">
          <MoreButton tone={tone} />
        </div>
      </div>
    </Link>
  );
}

function Plus({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`z-20 flex h-12 w-12 items-center justify-center bg-ink font-mono text-[26px] leading-none text-orange ${className}`}
    >
      +
    </span>
  );
}

export default function FormulaBlock() {
  const ref = useReveal(0.1);

  return (
    <section id="formula" className="relative overflow-hidden bg-paper py-24 md:py-36">
      <div className="container-x">
        <SectionHead index="06 · Решение" kicker="Формула STRUKTURA" theme="light" />

        <div ref={ref} className="reveal">
          <p className="max-w-[860px] font-body text-ink" style={{ fontSize: "clamp(19px, 1.8vw, 28px)", lineHeight: 1.38 }}>
            Метод, среда и&nbsp;управление работают как единая система, обеспечивая
            предсказуемый результат, контроль сроков и&nbsp;бюджета на&nbsp;каждом этапе проекта.
          </p>

          {/* Карточки: на десктопе в ряд, «+» на стыках; на мобильном — столбиком */}
          <div className="relative mt-14 flex flex-col items-stretch gap-3 md:mt-20 lg:grid lg:grid-cols-3">
            {/* 01 · Алгоритмический подход — оранжевый, диагонали */}
            <Card
              href="/approach"
              n="01"
              role="Метод"
              title="Алгоритмический подход"
              body="Собственная методология цифровизации всех этапов: точная последовательность действий, которая приводит к предсказуемому результату."
              tone="white"
              className="bg-orange"
              overlay={
                <span
                  aria-hidden
                  className="formula-stripes pointer-events-none absolute inset-0 opacity-[0.09]"
                />
              }
              visual={<AlgoVenn />}
            />

            <Plus className="self-center lg:hidden" />

            {/* 02 · Цифровая среда — голограмма-сфера на тёмном */}
            <Card
              href="/digital"
              n="02"
              role="Среда"
              title="Цифровая среда STRUKTURA+"
              body="Связывает все этапы в одну систему: данные передаются без потерь, а каждый процесс работает на общий результат."
              tone="orange"
              className="bg-coal"
              overlay={
                <>
                  {/* при наведении на карточку шар плавно укрупняется */}
                  <div className="absolute inset-0 origin-[50%_35.5%] transition-transform duration-700 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.07] group-focus-visible:scale-[1.07] motion-reduce:transition-none">
                    <DotSphere />
                  </div>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-coal via-coal/85 to-transparent"
                  />
                </>
              }
              visual={<span className="block h-[220px] lg:h-[280px]" />}
            />

            <Plus className="self-center lg:hidden" />

            {/* 03 · IPD — светлая карточка, сетка, все участники в одной системе */}
            <Card
              href="/ipd"
              n="03"
              role="Управление"
              title="IPD — единая система реализации"
              body="Одна команда, одна цифровая модель, одна ответственность — от проектирования до монтажа, без эстафеты и потерь между стадиями."
              tone="ink"
              className="border border-black/10 bg-white"
              overlay={<span aria-hidden className="formula-grid pointer-events-none absolute inset-0" />}
              visual={
                <svg viewBox="0 0 100 106" className="mx-auto h-[230px] w-full max-w-[300px] overflow-visible lg:h-[270px]" aria-hidden>
                  {/* эстафета: пунктир по кругу */}
                  <polygon
                    points={ipdNodes.map((n) => `${n.x},${n.y}`).join(" ")}
                    fill="none"
                    strokeWidth="0.4"
                    strokeDasharray="1.5 1.5"
                    className="formula-ipd-ring"
                  />
                  {/* единая система: все связаны с центром */}
                  {ipdNodes.map((n, i) => (
                    <line
                      key={n.label}
                      x1="50"
                      y1="53"
                      x2={n.x}
                      y2={n.y}
                      strokeWidth="0.6"
                      className="formula-spoke"
                      style={{ animationDelay: `${i * 0.12}s`, "--i": i } as CSSProperties}
                    />
                  ))}
                  <rect x="44" y="47" width="12" height="12" strokeWidth="0.6" className="formula-ipd-center" />
                  {ipdNodes.map((n, i) => (
                    <g key={`${n.label}-node`}>
                      <rect
                        x={n.x - 2}
                        y={n.y - 2}
                        width="4"
                        height="4"
                        strokeWidth="0.5"
                        className="formula-ipd-node"
                        style={{ "--i": i } as CSSProperties}
                      />
                      <text
                        x={n.x}
                        y={n.y + (n.y < 50 ? -4.5 : 7.5)}
                        textAnchor="middle"
                        fontFamily="CoFo Sans Mono, monospace"
                        fontSize="3.4"
                        fill="rgba(26,26,26,0.6)"
                        letterSpacing="0.2"
                      >
                        {n.label.toUpperCase()}
                      </text>
                    </g>
                  ))}
                </svg>
              }
            />

            {/* «+» на стыках карточек (десктоп) */}
            <Plus className="absolute left-[calc((100%-24px)/3+6px)] top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:flex" />
            <Plus className="absolute left-[calc((100%-24px)*2/3+18px)] top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:flex" />
          </div>

        </div>
      </div>

      <style jsx global>{`
        #formula .formula-stripes {
          background-image: repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 30px);
          background-size: 42.43px 42.43px;
          transition: background-position 1.2s var(--ease-out);
        }
        #formula a:hover .formula-stripes {
          background-position: 42.43px 0;
        }
        #formula .formula-star {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          fill-opacity: 0;
          transition:
            stroke-dashoffset 0.9s var(--ease-out),
            fill-opacity 0.5s var(--ease-out);
        }
        #formula .formula-cross {
          opacity: 0;
          transform: scale(0.4) rotate(-45deg);
          transform-box: fill-box;
          transform-origin: center;
          transition:
            opacity 0.35s var(--ease-out),
            transform 0.5s var(--ease-out);
        }
        #formula a:hover .formula-star,
        #formula a:focus-visible .formula-star {
          stroke-dashoffset: 0;
          fill-opacity: 1;
        }
        #formula a:hover .formula-cross,
        #formula a:focus-visible .formula-cross {
          opacity: 1;
          transform: scale(1) rotate(0deg);
          transition-delay: 0.35s;
        }
        #formula .formula-grid {
          background-image:
            linear-gradient(rgba(0, 0, 0, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.06) 1px, transparent 1px);
          background-size: 36px 36px;
          mask-image: radial-gradient(90% 70% at 50% 45%, #000 0%, transparent 85%);
          -webkit-mask-image: radial-gradient(90% 70% at 50% 45%, #000 0%, transparent 85%);
        }
        /* IPD: в покое схема монохромная; при наведении центр заливается оранжевым,
           от него по очереди окрашиваются связи, участники и контур по кругу */
        #formula .formula-ipd-center {
          fill: #fff;
          stroke: #1a1a1a;
          transition: fill 0.35s var(--ease-out), stroke 0.35s var(--ease-out);
        }
        #formula .formula-ipd-node {
          fill: #fff;
          stroke: #1a1a1a;
          transition: fill 0.3s var(--ease-out), stroke 0.3s var(--ease-out);
        }
        #formula .formula-ipd-ring {
          stroke: rgba(26, 26, 26, 0.18);
          transition: stroke 0.4s var(--ease-out);
        }
        #formula a:hover .formula-ipd-center,
        #formula a:focus-visible .formula-ipd-center {
          fill: #ff5a00;
          stroke: #ff5a00;
        }
        #formula a:hover .formula-spoke,
        #formula a:focus-visible .formula-spoke {
          stroke: #ff5a00;
          transition-delay: calc(0.15s + var(--i) * 0.06s);
        }
        #formula a:hover .formula-ipd-node,
        #formula a:focus-visible .formula-ipd-node {
          fill: #ff5a00;
          stroke: #ff5a00;
          transition-delay: calc(0.3s + var(--i) * 0.06s);
        }
        #formula a:hover .formula-ipd-ring,
        #formula a:focus-visible .formula-ipd-ring {
          stroke: rgba(255, 90, 0, 0.75);
          transition-delay: 0.6s;
        }
        #formula .formula-spoke {
          stroke: rgba(26, 26, 26, 0.28);
          transition: stroke 0.35s var(--ease-out);
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: formula-spoke 1.4s var(--ease-out) forwards;
          animation-play-state: paused;
        }
        #formula .visible .formula-spoke {
          animation-play-state: running;
        }
        @keyframes formula-spoke {
          to {
            stroke-dashoffset: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #formula .formula-spoke {
            animation: none;
            stroke-dashoffset: 0;
          }
          #formula .formula-stripes,
          #formula .formula-star,
          #formula .formula-cross,
          #formula .formula-ipd-center,
          #formula .formula-ipd-node,
          #formula .formula-ipd-ring,
          #formula .formula-spoke {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
