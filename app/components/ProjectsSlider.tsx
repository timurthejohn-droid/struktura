"use client";
import { useEffect, useState } from "react";
import { useReveal } from "./useReveal";
import { cases } from "./projects/casesData";

// Избранные кейсы на главной: те же данные, что и на странице проектов,
// с реальными кадрами объектов. Клик по превью — переход к нужному кейсу.

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const items = cases;

export default function ProjectsSlider() {
  const revealRef = useReveal();
  const [idx, setIdx] = useState(0);
  const n = items.length;
  const go = (d: number) => setIdx((p) => (p + d + n) % n);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % n), 6500);
    return () => clearInterval(t);
  }, [n]);

  return (
    <section id="projects" className="py-20 md:py-28" style={{ background: "var(--paper)" }}>
      <div className="container-x reveal" ref={revealRef}>
        {/* Шапка блока */}
        <div className="mb-8 grid gap-6 border-b border-black/10 pb-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <p className="eyebrow text-ink/45">Избранные кейсы</p>
            <h2 className="mt-5 max-w-[720px] text-[clamp(28px,3.6vw,54px)] leading-[1.0] text-ink">
              Работаем с архитектурой в её реальном масштабе
            </h2>
          </div>
          <a
            href={`${basePath}/projects`}
            className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:text-orange md:pb-1"
          >
            Все кейсы
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>

        {/* Сцена */}
        <div
          className="relative aspect-[4/5] w-full overflow-hidden bg-coal sm:aspect-[16/10] md:aspect-[16/9]"
          style={{ maxHeight: 620 }}
        >
          {items.map((item, i) => (
            <div
              key={item.slug}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === idx ? 1 : 0, pointerEvents: i === idx ? "auto" : "none" }}
              aria-hidden={i !== idx}
            >
              <img
                src={`${basePath}${item.image}`}
                alt={`${item.name} — ${item.work}`}
                className="absolute inset-0 h-full w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/50" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

              {/* Номер-призрак */}
              <span
                aria-hidden
                className="pointer-events-none absolute right-[3%] top-[4%] select-none font-mono leading-none text-white/[0.08]"
                style={{ fontSize: "clamp(90px,15vw,230px)" }}
              >
                {item.number}
              </span>

              {/* Служебная строка */}
              <div className="absolute inset-x-6 top-6 flex items-center justify-between md:inset-x-8 md:top-7">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">{item.category}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">{item.year}</span>
              </div>

              {/* Подпись кейса */}
              <div className="absolute inset-x-6 bottom-6 max-w-[640px] md:inset-x-8 md:bottom-8">
                <p className="max-w-[86%] font-mono text-[10px] uppercase leading-[1.5] tracking-[0.16em] text-orange md:max-w-none md:text-[11px]">
                  {item.work}
                </p>
                <h3 className="mt-4 text-white" style={{ fontSize: "clamp(24px,3.4vw,52px)", lineHeight: 1.02 }}>
                  {item.name}
                </h3>
                {item.href ? (
                  <a
                    href={`${basePath}${item.href}`}
                    className="mt-6 inline-flex items-center gap-3 border-b border-orange pb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors hover:text-orange"
                  >
                    Читать кейс
                    <span aria-hidden>→</span>
                  </a>
                ) : (
                  <a
                    href={`${basePath}/projects`}
                    className="mt-6 inline-flex items-center gap-3 border-b border-white/35 pb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-white/80 transition-colors hover:border-orange hover:text-orange"
                  >
                    Смотреть в каталоге
                    <span aria-hidden>→</span>
                  </a>
                )}
              </div>
            </div>
          ))}

          {/* Стрелки */}
          <div className="absolute bottom-6 right-6 z-10 flex gap-2 md:bottom-8 md:right-8">
            <button
              onClick={() => go(-1)}
              aria-label="Предыдущий кейс"
              className="flex h-9 w-9 items-center justify-center border border-white/25 text-white transition-colors hover:bg-white hover:text-ink md:h-11 md:w-11"
            >
              ←
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Следующий кейс"
              className="flex h-9 w-9 items-center justify-center border border-white/25 text-white transition-colors hover:bg-white hover:text-ink md:h-11 md:w-11"
            >
              →
            </button>
          </div>
        </div>

        {/* Индикаторы */}
        <div className="mt-6 flex items-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.slug}
              onClick={() => setIdx(i)}
              aria-label={`Кейс ${item.number}: ${item.name}`}
              aria-current={i === idx ? "true" : undefined}
              className="h-[3px]"
              style={{
                width: i === idx ? 48 : 22,
                background: i === idx ? "var(--orange)" : "rgba(0,0,0,0.18)",
                transition: "width 0.35s var(--ease-out), background-color 0.3s ease",
              }}
            />
          ))}
          <span className="ml-4 font-mono text-[11px] tracking-[0.1em] text-ink/40">
            {String(idx + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
