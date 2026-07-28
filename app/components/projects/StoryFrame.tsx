"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Лёгкий Ken Burns: снимок медленно "дышит" по мере прохождения через вьюпорт,
// вместо статичной картинки — деталь, которая держит сторителлинг живым.
export default function StoryFrame({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden bg-ink ${className}`}>
      <motion.img
        src={`${basePath}${src}`}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        style={reduced ? undefined : { scale, y }}
      />
    </div>
  );
}
