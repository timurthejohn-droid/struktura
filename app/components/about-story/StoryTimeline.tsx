"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Reveal from "../materials/Reveal";
import More from "./More";
import { storyChapters, type StoryCase, type StoryChapter, type StoryMore } from "./storyData";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const EASE = [0.23, 1, 0.32, 1] as const;

/* ───────────── Год-одометр: меняются только те цифры, что отличаются ───────────── */

const digitVariants = {
  enter: (dir: number) => ({ y: dir >= 0 ? "100%" : "-100%" }),
  center: { y: "0%" },
  exit: (dir: number) => ({ y: dir >= 0 ? "-100%" : "100%" }),
};

function Year({ value, dir, className = "" }: { value: string; dir: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <div className={`flex font-mono leading-none ${className}`} aria-label={value}>
      {value.split("").map((d, i) => (
        <span key={i} className="relative inline-block overflow-hidden" style={{ height: "1em" }} aria-hidden>
          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
            <motion.span
              key={d}
              custom={dir}
              variants={reduced ? undefined : digitVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: EASE, delay: i * 0.04 }}
              className="block"
            >
              {d}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </div>
  );
}

/* ───────────── Фото кейса с лёгким параллаксом ───────────── */

function Photo({ item, className = "" }: { item: StoryCase; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <figure ref={ref} className={`group relative overflow-hidden bg-coal-deep ${className}`}>
      <motion.img
        src={`${basePath}${item.image}`}
        alt={`${item.name} — ${item.work}`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-700 group-hover:brightness-110"
        style={reduced ? { scale: 1.04 } : { y, scale: 1.16 }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 md:p-6">
        <span>
          <span className="block font-mono text-[13px] uppercase tracking-[0.06em] text-white md:text-[15px]">
            {item.name}
          </span>
          <span className="mt-1 block font-body text-[13px] text-white/70 md:text-[14px]">{item.work}</span>
        </span>
        <span className="shrink-0 font-mono text-[12px] tracking-[0.12em] text-orange">{item.year}</span>
      </figcaption>
    </figure>
  );
}

/* ───────────── Схемы для глав без фото ───────────── */

function Draw({ d, delay = 0, stroke = "rgba(255,255,255,0.55)", width = 1 }: { d: string; delay?: number; stroke?: string; width?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      initial={reduced ? false : { pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 1.4, ease: EASE, delay }}
    />
  );
}

function OriginVisual() {
  // Идея (свободная кривая) → инженерная структура под ней.
  const ribs = Array.from({ length: 11 }, (_, i) => 60 + i * 48);
  const curve = (x: number) => 150 - Math.sin(((x - 40) / 520) * Math.PI) * 90;
  return (
    <svg viewBox="0 0 600 300" className="h-full w-full" aria-hidden>
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`g${i}`} x1={i * 50} y1="0" x2={i * 50} y2="300" stroke="rgba(255,255,255,0.05)" />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 50} x2="600" y2={i * 50} stroke="rgba(255,255,255,0.05)" />
      ))}
      <Draw d="M40 150 C 160 20, 440 20, 560 150" stroke="#ff5a00" width={2} />
      {ribs.map((x, i) => (
        <Draw key={x} d={`M${x} ${curve(x)} L${x} 250`} delay={0.5 + i * 0.05} />
      ))}
      <Draw d="M40 250 H560" delay={0.4} />
      <text x="40" y="285" fill="rgba(255,255,255,0.4)" fontFamily="CoFo Sans Mono, monospace" fontSize="11" letterSpacing="2">
        ИДЕЯ → ИНЖЕНЕРНАЯ ЛОГИКА
      </text>
    </svg>
  );
}

function SubsystemVisual() {
  // Изогнутая оболочка на несущем каркасе: стойки, ригели, узлы.
  const cols = Array.from({ length: 9 }, (_, i) => i);
  const rows = Array.from({ length: 5 }, (_, i) => i);
  const pt = (c: number, r: number) => {
    const x = 70 + c * 58 + r * 10;
    const y = 40 + r * 48 + Math.sin((c / 8) * Math.PI) * -26 + c * 3;
    return [x, y] as const;
  };
  return (
    <svg viewBox="0 0 600 300" className="h-full w-full" aria-hidden>
      {cols.map((c) => (
        <Draw
          key={`c${c}`}
          d={rows.map((r, k) => `${k ? "L" : "M"}${pt(c, r)[0]} ${pt(c, r)[1]}`).join(" ")}
          delay={c * 0.06}
        />
      ))}
      {rows.map((r) => (
        <Draw
          key={`r${r}`}
          d={cols.map((c, k) => `${k ? "L" : "M"}${pt(c, r)[0]} ${pt(c, r)[1]}`).join(" ")}
          delay={0.5 + r * 0.08}
          stroke="rgba(255,255,255,0.3)"
        />
      ))}
      {cols.flatMap((c) =>
        rows.map((r) => {
          const [x, y] = pt(c, r);
          const hot = (c + r * 3) % 7 === 0;
          return (
            <motion.rect
              key={`n${c}-${r}`}
              x={x - 3}
              y={y - 3}
              width="6"
              height="6"
              fill={hot ? "#ff5a00" : "#181818"}
              stroke={hot ? "#ff5a00" : "rgba(255,255,255,0.6)"}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1 + (c + r) * 0.04, duration: 0.3 }}
            />
          );
        }),
      )}
      <text x="40" y="290" fill="rgba(255,255,255,0.4)" fontFamily="CoFo Sans Mono, monospace" fontSize="11" letterSpacing="2">
        ПОДСИСТЕМА · НЕСУЩИЙ КАРКАС · УЗЛЫ
      </text>
    </svg>
  );
}

/* ───────────── Визуальный блок главы ───────────── */

function ChapterVisual({ c }: { c: StoryChapter }) {
  const photos = c.cases.filter((x) => x.image);
  const plain = c.cases.filter((x) => !x.image);

  return (
    <div className="mt-10 md:mt-14">
      {photos.length === 0 && c.visual && (
        <Reveal className="aspect-[2/1] w-full border border-white/10 bg-coal-deep p-4 md:p-8">
          {c.visual === "origin" ? <OriginVisual /> : <SubsystemVisual />}
        </Reveal>
      )}

      {photos.length === 1 && <Photo item={photos[0]} className="aspect-[16/9] w-full" />}

      {photos.length === 2 && (
        <div className="grid gap-3 md:grid-cols-[1.55fr_1fr]">
          <Photo item={photos[0]} className="aspect-[4/3] md:aspect-auto md:h-[440px]" />
          <Photo item={photos[1]} className="aspect-[4/3] md:aspect-auto md:h-[440px]" />
        </div>
      )}

      {photos.length >= 3 && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Photo item={photos[0]} className="aspect-[16/9] sm:col-span-2" />
          {photos.slice(1).map((p) => (
            <Photo key={p.image} item={p} className="aspect-[4/3]" />
          ))}
        </div>
      )}

      {plain.length > 0 && (
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {plain.map((p) => (
            <li key={p.name} className="flex items-start justify-between gap-4 border border-white/12 p-5">
              <span>
                <span className="block font-mono text-[13px] uppercase tracking-[0.06em] text-white">{p.name}</span>
                <span className="mt-1 block font-body text-[14px] text-white/55">{p.work}</span>
              </span>
              <span className="shrink-0 font-mono text-[12px] tracking-[0.12em] text-orange">{p.year}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MoreBody({ blocks }: { blocks: StoryMore[] }) {
  return (
    <div className="flex flex-col gap-10">
      {blocks.map((b) => (
        <div key={b.title}>
          <h4 className="font-mono text-[15px] uppercase tracking-[0.04em] text-white md:text-[17px]">{b.title}</h4>
          {b.paragraphs?.map((p) => (
            <p key={p.slice(0, 24)} className="mt-4 max-w-[720px] font-body text-[16px] leading-[1.6] text-white/65">
              {p}
            </p>
          ))}
          {b.items && (
            <div className="mt-6 grid border-l border-t border-white/12 sm:grid-cols-2">
              {b.items.map((it) => (
                <div key={it.title} className="border-b border-r border-white/12 p-6">
                  {it.n && <span className="font-mono text-[12px] tracking-[0.16em] text-orange">{it.n}</span>}
                  <div className="mt-3 font-mono text-[15px] uppercase leading-tight text-white">{it.title}</div>
                  <p className="mt-3 font-body text-[15px] leading-[1.5] text-white/60">{it.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ───────────── Глава ───────────── */

function Chapter({ c, i, reached }: { c: StoryChapter; i: number; reached: boolean }) {
  return (
    <article
      id={`story-${c.id}`}
      data-index={i}
      className="relative scroll-mt-24 border-b border-white/[0.08] py-20 pl-7 last:border-b-0 md:py-28 md:pl-14"
    >
      {/* Узел на линии истории */}
      <span
        aria-hidden
        className={`absolute left-0 top-[86px] h-3 w-3 -translate-x-1/2 border transition-colors duration-500 md:top-[118px] ${
          reached ? "border-orange bg-orange" : "border-white/30 bg-coal"
        }`}
      />

      <Reveal>
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 font-mono text-[12px] uppercase tracking-[0.16em]">
          <span className="text-orange">Глава {String(i + 1).padStart(2, "0")}</span>
          <span className="text-white/45">{c.period}</span>
        </div>
        <div className="mt-5 font-mono text-[64px] leading-none text-white/90 lg:hidden">{c.year}</div>
        <h3
          className="mt-6 max-w-[860px] font-mono uppercase text-white"
          style={{ fontSize: "clamp(28px, 3.4vw, 54px)", lineHeight: 1.02, letterSpacing: "-0.005em" }}
        >
          {c.title}
        </h3>
        <p
          className="mt-7 max-w-[760px] font-body text-white/75"
          style={{ fontSize: "clamp(17px, 1.35vw, 21px)", lineHeight: 1.5 }}
        >
          {c.lead}
        </p>
      </Reveal>

      <ChapterVisual c={c} />

      <Reveal className="mt-10 grid gap-6 md:mt-14 md:grid-cols-[200px_1fr] md:gap-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">Что изменили в работе</div>
        <div>
          <div className="h-px w-12 bg-orange" />
          <p
            className="mt-5 max-w-[720px] font-mono uppercase text-white"
            style={{ fontSize: "clamp(17px, 1.5vw, 23px)", lineHeight: 1.25 }}
          >
            {c.shift}
          </p>
          {c.chips && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {c.chips.map((chip) => (
                <li
                  key={chip}
                  className="border border-white/20 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/75"
                >
                  {chip}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Reveal>

      {c.stats && (
        <Reveal className="mt-12 grid grid-cols-2 border-l border-t border-white/12 lg:grid-cols-4">
          {c.stats.map((s) => (
            <div key={s.label} className="border-b border-r border-white/12 p-5 md:p-7">
              <p className="font-mono leading-none text-white" style={{ fontSize: "clamp(40px, 4.4vw, 68px)" }}>
                {s.value}
                <span className="ml-1 align-top text-[0.4em] text-orange">{s.unit}</span>
              </p>
              <p className="mt-4 font-body text-[14px] leading-[1.45] text-white/55">{s.label}</p>
            </div>
          ))}
        </Reveal>
      )}

      {c.value && (
        <Reveal className="mt-12 border border-white/12 bg-white/[0.02] p-6 md:p-9">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">
              Ценность, которая родилась здесь
            </span>
            <span className="font-mono text-[13px] tracking-[0.16em] text-orange">{c.value.n}</span>
          </div>
          <h4
            className="mt-6 font-mono uppercase text-white"
            style={{ fontSize: "clamp(20px, 1.9vw, 30px)", lineHeight: 1.08 }}
          >
            {c.value.title}
          </h4>
          <p className="mt-4 max-w-[720px] font-body text-[16px] leading-[1.55] text-white/65">{c.value.body}</p>
          <p className="mt-4 max-w-[720px] font-body text-[14px] leading-[1.5] text-white/45">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-orange/80">На практике: </span>
            {c.value.practice}
          </p>
        </Reveal>
      )}

      {c.more && (
        <div className="mt-10">
          <More>
            <MoreBody blocks={c.more} />
          </More>
        </div>
      )}

      {c.links && (
        <div className={`flex flex-wrap gap-3 ${c.more ? "mt-2" : "mt-10"}`}>
          {c.links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group inline-flex items-center gap-3 border border-white/20 px-4 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-white/80 transition-colors hover:border-orange hover:text-white"
            >
              {l.label}
              <span className="text-orange transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}

/* ───────────── Таймлайн ───────────── */

export default function StoryTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const activeRef = useRef(0);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 55%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const next = Number((e.target as HTMLElement).dataset.index);
          if (next === activeRef.current) return;
          setDir(next > activeRef.current ? 1 : -1);
          activeRef.current = next;
          setActive(next);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    storyChapters.forEach((c) => {
      const el = document.getElementById(`story-${c.id}`);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const go = (i: number) =>
    document
      .getElementById(`story-${storyChapters[i].id}`)
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });

  const current = storyChapters[active];

  return (
    <section id="history" className="relative bg-coal text-white">
      {/* Mobile: липкая плашка с годом и прогрессом */}
      <div className="sticky top-[72px] z-20 border-b border-white/10 bg-coal/90 backdrop-blur-md lg:hidden">
        <div className="container-x flex items-center justify-between py-3">
          <Year value={current.year} dir={dir} className="text-[22px] text-white" />
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/55">{current.label}</span>
        </div>
        <motion.div className="h-px origin-left bg-orange" style={{ scaleX: progress }} />
      </div>

      <div className="container-x">
        <div ref={ref} className="grid lg:grid-cols-[minmax(240px,300px)_1fr] lg:gap-14">
          {/* Desktop: липкая шкала годов */}
          <aside className="hidden lg:block">
            <div className="sticky top-[72px] flex h-[calc(100vh-72px)] flex-col justify-center py-10">
              <div className="eyebrow text-orange">История STRUKTURA</div>
              <Year value={current.year} dir={dir} className="mt-6 text-[clamp(84px,8vw,132px)] text-white" />
              <div className="mt-4 min-h-[20px] font-mono text-[12px] uppercase tracking-[0.16em] text-white/50">
                {current.label}
                {current.period !== current.year && current.period !== current.label && (
                  <span className="text-white/30"> · {current.period}</span>
                )}
              </div>

              <ol className="mt-12 flex flex-col">
                {storyChapters.map((c, i) => {
                  const isActive = i === active;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => go(i)}
                        aria-current={isActive ? "step" : undefined}
                        className={`group flex w-full items-center gap-4 py-2 text-left font-mono text-[12px] uppercase tracking-[0.12em] transition-colors ${
                          isActive ? "text-white" : i < active ? "text-white/55 hover:text-white" : "text-white/30 hover:text-white/70"
                        }`}
                      >
                        <span
                          className={`h-px transition-all duration-500 ${isActive ? "w-8 bg-orange" : "w-4 bg-current"}`}
                        />
                        <span className={`w-11 ${isActive ? "text-orange" : ""}`}>{c.year}</span>
                        <span className="truncate">{c.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>

          {/* Линия истории + главы */}
          <div className="relative">
            <div aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-white/12" />
            <motion.div
              aria-hidden
              className="absolute bottom-0 left-0 top-0 w-px origin-top bg-orange"
              style={{ scaleY: progress }}
            />
            {storyChapters.map((c, i) => (
              <Chapter key={c.id} c={c} i={i} reached={i <= active} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
