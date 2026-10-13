import Link from "next/link";
import type { ReactNode } from "react";
import SectionHead from "../SectionHead";
import { Lead, Reveal } from "./shared";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const O = "#ff5a00";

/** Цифровой фрагмент: триангулированный купол. */
function FragDome() {
  const rows = 6;
  const tris: string[] = [];
  for (let r = 0; r < rows; r++) {
    const y0 = 20 + r * 18;
    const y1 = y0 + 18;
    const w0 = 30 + r * 20;
    const w1 = 30 + (r + 1) * 20;
    const n = 4 + r * 2;
    for (let i = 0; i < n; i++) {
      const xa = 150 - w0 + (i / n) * w0 * 2;
      const xb = 150 - w0 + ((i + 1) / n) * w0 * 2;
      const xc = 150 - w1 + ((i + 0.5) / n) * w1 * 2;
      tris.push(`M${xa} ${y0} L${xb} ${y0} L${xc} ${y1} Z`);
    }
  }
  return (
    <svg viewBox="0 0 300 150" className="h-full w-full">
      {tris.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={i % 7 === 3 ? O : "none"}
          fillOpacity=".85"
          stroke="rgba(255,255,255,.45)"
          strokeWidth=".7"
          className={i % 7 === 3 ? "sv3-blink" : undefined}
          style={{ animationDelay: `${(i % 5) * 0.3}s` }}
        />
      ))}
    </svg>
  );
}

/** Цифровой фрагмент: панно из пластин под разными углами. */
function FragPlates() {
  return (
    <svg viewBox="0 0 300 150" className="h-full w-full">
      {Array.from({ length: 12 * 22 }, (_, k) => {
        const i = k % 22;
        const j = Math.floor(k / 22);
        const a = Math.sin(i * 0.45 + j * 0.7) * Math.cos(j * 0.3 - i * 0.2);
        const h = 8 * Math.abs(a) + 1.5;
        return (
          <rect
            key={k}
            x={12 + i * 12.6}
            y={14 + j * 10.5 + (8 - h) / 2}
            width="9"
            height={h}
            fill={a > 0.7 ? O : "rgba(255,255,255,.55)"}
            opacity={0.35 + Math.abs(a) * 0.65}
          />
        );
      })}
    </svg>
  );
}

/** Цифровой фрагмент: волновой потолок из рёбер. */
function FragRibs() {
  return (
    <svg viewBox="0 0 300 150" className="h-full w-full">
      {Array.from({ length: 14 }, (_, i) => (
        <path
          key={i}
          d={`M10 ${30 + i * 7} C 80 ${10 + i * 9 + Math.sin(i) * 14} 200 ${70 + i * 3 - Math.cos(i) * 18} 290 ${24 + i * 8}`}
          fill="none"
          stroke={i === 8 ? O : "rgba(255,255,255,.5)"}
          strokeWidth={i === 8 ? 2 : 1}
        />
      ))}
    </svg>
  );
}

type Case = {
  name: string;
  work: string;
  year: string;
  image: string;
  summary?: string;
  facts?: { label: string; value: string }[];
  href?: string;
  fragment: ReactNode;
  fragmentLabel: string;
  /** Сложность / решение / роль STRUKTURA — добавить по материалам компании; выводится, когда заполнено */
  story?: { challenge: string; solution: string; role: string };
};

// Объекты и факты — из casesData.ts (раздел «Проекты»).
const cases: Case[] = [
  {
    name: "Сбербанк-Сити",
    work: "Межбашенное пространство",
    year: "2022",
    image: "/projects/37785448.jpg",
    summary: "Купол, объединяющий две башни штаб-квартиры в единый образ, — первая конструкция такого масштаба в России.",
    facts: [
      { label: "Архитектор", value: "Evolution Design" },
      { label: "Производство", value: "Макрофабрика" },
    ],
    href: "/projects/mezhbashennoye-prostranstvo",
    fragment: <FragDome />,
    fragmentLabel: "Триангуляция оболочки",
  },
  {
    name: "Moscow Towers",
    work: "Художественное панно из металлических пластин",
    year: "2024",
    image: "/projects/68362468.jpg",
    fragment: <FragPlates />,
    fragmentLabel: "Поле углов пластин",
  },
  {
    name: "Штаб-квартира крупного банка",
    work: "Арт-потолок",
    year: "2020",
    image: "/projects/14200012.jpg",
    fragment: <FragRibs />,
    fragmentLabel: "Семейство рёбер",
  },
];

function CaseBody({ c, i }: { c: Case; i: number }) {
  return (
    <>
      <div className="relative aspect-[16/11] overflow-hidden lg:aspect-auto lg:min-h-[520px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${basePath}${c.image}`}
          alt={`${c.name} — ${c.work}`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.04]"
          style={{ transitionTimingFunction: "var(--ease-out)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className="absolute bottom-5 left-5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/85">
          {String(i + 1).padStart(2, "0")} · {c.year}
        </span>
      </div>
      <div className="flex flex-col p-6 md:p-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-orange">{c.work}</span>
        <h3 className="mt-4 text-[clamp(26px,2.6vw,42px)] leading-[1]">{c.name}</h3>
        {c.summary && <p className="mt-5 font-body text-[15px] leading-[1.6] text-white/65">{c.summary}</p>}

        <div className="mt-8 border border-white/12 bg-coal-deep">
          <div className="aspect-[2/1] p-3">{c.fragment}</div>
          <div className="flex items-center justify-between border-t border-white/12 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/45">
            <span>Цифровой фрагмент</span>
            <span>{c.fragmentLabel}</span>
          </div>
        </div>

        {c.story && (
          <dl className="mt-6">
            {(
              [
                ["Сложность", c.story.challenge],
                ["Решение", c.story.solution],
                ["Роль STRUKTURA", c.story.role],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[120px_1fr] gap-4 border-t border-white/12 py-3">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">{k}</dt>
                <dd className="font-body text-[14px] text-white/75">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-auto flex flex-wrap items-end justify-between gap-6 pt-8">
          {c.facts && (
            <dl className="flex flex-wrap gap-x-8 gap-y-3">
              {c.facts.map((f) => (
                <div key={f.label}>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">{f.label}</dt>
                  <dd className="mt-1 font-body text-[14px]">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {c.href && (
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/70 transition-colors group-hover:text-orange">
              Смотреть кейс →
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export default function SubsCases() {
  return (
    <section id="cases" className="py-20 md:py-32">
      <div className="container-x">
        <SectionHead index="07" kicker="Кейсы и цифровые фрагменты" />
        <Lead>Реализованный объект и его цифровая логика: как технология, описанная выше, работает в архитектуре.</Lead>

        <div className="flex flex-col gap-6 md:gap-8">
          {cases.map((c, i) => {
            const cls = `group grid overflow-hidden bg-coal text-white ${i % 2 ? "lg:grid-cols-[0.75fr_1.25fr] lg:[&>*:first-child]:order-2" : "lg:grid-cols-[1.25fr_0.75fr]"}`;
            return (
              <Reveal key={c.name}>
                {c.href ? (
                  <Link href={c.href} className={cls}>
                    <CaseBody c={c} i={i} />
                  </Link>
                ) : (
                  <div className={cls}>
                    <CaseBody c={c} i={i} />
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
