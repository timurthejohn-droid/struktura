"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useMotionValue, useReducedMotion } from "framer-motion";
import { CORE_SCENE_LABELS_CSS } from "./sceneLabels";

const CoreStoryScene = dynamic(() => import("../digital/CoreStoryScene"), { ssr: false });

// Первый экран: живое цифровое ядро. Показываем момент «среда вышла к исполнению» —
// ядро со всеми слоями и тремя направлениями: проектирование, производства, площадка.
const HERO_STATE = 0.3;

export default function HeroCore() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const progress = useMotionValue(HERO_STATE);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "100px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="ds-hero-canvas ds-simple" aria-hidden>
      <CoreStoryScene progress={progress} reduced={reduced} active={active} selected={null} still />
      <style dangerouslySetInnerHTML={{ __html: CORE_SCENE_LABELS_CSS }} />
    </div>
  );
}
