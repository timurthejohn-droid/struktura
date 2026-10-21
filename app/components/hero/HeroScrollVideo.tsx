"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import GridLines from "../GridLines";
import HeroPlus, { LOGO_THICKNESS } from "../HeroPlus";
import { HERO_VIDEO, HeroCopy, HeroTypeStyles, PlayGlyph, VideoLightbox, useVideoLightbox } from "./shared";

/** 3D-плюс на первом экране. Убран по решению 20.10.2026 — код сохранён: вернуть = true.
 *  Плюс встаёт в колонку ролика над окном. */
const SHOW_PLUS = false;

/** Доля прокрутки секции, на которой ролик раскрыт полностью. */
const EXPAND_END = 0.62;

/** Золотое сечение: 1/φ и 1/φ². Сетка экрана — линии на 0, 0.382, 0.618 и 1 ширины контейнера. */
const G1 = 0.382;
const G2 = 0.618;
const GOLDEN_GRID = [0, G1, G2, 1];
const NAV_H = 73;
const STAGE_MIN_H = 640;

/** Текст и ролик рядом (десктоп и горизонтальный планшет) или друг под другом. */
const isSideBySide = (w: number, h: number) => w >= 1024 || (w >= 640 && w / h >= 1.25);

/**
 * Первый экран главной: ролик сам растёт при скролле.
 * Основа — 21st.dev «Scroll media expansion hero» (arunachalam/scroll-expansion-hero):
 * медиа-блок увеличивается от окна до всего экрана, заголовок уезжает в сторону.
 * Отличия от оригинала: вместо перехвата колеса — нативный скролл со sticky-сценой
 * (не ломает тачпады, мобильные и якоря), кадр в окне виден целиком (16:9),
 * клик по окну докручивает до раскрытого состояния, «Смотреть со звуком» — полный ролик.
 *
 * Композиция по золотому сечению: текст — 0.618 ширины, ролик — колонка 0.382;
 * кнопка и низ ролика на одной линии; свободная высота над/под блоком — φ : 1.
 */
export default function HeroScrollVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const lb = useVideoLightbox();
  const reduced = useReducedMotion();
  const [vp, setVp] = useState({ w: 1440, h: 900 });
  const [baseline, setBaseline] = useState<number | null>(null);

  useEffect(() => {
    const upd = () => setVp({ w: document.documentElement.clientWidth, h: window.innerHeight });
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);

  // Нижняя линия текста (низ кнопки) — по ней выравнивается низ окна ролика.
  // offsetTop не зависит от transform, поэтому анимации появления не сбивают замер.
  useEffect(() => {
    const el = copyRef.current;
    if (!el) return;
    const measure = () => setBaseline(el.offsetTop + el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.parentElement) ro.observe(el.parentElement);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const t = useTransform(scrollYProgress, [0.04, EXPAND_END], [0, 1], { clamp: true });

  // Геометрия окна ролика в покое
  const stageH = Math.max(vp.h, STAGE_MIN_H);
  const side = isSideBySide(vp.w, vp.h);
  const gutter = vp.w < 768 ? 24 : 64;
  const x0 = Math.max(0, (vp.w - 1440) / 2) + gutter;
  const C = Math.min(vp.w, 1440) - gutter * 2;
  let box0: { left: number; top: number; width: number; height: number };
  if (side) {
    const w0 = C * G1;
    const h0 = (w0 * 9) / 16;
    const bottomY = baseline ?? stageH * 0.88;
    box0 = { left: x0 + C * G2, top: bottomY - h0, width: w0, height: h0 };
  } else {
    const w0 = C;
    const h0 = (w0 * 9) / 16;
    box0 = { left: x0, top: stageH - (vp.w < 768 ? 24 : 40) - h0, width: w0, height: h0 };
  }

  // Блок с видео растёт сам: позиция и размер → весь экран
  const left = useTransform(t, (v) => box0.left * (1 - v));
  const top = useTransform(t, (v) => box0.top * (1 - v));
  const width = useTransform(t, (v) => box0.width + (vp.w - box0.width) * v);
  const height = useTransform(t, (v) => box0.height + (stageH - box0.height) * v);

  const copyOpacity = useTransform(t, [0, 0.45], [1, 0]);
  const copyX = useTransform(t, [0, 0.6], [0, side ? -vp.w * 0.12 : -60]);
  const plusOpacity = useTransform(t, [0, 0.35], [1, 0]);
  const plusScale = useTransform(t, [0, 0.4], [1, 0.8]);
  const dim = useTransform(t, [0.55, 1], [0, 0.42]);
  const overlayOpacity = useTransform(t, [0.85, 1], [0, 1]);
  const hintOpacity = useTransform(t, [0, 0.18], [1, 0]);
  const hintEvents = useTransform(t, (v) => (v > 0.15 ? "none" : "auto"));
  // «Смотреть со звуком» кликается только в раскрытом состоянии — иначе перехватывает клик по окну
  const overlayEvents = useTransform(t, (v) => (v > 0.85 ? "auto" : "none"));
  const boxShadow = useTransform(t, (v) => `0 34px 70px -34px rgba(0,0,0,${0.35 * (1 - v)})`);

  // Клик по окну — докрутить до раскрытого состояния (то же, что сделать скролл)
  const expand = () => {
    const sec = sectionRef.current;
    if (!sec) return;
    const y = sec.offsetTop + (sec.offsetHeight - window.innerHeight) * EXPAND_END + 2;
    window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section ref={sectionRef} id="top" className="relative" style={{ height: reduced ? "100svh" : "250svh" }}>
      <div
        ref={stageRef}
        className="sticky top-0 h-[100svh] min-h-[640px] overflow-hidden"
        style={{ background: "radial-gradient(90% 95% at 76% 40%, #faf8f3 0%, #f4f2ec 46%, var(--paper) 100%)" }}
      >
        <GridLines theme="light" positions={GOLDEN_GRID} />

        {/* Текст: свободная высота делится φ : 1 (сверху больше воздуха) */}
        <div className="hero-layout container-x relative z-10 flex h-full flex-col" style={{ paddingTop: NAV_H }}>
          <div aria-hidden style={{ flexGrow: 1.618 }} />
          <motion.div ref={copyRef} className="hero-copy-col" style={{ opacity: copyOpacity, x: copyX }}>
            <HeroCopy />
          </motion.div>
          <div aria-hidden style={{ flexGrow: 1 }} />
        </div>

        {SHOW_PLUS && side && (
          <motion.div
            className="fade-in absolute z-10"
            style={{
              left: box0.left,
              width: box0.width,
              top: NAV_H + 24,
              height: Math.max(0, box0.top - NAV_H - 48),
              opacity: plusOpacity,
              scale: plusScale,
              animationDelay: "0.2s",
            }}
          >
            <HeroPlus thickness={LOGO_THICKNESS} scale={1.2} />
          </motion.div>
        )}

        {/* Ролик: блок сам растёт от окна до всего экрана */}
        <motion.div
          className="absolute z-20 overflow-hidden bg-ink"
          style={reduced ? box0 : { left, top, width, height, boxShadow }}
        >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={HERO_VIDEO.loop}
            poster={HERO_VIDEO.poster}
            autoPlay={!reduced}
            muted
            loop
            playsInline
            preload="auto"
          />
          <motion.span className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: dim }} />

          {/* Окно в покое: весь блок — кнопка «раскрыть», play-квадрат в углу */}
          <motion.button
            type="button"
            onClick={expand}
            aria-label="Раскрыть ролик"
            className="group absolute inset-0 flex items-end justify-end"
            style={{ opacity: hintOpacity, pointerEvents: hintEvents }}
          >
            <span className="origin-bottom-right transition-transform duration-300 group-hover:scale-110">
              <PlayGlyph size={56} />
            </span>
          </motion.button>

          {/* Раскрытое состояние */}
          <motion.div
            className="pointer-events-none absolute inset-0 flex items-center justify-center px-6"
            style={{ opacity: overlayOpacity }}
          >
            <motion.button
              type="button"
              onClick={() => lb.show(stageRef.current)}
              style={{ pointerEvents: overlayEvents }}
              className="flex items-center gap-4 bg-white/10 pl-6 font-mono text-[12px] uppercase tracking-[0.16em] text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              Смотреть со звуком
              <PlayGlyph size={56} />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
      <VideoLightbox open={lb.open} from={lb.from} onClose={lb.close} />
      <HeroTypeStyles />

      <style jsx global>{`
        /* Друг под другом: место под окном ролика (16:9 во всю ширину + отступ снизу) */
        #top .hero-layout {
          padding-bottom: calc((100vw - 48px) * 0.5625 + 24px);
        }
        @media (min-width: 768px) {
          #top .hero-layout {
            padding-bottom: calc((100vw - 128px) * 0.5625 + 40px);
          }
        }
        @media (min-width: 640px) and (min-aspect-ratio: 5/4), (min-width: 1024px) {
          #top .hero-layout {
            padding-bottom: 0;
          }
        }
      `}</style>
    </section>
  );
}
