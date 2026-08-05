"use client";
import Link from "next/link";
import { motion } from "framer-motion";

// Блок «Материалы» на главной.
// Весь блок залит цветом фона видео (нейтральный светло-серый ~#C4C4C4),
// поэтому левая текстовая часть и видео справа читаются как одна плоскость.
// Левый край видео растворяется в этом же сером — стыка колонок не видно,
// на текст видео не наезжает.

const BP = process.env.NEXT_PUBLIC_BASE_PATH || "";
const VIDEO_BG = "#c4c4c4"; // фон студийного видео materials_main.mp4

export default function MaterialsHome() {
  return (
    <section id="materials" className="relative overflow-hidden" style={{ background: VIDEO_BG }}>
      <div className="grid items-stretch lg:grid-cols-2">
        {/* ——— Текст: слева, на фоне того же серого ——— */}
        <div
          className="relative z-10 flex items-center py-24 lg:py-40"
          style={{
            paddingLeft: "max(24px, calc((100vw - 1440px) / 2 + 64px))",
            paddingRight: "24px",
          }}
        >
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="font-mono uppercase"
              style={{ fontSize: 11, letterSpacing: "0.18em", lineHeight: 1.7, color: "rgba(0,0,0,0.5)" }}
            >
              Форма · Масштаб · Кинетика · Акустика — и&nbsp;это только четыре из&nbsp;девяти возможностей
            </p>

            <h2 className="text-ink mt-6" style={{ fontSize: "clamp(30px, 4vw, 60px)", lineHeight: 1.02 }}>
              Безграничные возможности. <span className="text-orange">Доказано проектами.</span>
            </h2>

            <p
              className="font-body text-ink-soft mt-6 max-w-md"
              style={{ fontSize: "clamp(15px, 1.3vw, 18px)", lineHeight: 1.55 }}
            >
              Металл, стекло, камень, композиты — карта инженерных возможностей
              с&nbsp;реальными кейсами: от&nbsp;Cloud Gate до&nbsp;Лахта Центра.
            </p>

            <div className="mt-10">
              <Link href="/materials" className="btn btn-orange">
                Смотреть все возможности
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ——— Видео: справа, вытекает к правому краю, растворяется в сером ——— */}
        <div className="relative min-h-[320px] lg:min-h-[600px]">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={`${BP}/materials/materials_main.mp4`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
          />
          {/* растворение левого края видео в фоне текста — стыка колонок не видно */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-2/3 lg:w-1/2"
            style={{ background: `linear-gradient(90deg, ${VIDEO_BG} 0%, rgba(196,196,196,0) 100%)` }}
            aria-hidden
          />
          {/* на мобиле видео уходит под текст сверху — мягкий переход верхней кромки */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-24 lg:hidden"
            style={{ background: `linear-gradient(180deg, ${VIDEO_BG} 0%, rgba(196,196,196,0) 100%)` }}
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
