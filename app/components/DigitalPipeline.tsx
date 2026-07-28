"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from "framer-motion";
import Reveal from "./materials/Reveal";

export type PipelineStage = { n: string; slug: string; title: string };

/* Статичный ряд — для reduced-motion и как основа для мобильной вертикальной версии */
function StaticRow({ stages }: { stages: PipelineStage[] }) {
  return (
    <div className="container-x py-10">
      <div className="flex items-start justify-between overflow-x-auto">
        {stages.map((s) => (
          <a key={s.slug} href={`#${s.slug}`} className="group flex min-w-[110px] flex-col items-center gap-4 px-2">
            <span className="flex h-14 w-14 items-center justify-center border border-ink/25 font-mono text-[13px] text-ink/70 transition-colors group-hover:border-orange group-hover:text-orange">
              {s.n}
            </span>
            <span className="max-w-[110px] text-center font-mono text-[11px] uppercase leading-tight tracking-[0.08em] text-ink/60 group-hover:text-orange">
              {s.title}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function Segment({ progress, index, total }: { progress: MotionValue<number>; index: number; total: number }) {
  const start = (index + 0.15) / total;
  const end = (index + 0.85) / total;
  const scaleX = useTransform(progress, [start, end], [0, 1]);
  return (
    <div className="relative top-7 h-px flex-1 bg-ink/12 md:top-8">
      <motion.div className="absolute inset-y-0 left-0 w-full origin-left bg-orange" style={{ scaleX }} />
    </div>
  );
}

function Node({
  stage,
  index,
  total,
  progress,
}: {
  stage: PipelineStage;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const at = (index + 0.15) / total;
  const from = Math.max(at - 0.09, 0);
  const scale = useTransform(progress, [from, at], [0.82, 1]);
  const dotOpacity = useTransform(progress, [from, at], [0, 1]);
  const borderColor = useTransform(progress, [from, at], ["rgba(26,26,26,0.18)", "#FF5A00"]);
  const textColor = useTransform(progress, [from, at], ["rgba(26,26,26,0.5)", "#FF5A00"]);

  return (
    <a href={`#${stage.slug}`} className="group relative z-10 flex flex-col items-center gap-4 px-1">
      <motion.span
        style={{ scale, borderColor }}
        className="relative flex h-14 w-14 items-center justify-center border bg-paper font-mono text-[13px] text-ink md:h-16 md:w-16"
      >
        <motion.span
          aria-hidden
          style={{ opacity: dotOpacity, boxShadow: "0 0 0 3px rgba(255,90,0,0.14)" }}
          className="absolute inset-0"
        />
        {stage.n}
      </motion.span>
      <motion.span
        style={{ color: textColor }}
        className="max-w-[104px] text-center font-mono text-[11px] uppercase leading-tight tracking-[0.08em] transition-colors group-hover:!text-orange"
      >
        {stage.title}
      </motion.span>
    </a>
  );
}

export default function DigitalPipeline({ stages }: { stages: PipelineStage[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start 75%", "end 55%"] });

  if (reduced) {
    return (
      <div className="hidden md:block">
        <StaticRow stages={stages} />
      </div>
    );
  }

  return (
    <>
      {/* Desktop: линия собирается по мере скролла */}
      <div ref={wrapRef} className="container-x hidden py-16 md:block">
        <div className="flex items-start">
          {stages.map((s, i) => (
            <div key={s.slug} className="flex flex-1 items-start last:flex-none">
              <Node stage={s} index={i} total={stages.length} progress={scrollYProgress} />
              {i < stages.length - 1 && <Segment progress={scrollYProgress} index={i} total={stages.length} />}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: вертикальный таймлайн, обычный reveal-каскад */}
      <div className="md:hidden">
        <Reveal className="reveal-stagger container-x flex flex-col gap-8 py-10">
          {stages.map((s) => (
            <a key={s.slug} href={`#${s.slug}`} className="group flex items-center gap-5 border-l border-ink/15 pl-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink/25 font-mono text-[12px] text-ink/70 group-hover:border-orange group-hover:text-orange">
                {s.n}
              </span>
              <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-ink/70 group-hover:text-orange">
                {s.title}
              </span>
            </a>
          ))}
        </Reveal>
      </div>
    </>
  );
}
