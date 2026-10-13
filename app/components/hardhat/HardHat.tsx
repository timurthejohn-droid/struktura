"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// three.js — только на клиенте и отдельным чанком
const HardHatScene = dynamic(() => import("./HardHatModelScene"), { ssr: false });

/** Вращающаяся белая каска с логотипом STRUKTURA+ (вместо секвенции конуса). */
export default function HardHat() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: "150px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative h-full w-full" aria-hidden="true">
      <HardHatScene active={active} reduced={reduced} />
    </div>
  );
}
