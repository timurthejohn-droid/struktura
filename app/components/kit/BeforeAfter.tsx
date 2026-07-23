"use client";
import { useRef, useState } from "react";

// Слайдер «до / после» в брендовой метафоре: слева чертёж (сетка), справа
// реализация (фото объекта). Тащишь ручку — модель превращается в объект.
// Это буквально то, что делает STRUKTURA, поэтому фишка не украшение.

export default function BeforeAfter({
  afterImg,
  className = "",
}: {
  afterImg: string;
  className?: string;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const move = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
    setPos(p);
  };

  const url = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${afterImg}`;

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden select-none ${className}`}
      style={{ aspectRatio: "16 / 9", border: "1px solid var(--line-dark)", cursor: "ew-resize", touchAction: "none" }}
      onPointerDown={(e) => move(e.clientX)}
      onPointerMove={(e) => {
        if (e.buttons === 1) move(e.clientX);
      }}
    >
      {/* Реализация (фон, справа) */}
      <div className="absolute inset-0" style={{ backgroundImage: `url(${url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <span className="absolute top-3 right-4 font-mono uppercase text-white/80" style={{ fontSize: 10, letterSpacing: "0.14em", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
        Реализация
      </span>

      {/* Чертёж (слева, обрезается ручкой) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, background: "var(--coal-deep)" }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,90,0,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,90,0,0.16) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <span className="absolute top-3 left-4 font-mono uppercase text-orange" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
          Чертёж
        </span>
      </div>

      {/* Ручка */}
      <div className="absolute top-0 bottom-0" style={{ left: `${pos}%`, width: 2, background: "var(--orange)", transform: "translateX(-1px)" }}>
        <div
          className="absolute top-1/2 left-1/2 flex items-center justify-center"
          style={{ transform: "translate(-50%, -50%)", width: 36, height: 36, border: "1px solid var(--orange)", background: "var(--coal-deep)" }}
        >
          <span className="font-mono text-orange" style={{ fontSize: 12 }}>
            ↔
          </span>
        </div>
      </div>
    </div>
  );
}
