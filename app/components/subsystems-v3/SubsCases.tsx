import Link from "next/link";
import type { ReactNode } from "react";
import SectionHead from "../SectionHead";
import { Lead, Reveal } from "./shared";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Цифровой фрагмент — чертёж или модель из рабочей документации, стилизованные под тёмную
 * карточку: линии светлые на прозрачном фоне, главная несущая конструкция — оранжевая.
 */
function FragScheme({ src, alt, scale = 1 }: { src: string; alt: string; /** доля ширины панели */ scale?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${basePath}${src}`}
      alt={alt}
      loading="lazy"
      className="mx-auto block h-auto"
      style={{ width: `${scale * 100}%` }}
    />
  );
}

/** Заглушка: тонкая инженерная сетка с подписью — пока нет фото или чертежа объекта. */
function Placeholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-coal-deep ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        backgroundPosition: "center",
      }}
    >
      <span className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
        <span className="h-1.5 w-1.5 bg-orange/60" />
        {label}
      </span>
    </div>
  );
}

type Case = {
  name: string;
  /** Тип работы — подпись над названием; выводится, когда известна */
  work?: string;
  year?: string;
  /** Фото объекта; без него — заглушка */
  image?: string;
  summary?: string;
  facts?: { label: string; value: string }[];
  href?: string;
  /** Цифровой фрагмент (чертёж, схема); без него — заглушка */
  fragment?: ReactNode;
  fragmentLabel?: string;
  /** Фрагмент — изображение во всю ширину панели, без полей и фиксированной пропорции */
  fragmentBleed?: boolean;
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
    fragment: (
      <FragScheme
        src="/projects/sber-kozyrek-scheme.webp"
        alt="Общий вид конструкций козырька: верхний и нижний ряды сэндвич-панелей, несущая балка"
      />
    ),
    fragmentLabel: "Общий вид козырька",
    fragmentBleed: true,
  },
  // Ниже — фото, чертежи и описания добавить по материалам компании; пока выводятся заглушки.
  {
    name: "Матрёшка",
    fragment: (
      <FragScheme
        src="/projects/matreshka-scheme.webp"
        scale={0.84}
        alt="Матрёшка: общий вид подсистемы — ламели облицовки, несущий каркас и криволинейная балка"
      />
    ),
    fragmentLabel: "Общий вид подсистемы",
    fragmentBleed: true,
  },
  {
    name: "Акустический зал",
    fragment: (
      <FragScheme
        src="/projects/acoustic-hall-scheme.webp"
        scale={0.84}
        alt="Акустический зал: несущий каркас подвесного потолка с главными балками и оболочка облицовки"
      />
    ),
    fragmentLabel: "Общий вид подсистемы",
    fragmentBleed: true,
  },
  // Тип работы и год — из раздела «Проекты» (projects/[slug], «02»)
  {
    name: "Лахта Центр",
    work: "Арка главного входа",
    year: "2022",
    fragment: (
      <FragScheme
        src="/projects/lakhta-arch-scheme.webp"
        scale={0.84}
        alt="Лахта Центр, арка главного входа: подсистема свода — каркас, узлы крепления и панели облицовки"
      />
    ),
    fragmentLabel: "Общий вид подсистемы",
    fragmentBleed: true,
  },
  {
    name: "Призма",
    fragment: (
      <FragScheme
        src="/projects/prism-scheme.webp"
        scale={0.84}
        alt="Призма: общий вид подсистемы — вертикальный каркас, ригели и закладные"
      />
    ),
    fragmentLabel: "Общий вид подсистемы",
    fragmentBleed: true,
  },
];

function CaseBody({ c, i }: { c: Case; i: number }) {
  return (
    <>
      <div className="relative aspect-[16/11] overflow-hidden lg:aspect-auto lg:min-h-[520px]">
        {c.image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${basePath}${c.image}`}
              alt={c.work ? `${c.name} — ${c.work}` : c.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.04]"
              style={{ transitionTimingFunction: "var(--ease-out)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </>
        ) : (
          <Placeholder label="Фото объекта" className="absolute inset-0" />
        )}
        <span className="absolute bottom-5 left-5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/85">
          {String(i + 1).padStart(2, "0")}
          {c.year && ` · ${c.year}`}
        </span>
      </div>
      <div className="flex flex-col p-6 md:p-10">
        {c.work && <span className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-orange">{c.work}</span>}
        <h3 className="text-[clamp(26px,2.6vw,42px)] leading-[1]">{c.name}</h3>
        {c.summary && <p className="mt-5 font-body text-[15px] leading-[1.6] text-white/65">{c.summary}</p>}

        {/* фрагмент занимает всю свободную высоту панели — чертёж центрируется по вертикали */}
        <figure className="mt-8 flex flex-1 flex-col">
          <figcaption className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/45">
            <span className="h-1.5 w-1.5 shrink-0 bg-orange" />
            <span className="whitespace-nowrap">Цифровой фрагмент</span>
            <span className="h-px flex-1 bg-white/12" />
            {c.fragmentLabel && <span className="whitespace-nowrap text-right">{c.fragmentLabel}</span>}
          </figcaption>
          {!c.fragment ? (
            <Placeholder label="Чертёж объекта" className="-mx-6 mt-4 aspect-[16/10] md:-mx-10" />
          ) : c.fragmentBleed ? (
            <div className="-mx-6 mt-4 flex flex-1 items-center md:-mx-10">
              <div className="w-full">{c.fragment}</div>
            </div>
          ) : (
            <div className="aspect-[2/1] py-4">{c.fragment}</div>
          )}
        </figure>

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
