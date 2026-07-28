"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Reveal from "../materials/Reveal";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const nightImage = "/projects/mezhbashennoye/gallery-5.jpg";

export default function MezhClosing() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  return (
    <section ref={ref} className="relative min-h-[720px] overflow-hidden bg-coal md:min-h-[820px]">
      <motion.img
        src={`${basePath}${nightImage}`}
        alt="Межбашенное пространство ночью — подсвеченный купол между башнями"
        className="absolute inset-0 h-full w-full object-cover"
        style={reduced ? undefined : { scale }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

      <div className="container-x relative z-10 flex min-h-[720px] flex-col justify-end pb-16 pt-24 md:min-h-[820px] md:pb-24">
        <Reveal>
          <div className="mb-8 flex flex-wrap gap-3">
            {["Металлические конструкции", "Архитектурные оболочки"].map((tag) => (
              <span key={tag} className="rounded-full border border-white/25 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-white/80">
                {tag}
              </span>
            ))}
          </div>
          <h2 className="max-w-[780px] text-white" style={{ fontSize: "clamp(32px,4.4vw,64px)", lineHeight: 1.05 }}>
            Готовы создавать архитектуру будущего вместе
          </h2>
          <p className="mt-6 max-w-[520px] font-body text-white/60" style={{ fontSize: "clamp(15px,1.2vw,18px)", lineHeight: 1.55 }}>
            Опишите свою задачу — обсудим, с какой стадии подключиться к вашему проекту.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            <a href="/contacts" className="btn btn-orange">Обсудить проект →</a>
            <a href="/projects" className="font-mono text-[12px] uppercase tracking-[0.16em] text-white/70 transition-colors hover:text-white">
              Все проекты
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
