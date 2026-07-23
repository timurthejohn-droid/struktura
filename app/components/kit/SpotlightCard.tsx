"use client";
import { useRef } from "react";

// Спотлайт-карточка: за курсором едет мягкое оранжевое пятно света.
// Тёмный фон + острые углы + чертёжные засечки по углам — карточка
// в характере блока «Подсистемы».

export default function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`group relative overflow-hidden ${className}`}
      style={{ border: "1px solid var(--line-dark)", background: "var(--coal-deep)" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{
          background: "radial-gradient(280px circle at var(--x) var(--y), rgba(255,90,0,0.18), transparent 62%)",
          transition: "opacity 0.35s ease",
        }}
        aria-hidden
      />
      <span className="absolute top-0 left-0" style={{ width: 12, height: 12, borderTop: "1px solid var(--orange)", borderLeft: "1px solid var(--orange)" }} aria-hidden />
      <span className="absolute bottom-0 right-0" style={{ width: 12, height: 12, borderBottom: "1px solid var(--orange)", borderRight: "1px solid var(--orange)" }} aria-hidden />
      <div className="relative">{children}</div>
    </div>
  );
}
