"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Общее для первого экрана с роликом компании:
 * пути к видео, тексты героя и полноэкранный плеер, который «раскрывается» из превью.
 * Видео: web site videos/about.mov → public/video (петля 15 с без звука + полный ролик 1080p).
 */

const BP = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const HERO_VIDEO = {
  loop: `${BP}/video/about-loop.mp4`,
  full: `${BP}/video/about.mp4`,
  poster: `${BP}/video/about-poster.jpg`,
  duration: "01:00",
};

export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Заголовок, подзаголовок и кнопка первого экрана.
 * Заголовок — четыре фиксированные строки (без случайных переносов). Размеры задаёт
 * `--hero-fs` на секции (см. HeroScrollVideo): кегль абзаца и отступы — ступени шкалы φ от него.
 */
export function HeroCopy({ dark = false, extra }: { dark?: boolean; extra?: ReactNode }) {
  return (
    <div className="hero-copy rise-in" style={{ animationDelay: "0.14s" }}>
      <h1 className={`hero-title ${dark ? "text-white" : "text-ink"}`}>
        Превращаем
        <br />
        сложные&nbsp;идеи
        <br />
        в&nbsp;<span className="text-orange">реализованные</span>
        <br />
        объекты
      </h1>
      <p
        className={`hero-lead rise-in font-body ${dark ? "text-white/75" : "text-ink-soft"}`}
        style={{ animationDelay: "0.28s" }}
      >
        Объединяем проектирование, производство и&nbsp;монтаж в&nbsp;единую систему реализации
        сложных проектов.
      </p>
      <div className="hero-cta rise-in flex flex-wrap gap-3" style={{ animationDelay: "0.36s" }}>
        <a href="#projects" className="btn btn-orange">
          Все проекты
        </a>
        {extra}
      </div>
    </div>
  );
}

/**
 * Типографика первого экрана: кегль заголовка `--hero-fs` и шкала φ от него.
 * Рядом с роликом: текст — 0.618 контейнера, абзац — 0.618 текста.
 */
export function HeroTypeStyles() {
  return (
    <style jsx global>{`
        /* Кегль заголовка (моноширинный, знак = 0.59em).
           Рядом с роликом: «ПРЕВРАЩАЕМ» (5.9em) заканчивается ровно на линии 0.382 → fs = 0.382·C / 5.9;
           самая длинная строка «В РЕАЛИЗОВАННЫЕ» (8.85em) остаётся в колонке 0.618 с отступом до ролика.
           Друг под другом: самая длинная строка во всю ширину (C / 9). Плюс ограничение по высоте экрана. */
        #top {
          --hero-fs: clamp(30px, min(calc((100vw - 48px) / 9), 6.2svh), 64px);
        }
        @media (min-width: 768px) {
          #top {
            --hero-fs: clamp(36px, min(calc((100vw - 128px) / 9), 6.2svh), 72px);
          }
        }
        @media (min-width: 640px) and (min-aspect-ratio: 5/4) {
          #top {
            --hero-fs: clamp(34px, min(calc((100vw - 48px) * 0.06475), calc(15svh - 37px)), 84.95px);
          }
        }
        @media (min-width: 768px) and (min-aspect-ratio: 5/4), (min-width: 1024px) {
          #top {
            --hero-fs: clamp(34px, min(calc((min(100vw, 1440px) - 128px) * 0.06475), calc(15svh - 37px)), 84.95px);
          }
        }

        #top .hero-title {
          font-size: var(--hero-fs);
          line-height: 1;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }
        /* Шкала φ от кегля заголовка: абзац = fs/φ³, отступы fs/φ и fs/φ² */
        #top .hero-lead {
          margin-top: calc(var(--hero-fs) * 0.618);
          max-width: 34em;
          font-size: max(16px, calc(var(--hero-fs) * 0.236));
          line-height: 1.618;
          text-wrap: balance;
        }
        #top .hero-cta {
          margin-top: max(24px, calc(var(--hero-fs) * 0.382));
        }

      @media (min-width: 640px) and (min-aspect-ratio: 5/4), (min-width: 1024px) {
        #top .hero-copy-col {
          max-width: 61.8%;
        }
        #top .hero-lead {
          max-width: 61.8%;
        }
      }
    `}</style>
  );
}

/** Квадратная кнопка «play» в фирменной геометрии. */
export function PlayGlyph({ size = 56, tone = "orange" }: { size?: number; tone?: "orange" | "white" }) {
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center ${tone === "orange" ? "bg-orange text-white" : "bg-white text-orange"}`}
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.3} height={size * 0.3} viewBox="0 0 10 10">
        <path d="M2 1 L9 5 L2 9 Z" fill="currentColor" />
      </svg>
    </span>
  );
}

type Rect = { top: number; left: number; width: number; height: number };

/** Открыть полноэкранный ролик из элемента-источника (плеер вырастает из его прямоугольника). */
export function useVideoLightbox() {
  const [from, setFrom] = useState<Rect | null>(null);
  const [open, setOpen] = useState(false);
  const show = useCallback((el: HTMLElement | null) => {
    const r = el?.getBoundingClientRect();
    setFrom(r ? { top: r.top, left: r.left, width: r.width, height: r.height } : null);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);
  return { open, from, show, close };
}

export function VideoLightbox({ open, from, onClose }: { open: boolean; from: Rect | null; onClose: () => void }) {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const start = from && !reduced ? { top: from.top, left: from.left, width: from.width, height: from.height } : { top: 0, left: 0, width: "100%", height: "100%", opacity: 0 };

  if (!mounted) return null;
  // портал в body: полноэкранный слой не зависит от трансформаций родителей
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90]"
          role="dialog"
          aria-modal="true"
          aria-label="Ролик STRUKTURA"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35 } }}
        >
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.94 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute overflow-hidden bg-black"
            initial={start}
            animate={{ top: 0, left: 0, width: "100%", height: "100%", opacity: 1 }}
            transition={{ duration: reduced ? 0.2 : 0.75, ease: EASE }}
            onAnimationComplete={() => videoRef.current?.play().catch(() => {})}
          >
            <video
              ref={videoRef}
              className="h-full w-full object-contain"
              src={HERO_VIDEO.full}
              poster={HERO_VIDEO.poster}
              controls
              playsInline
              preload="auto"
            />
          </motion.div>
          <motion.button
            type="button"
            onClick={onClose}
            aria-label="Закрыть ролик"
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center bg-white/10 text-[22px] text-white backdrop-blur-md transition-colors hover:bg-orange md:right-8 md:top-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5 } }}
            exit={{ opacity: 0 }}
          >
            ✕
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
