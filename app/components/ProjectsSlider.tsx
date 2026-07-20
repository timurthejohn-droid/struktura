"use client";
import { useEffect, useState } from "react";
import { useReveal } from "./useReveal";

type Project = {
  name: string;
  type: string;
  place: string;
  year: string;
  tone: string; // placeholder accent
};

const projects: Project[] = [
  { name: "Сбербанк-Сити", type: "Фасадные и интерьерные решения штаб-квартиры", place: "Москва", year: "2023", tone: "#2b2b2b" },
  { name: "Лахта Центр", type: "Арка главного входа", place: "Санкт-Петербург", year: "2022", tone: "#243038" },
  { name: "Музей Кремля", type: "Стеклянный пол подземного музея", place: "Москва", year: "2020", tone: "#33271c" },
  { name: "Москва-Сити", type: "Монументальные художественные панно", place: "Москва", year: "2021", tone: "#2c2630" },
];

export default function ProjectsSlider() {
  const revealRef = useReveal();
  const [idx, setIdx] = useState(0);
  const n = projects.length;
  const go = (d: number) => setIdx((p) => (p + d + n) % n);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);

  const p = projects[idx];

  return (
    <section id="projects" className="py-20 md:py-28" style={{ background: "var(--paper)" }}>
      <div className="container-x reveal" ref={revealRef}>
        {/* Stage */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 9", maxHeight: 620 }}>
          {projects.map((proj, i) => (
            <div
              key={proj.name}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === idx ? 1 : 0, pointerEvents: i === idx ? "auto" : "none" }}
            >
              {/* Placeholder visual */}
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(120% 120% at 80% 10%, ${proj.tone} 0%, #141414 70%)`,
                }}
              />
              <div
                className="absolute inset-0 opacity-[0.18]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 26px)",
                }}
              />
              {/* Giant ghost index */}
              <div
                className="absolute right-6 top-2 font-mono text-white/[0.06] leading-none select-none"
                style={{ fontSize: "clamp(120px, 22vw, 320px)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Top label */}
              <div className="absolute top-7 left-7">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50">
                  {proj.place} · {proj.year}
                </span>
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-7 left-7 right-7 flex flex-wrap items-end justify-between gap-6">
                <div className="max-w-xl">
                  <h3 className="text-white mb-3" style={{ fontSize: "clamp(28px, 4vw, 56px)" }}>
                    {proj.name}
                  </h3>
                  <p className="font-body text-white/60 text-sm md:text-base max-w-md">{proj.type}</p>
                  <a
                    href="#projects"
                    className="inline-flex mt-6 font-mono text-[11px] tracking-[0.12em] uppercase text-white border-b border-orange pb-1 hover:text-orange transition-colors"
                  >
                    Читать кейс →
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* Arrows */}
          <div className="absolute bottom-7 right-7 flex gap-2 z-10">
            <button
              onClick={() => go(-1)}
              aria-label="Назад"
              className="w-11 h-11 flex items-center justify-center text-white border border-white/25 hover:bg-white hover:text-ink transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Вперёд"
              className="w-11 h-11 flex items-center justify-center text-white border border-white/25 hover:bg-white hover:text-ink transition-colors"
            >
              →
            </button>
          </div>
        </div>

        {/* Dots / progress */}
        <div className="flex items-center gap-2 mt-6">
          {projects.map((proj, i) => (
            <button
              key={proj.name}
              onClick={() => setIdx(i)}
              aria-label={proj.name}
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
