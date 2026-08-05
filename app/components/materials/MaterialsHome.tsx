"use client";
import Link from "next/link";
import { motion } from "framer-motion";

// Блок «Материалы» на главной.
// Видео materials_new.mp4 залито на всю ширину блока (full-bleed фон секции),
// текст лежит поверх слева. Мягкий скрим слева направо в цвет фона видео
// (нейтральный светло-серый ~#C4C4C4) держит текст читаемым, а справа видео
// остаётся чистым и открытым.

const BP = process.env.NEXT_PUBLIC_BASE_PATH || "";
const VIDEO_BG = "#c4c4c4"; // фон студийного видео materials_new.mp4

export default function MaterialsHome() {
  return (
    <section id="materials" className="relative overflow-hidden" style={{ background: VIDEO_BG }}>
      {/* ——— Видео: на всю ширину блока ——— */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={`${BP}/materials/materials_new.mp4`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      />

      {/* ——— Скрим слева: держит текст читаемым поверх видео ——— */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, #c4c4c4 0%, rgba(196,196,196,0.92) 32%, rgba(196,196,196,0.45) 55%, rgba(196,196,196,0) 72%)",
        }}
      />

      {/* ——— Текст: поверх видео, слева ——— */}
      <div className="relative z-10 grid items-stretch lg:grid-cols-2">
        <div
          className="flex items-center py-24 lg:py-40"
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

        {/* правая колонка — пустая, видео просвечивает под текстовым слоем */}
        <div className="min-h-[320px] lg:min-h-[600px]" aria-hidden />
      </div>
    </section>
  );
}
