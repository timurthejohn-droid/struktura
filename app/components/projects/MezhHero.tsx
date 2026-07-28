"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const heroImage = "/projects/mezhbashennoye/gallery-8.jpg";

export default function MezhHero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.32, 0.78]);
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, -70]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section ref={ref} className="relative bg-coal" style={{ height: reduced ? "100vh" : "190vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ position: reduced ? "relative" : "sticky" }}>
        <motion.img
          src={`${basePath}${heroImage}`}
          alt="Межбашенное пространство — арка между башнями Сбербанк-Сити на закате"
          className="absolute inset-0 h-full w-full object-cover"
          style={reduced ? undefined : { scale }}
        />
        <motion.div className="absolute inset-0 bg-black" style={{ opacity: reduced ? 0.6 : overlay }} />

        <div className="relative z-10 flex h-full flex-col justify-between pb-10 pt-24 md:pb-14 md:pt-28">
          <div className="container-x flex items-center justify-between fade-in">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Сбербанк-Сити · 2022</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Проект / 01</span>
          </div>

          <motion.div
            className="container-x"
            style={reduced ? undefined : { y: textY, opacity: textOpacity }}
          >
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-orange">
              Металлические конструкции · Архитектурные оболочки
            </p>
            <h1 className="max-w-[1200px] text-white" style={{ fontSize: "clamp(42px,8vw,128px)", lineHeight: 0.92, letterSpacing: "-0.01em" }}>
              Межбашенное
              <br />
              пространство
            </h1>
            <p className="mt-8 max-w-[620px] font-body text-white/70" style={{ fontSize: "clamp(15px,1.3vw,20px)", lineHeight: 1.55 }}>
              Главная внешняя доминанта штаб-квартиры Сбербанк-Сити — первая конструкция такого масштаба, реализованная в России.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
