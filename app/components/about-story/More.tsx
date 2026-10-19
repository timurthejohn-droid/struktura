"use client";

import { useId, useState, type ReactNode } from "react";

// Кнопка «+» — длинный текст спрятан, раскрывается по клику.
// Высота анимируется через grid-template-rows 0fr → 1fr (без замеров в JS).
export default function More({
  label = "Читать подробнее",
  theme = "dark",
  children,
}: {
  label?: string;
  theme?: "dark" | "light";
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const dark = theme === "dark";

  return (
    <div className={`border-t ${dark ? "border-white/12" : "border-black/10"}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={`group flex w-full items-center justify-between gap-6 py-5 text-left font-mono text-[12px] uppercase tracking-[0.16em] transition-colors ${
          dark ? "text-white/60 hover:text-white" : "text-ink/60 hover:text-ink"
        }`}
      >
        <span>{open ? "Свернуть" : label}</span>
        <span
          aria-hidden
          className={`relative flex h-10 w-10 shrink-0 items-center justify-center border transition-colors duration-300 ${
            open
              ? "border-orange bg-orange"
              : dark
                ? "border-white/20 group-hover:border-orange"
                : "border-black/20 group-hover:border-orange"
          }`}
        >
          <span
            className={`absolute h-px w-4 transition-colors ${open ? "bg-white" : dark ? "bg-white" : "bg-ink"}`}
          />
          <span
            className={`absolute h-4 w-px transition-transform duration-300 [transition-timing-function:var(--ease-out)] ${
              open ? "scale-y-0 bg-white" : dark ? "bg-white" : "bg-ink"
            }`}
          />
        </span>
      </button>

      <div
        id={id}
        className="grid transition-[grid-template-rows] duration-500 [transition-timing-function:var(--ease-out)] motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden" aria-hidden={!open}>
          <div
            className={`pb-8 pt-1 transition-opacity duration-500 motion-reduce:transition-none ${
              open ? "opacity-100" : "opacity-0"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
