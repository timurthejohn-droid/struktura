"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import Reveal from "../materials/Reveal";
import More from "../about-story/More";
import { Photo, SubsystemVisual } from "../about-story/StoryTimeline";
import type { StoryMore } from "../about-story/storyData";
import { growthStats, growthYears, type GrowthProject, type GrowthYear } from "./growthData";

/* ───────────── Чередование: годы идут полосами светлый / тёмный — граница между годами видна ───────────── */

type Tone = "light" | "dark";
const toneOf = (i: number): Tone => (i % 2 === 0 ? "light" : "dark");

const TONE = {
  dark: {
    band: "bg-coal",
    rail: "bg-white/12",
    node: "border-white/30 bg-coal",
    title: "text-white",
    lead: "text-white/75",
    text: "text-white/65",
    muted: "text-white/45",
    faint: "text-white/30",
    strong: "text-white/70",
    line: "border-white/10",
    frame: "border-white/12",
    chip: "border-white/20 text-white/75",
    card: "bg-white/[0.02]",
    link: "border-white/20 text-white/80 hover:text-white",
    oldMark: "border border-white/35",
    oldText: "text-white/60",
    slot: "border-white/20 bg-white/[0.02]",
    slotGrid: "rgba(255,255,255,0.035)",
    slotWork: "text-white/60",
    // боковая шкала
    asideYear: "text-white",
    asideActive: "text-white",
    asidePast: "text-white/55 hover:text-white",
    asideNext: "text-white/30 hover:text-white/70",
    asideLine: "border-white/10",
    bar: "border-white/10 bg-coal/90",
  },
  light: {
    band: "bg-paper",
    rail: "bg-black/10",
    node: "border-black/25 bg-paper",
    title: "text-ink",
    lead: "text-ink/75",
    text: "text-ink/65",
    muted: "text-ink/50",
    faint: "text-ink/35",
    strong: "text-ink/75",
    line: "border-black/10",
    frame: "border-black/10",
    chip: "border-black/15 text-ink/75",
    card: "bg-white",
    link: "border-black/15 text-ink/80 hover:text-ink",
    oldMark: "border border-black/30",
    oldText: "text-ink/55",
    slot: "border-black/20 bg-black/[0.02]",
    slotGrid: "rgba(0,0,0,0.045)",
    slotWork: "text-ink/55",
    asideYear: "text-ink",
    asideActive: "text-ink",
    asidePast: "text-ink/55 hover:text-ink",
    asideNext: "text-ink/35 hover:text-ink/70",
    asideLine: "border-black/10",
    bar: "border-black/10 bg-paper/90",
  },
} as const;

type T = (typeof TONE)[Tone];

/* ───────────── Открытое место под фото (фото проекта пока нет) ───────────── */

function PhotoSlot({ p, year, t, className = "" }: { p: GrowthProject; year: string; t: T; className?: string }) {
  return (
    <figure className={`relative overflow-hidden border border-dashed ${t.slot} ${className}`}>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${t.slotGrid} 1px, transparent 1px), linear-gradient(90deg, ${t.slotGrid} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      <span aria-hidden className="absolute left-1/2 top-[42%] h-7 w-px -translate-x-1/2 -translate-y-1/2 bg-orange/70" />
      <span aria-hidden className="absolute left-1/2 top-[42%] h-px w-7 -translate-x-1/2 -translate-y-1/2 bg-orange/70" />
      <span className={`absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.16em] md:left-6 md:top-6 ${t.faint}`}>
        Место для фото
      </span>
      <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 md:p-6">
        <span>
          <span className={`block font-mono text-[13px] uppercase tracking-[0.06em] md:text-[15px] ${t.title}`}>{p.name}</span>
          {p.work && <span className={`mt-1 block font-body text-[13px] md:text-[14px] ${t.slotWork}`}>{p.work}</span>}
        </span>
        <span className="shrink-0 font-mono text-[12px] tracking-[0.12em] text-orange">{year}</span>
      </figcaption>
    </figure>
  );
}

/* ───────────── Проекты года: фото и открытые места под фото ───────────── */

const GRID: Record<number, string> = {
  1: "grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2",
};

function Projects({ c, t }: { c: GrowthYear; t: T }) {
  const n = c.projects.length;
  const tile = n === 1 ? "aspect-[16/9]" : "aspect-[4/3]";
  return (
    <div className={`grid gap-3 ${GRID[n] ?? "sm:grid-cols-2 lg:grid-cols-3"}`}>
      {c.projects.map((p, k) =>
        p.image ? (
          <Photo
            key={`${p.name}-${k}`}
            item={{ name: p.name, work: p.work ?? "", year: p.year ?? c.year, image: p.image }}
            className={tile}
          />
        ) : (
          <PhotoSlot key={`${p.name}-${k}`} p={p} year={p.year ?? c.year} t={t} className={tile} />
        ),
      )}
    </div>
  );
}

/* ───────────── Компетенции года: новые отмечены ───────────── */

function Competences({ c, i, t }: { c: GrowthYear; i: number; t: T }) {
  const { fresh, total } = growthStats[i];
  return (
    <Reveal className="mt-10 grid gap-6 md:mt-14 md:grid-cols-[200px_1fr] md:gap-10">
      <div className={`font-mono text-[11px] uppercase tracking-[0.18em] ${t.muted}`}>
        Компетенции
        <span className={`mt-2 block ${t.faint}`}>
          Накоплено: <span className={t.strong}>{total}</span>
        </span>
      </div>
      <ul className={`grid border-t sm:grid-cols-2 sm:gap-x-8 ${t.line}`}>
        {c.competences.map((name) => {
          const isNew = fresh.has(name);
          return (
            <li key={name} className={`flex items-start gap-3 border-b py-3.5 ${t.line}`}>
              <span aria-hidden className={`mt-[7px] h-2 w-2 shrink-0 ${isNew ? "bg-orange" : t.oldMark}`} />
              <span className={`font-body text-[15px] leading-[1.4] ${isNew ? t.title : t.oldText}`}>{name}</span>
              {isNew && (
                <span className="ml-auto shrink-0 pl-2 pt-[3px] font-mono text-[10px] uppercase tracking-[0.14em] text-orange">
                  Новая
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
}

/* ───────────── Текст под «+» ───────────── */

function MoreBody({ blocks, t }: { blocks: StoryMore[]; t: T }) {
  return (
    <div className="flex flex-col gap-10">
      {blocks.map((b) => (
        <div key={b.title}>
          <h4 className={`font-mono text-[15px] uppercase tracking-[0.04em] md:text-[17px] ${t.title}`}>{b.title}</h4>
          {b.paragraphs?.map((p) => (
            <p key={p.slice(0, 24)} className={`mt-4 max-w-[720px] font-body text-[16px] leading-[1.6] ${t.text}`}>
              {p}
            </p>
          ))}
          {b.items && (
            <div className={`mt-6 grid border-l border-t sm:grid-cols-2 ${t.frame}`}>
              {b.items.map((it) => (
                <div key={it.title} className={`border-b border-r p-6 ${t.frame}`}>
                  {it.n && <span className="font-mono text-[12px] tracking-[0.16em] text-orange">{it.n}</span>}
                  <div className={`mt-3 font-mono text-[15px] uppercase leading-tight ${t.title}`}>{it.title}</div>
                  <p className={`mt-3 font-body text-[15px] leading-[1.5] ${t.text}`}>{it.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ───────────── Шкала годов (у каждой полосы своя, липкая) ───────────── */

function YearIndex({ i, t }: { i: number; t: T }) {
  const reduced = useReducedMotion();
  const c = growthYears[i];
  const go = (k: number) =>
    document
      .getElementById(`year-${growthYears[k].id}`)
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });

  return (
    <div className="sticky top-[72px] flex h-[calc(100vh-72px)] flex-col justify-center py-8">
      <div className="eyebrow text-orange">История нашего роста</div>
      <div className={`mt-5 font-mono leading-none ${t.asideYear}`} style={{ fontSize: "clamp(64px, min(8vw, 13vh), 132px)" }}>
        {c.year}
      </div>
      <div className={`mt-3 min-h-[20px] font-mono text-[12px] uppercase tracking-[0.16em] ${t.muted}`}>
        {c.label}
        {c.period !== c.year && <span className={t.faint}> · {c.period}</span>}
      </div>

      <div className={`mt-6 flex items-baseline gap-3 border-t pt-5 ${t.asideLine}`}>
        <span className="font-mono text-[34px] leading-none text-orange">{growthStats[i].total}</span>
        <span className={`font-mono text-[11px] uppercase leading-tight tracking-[0.14em] ${t.muted}`}>
          компетенций
          <br />
          накоплено
        </span>
      </div>

      <ol className="mt-6 flex flex-col">
        {growthYears.map((y, k) => {
          const isActive = k === i;
          return (
            <li key={y.id}>
              <button
                type="button"
                onClick={() => go(k)}
                aria-current={isActive ? "step" : undefined}
                className={`group flex w-full items-center gap-4 py-1.5 text-left font-mono text-[12px] uppercase tracking-[0.12em] transition-colors ${
                  isActive ? t.asideActive : k < i ? t.asidePast : t.asideNext
                }`}
              >
                <span className={`h-px ${isActive ? "w-8 bg-orange" : "w-4 bg-current"}`} />
                <span className={`w-11 ${isActive ? "text-orange" : ""}`}>{y.year}</span>
                <span className="truncate">{y.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ───────────── Полоса года: своя шкала слева, глава справа ───────────── */

function Band({ c, i }: { c: GrowthYear; i: number }) {
  const tone = toneOf(i);
  const t = TONE[tone];
  const ref = useRef<HTMLElement>(null);
  // Линия истории внутри полосы заполняется оранжевым по мере чтения года
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 55%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <section ref={ref} id={`year-${c.id}`} aria-label={c.period} className={`relative scroll-mt-[72px] ${t.band}`}>
      {/* Mobile: липкая плашка года */}
      <div className={`sticky top-[72px] z-20 border-b backdrop-blur-md lg:hidden ${t.bar}`}>
        <div className="container-x flex items-center justify-between gap-4 py-3">
          <span className={`font-mono text-[22px] leading-none ${t.asideYear}`}>{c.year}</span>
          <span className={`truncate font-mono text-[11px] uppercase tracking-[0.16em] ${t.muted}`}>{c.label}</span>
          <span className={`shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] ${t.muted}`}>
            <span className="text-orange">{growthStats[i].total}</span> комп.
          </span>
        </div>
        <motion.div className="h-px origin-left bg-orange" style={{ scaleX: fill }} />
      </div>

      <div className="container-x">
        <div className="grid lg:grid-cols-[minmax(240px,300px)_1fr] lg:gap-14">
          <aside className="hidden lg:block">
            <YearIndex i={i} t={t} />
          </aside>

          <article className="relative py-20 pl-7 md:py-28 md:pl-14">
            {/* Линия истории и её заполнение */}
            <div aria-hidden className={`absolute inset-y-0 left-0 w-px ${t.rail}`} />
            <motion.div aria-hidden className="absolute inset-y-0 left-0 w-px origin-top bg-orange" style={{ scaleY: fill }} />
            <span
              aria-hidden
              className="absolute left-0 top-[86px] h-3 w-3 -translate-x-1/2 border border-orange bg-orange md:top-[118px]"
            />
            <Chapter c={c} i={i} t={t} tone={tone} />
          </article>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Глава года ───────────── */

function Chapter({ c, i, t, tone }: { c: GrowthYear; i: number; t: T; tone: Tone }) {
  return (
    <div className="relative">
      <Reveal>
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 font-mono text-[12px] uppercase tracking-[0.16em]">
          <span className="text-orange">{c.period}</span>
          <span className={t.muted}>{c.label}</span>
        </div>
        <div className={`mt-5 font-mono text-[64px] leading-none lg:hidden ${t.title}`}>{c.year}</div>
        <h3
          className={`mt-6 max-w-[860px] font-mono uppercase ${t.title}`}
          style={{ fontSize: "clamp(28px, 3.4vw, 54px)", lineHeight: 1.02, letterSpacing: "-0.005em" }}
        >
          {c.title}
        </h3>
        <p
          className={`mt-7 max-w-[760px] font-body ${t.lead}`}
          style={{ fontSize: "clamp(17px, 1.35vw, 21px)", lineHeight: 1.5 }}
        >
          {c.lead}
        </p>
      </Reveal>

      {c.visual === "subsystem" && (
        <Reveal className="mt-10 aspect-[2/1] w-full border border-white/10 bg-coal-deep p-4 md:mt-14 md:p-8">
          <SubsystemVisual />
        </Reveal>
      )}

      <div className={c.visual ? "mt-3" : "mt-10 md:mt-14"}>
        <Projects c={c} t={t} />
      </div>

      <Competences c={c} i={i} t={t} />

      {c.shift && (
        <Reveal className="mt-10 grid gap-6 md:mt-12 md:grid-cols-[200px_1fr] md:gap-10">
          <div className={`font-mono text-[11px] uppercase tracking-[0.18em] ${t.muted}`}>Что изменили в работе</div>
          <div>
            <div className="h-px w-12 bg-orange" />
            <p
              className={`mt-5 max-w-[720px] font-mono uppercase ${t.title}`}
              style={{ fontSize: "clamp(17px, 1.5vw, 23px)", lineHeight: 1.25 }}
            >
              {c.shift}
            </p>
            {c.chips && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {c.chips.map((chip) => (
                  <li key={chip} className={`border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] ${t.chip}`}>
                    {chip}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      )}

      {c.stats && (
        <Reveal className={`mt-12 grid grid-cols-2 border-l border-t lg:grid-cols-4 ${t.frame}`}>
          {c.stats.map((s) => (
            <div key={s.label} className={`border-b border-r p-5 md:p-7 ${t.frame}`}>
              <p className={`font-mono leading-none ${t.title}`} style={{ fontSize: "clamp(40px, 4.4vw, 68px)" }}>
                {s.value}
                <span className="ml-1 align-top text-[0.4em] text-orange">{s.unit}</span>
              </p>
              <p className={`mt-4 font-body text-[14px] leading-[1.45] ${t.muted}`}>{s.label}</p>
            </div>
          ))}
        </Reveal>
      )}

      {c.value && (
        <Reveal className={`mt-12 border p-6 md:p-9 ${t.frame} ${t.card}`}>
          <div className="flex items-center justify-between gap-4">
            <span className={`font-mono text-[11px] uppercase tracking-[0.18em] ${t.muted}`}>
              Ценность, которая родилась здесь
            </span>
            <span className="font-mono text-[13px] tracking-[0.16em] text-orange">{c.value.n}</span>
          </div>
          <h4
            className={`mt-6 font-mono uppercase ${t.title}`}
            style={{ fontSize: "clamp(20px, 1.9vw, 30px)", lineHeight: 1.08 }}
          >
            {c.value.title}
          </h4>
          <p className={`mt-4 max-w-[720px] font-body text-[16px] leading-[1.55] ${t.text}`}>{c.value.body}</p>
          <p className={`mt-4 max-w-[720px] font-body text-[14px] leading-[1.5] ${t.muted}`}>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-orange/80">На практике: </span>
            {c.value.practice}
          </p>
        </Reveal>
      )}

      {c.more && (
        <div className="mt-10">
          <More theme={tone}>
            <MoreBody blocks={c.more} t={t} />
          </More>
        </div>
      )}

      {c.links && (
        <div className={`flex flex-wrap gap-3 ${c.more ? "mt-2" : "mt-10"}`}>
          {c.links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`group inline-flex items-center gap-3 border px-4 py-3 font-mono text-[12px] uppercase tracking-[0.14em] transition-colors hover:border-orange ${t.link}`}
            >
              {l.label}
              <span className="text-orange transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────── Хронология: годы полосами, светлый / тёмный ───────────── */

export default function GrowthTimeline() {
  return (
    <div id="history" className="scroll-mt-[72px]">
      {growthYears.map((c, i) => (
        <Band key={c.id} c={c} i={i} />
      ))}
    </div>
  );
}
