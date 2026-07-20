"use client";

import { useMemo, useState } from "react";

export type ProjectCategory = "Фасады" | "Интерьеры" | "Общественные пространства";

export type Project = {
  number: string;
  name: string;
  year: string;
  work: string;
  category: ProjectCategory;
  image: string;
  featured?: boolean;
};

const filters: Array<ProjectCategory | "Все"> = ["Все", "Фасады", "Интерьеры", "Общественные пространства"];

export default function ProjectsCatalog({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | "Все">("Все");
  const visibleProjects = useMemo(
    () => (activeFilter === "Все" ? projects : projects.filter((project) => project.category === activeFilter)),
    [activeFilter, projects],
  );

  return (
    <section className="py-16 md:py-24">
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <p className="eyebrow text-ink/50">Выбранные объекты</p>
            <h2 className="mt-6 max-w-[760px] text-[clamp(32px,4vw,60px)] leading-[0.98]">Работаем с архитектурой в ее реальном масштабе</h2>
          </div>
          <p className="max-w-[290px] font-body text-[14px] leading-[1.45] text-ink/60 md:pb-1">
            Фасады, интерьеры и общественные пространства с уникальной геометрией.
          </p>
        </div>

        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-b border-black/10 pb-4" aria-label="Фильтр проектов">
          {filters.map((filter) => {
            const isActive = filter === activeFilter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className="border-b-2 pb-1 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors"
                style={{ borderColor: isActive ? "var(--orange)" : "transparent", color: isActive ? "var(--ink)" : "rgba(26,26,26,0.45)" }}
                aria-pressed={isActive}
              >
                {filter}
              </button>
            );
          })}
          <span className="ml-auto self-center font-mono text-[11px] tracking-[0.14em] text-ink/35">{String(visibleProjects.length).padStart(2, "0")}</span>
        </div>

        <div className="mt-8 grid gap-x-7 gap-y-14 md:grid-cols-2 md:gap-y-20">
          {visibleProjects.map((project) => (
            <article key={project.number}>
              <div className="group relative aspect-[4/3] overflow-hidden bg-ink">
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}${project.image}`}
                  alt={`${project.name}: ${project.work}`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.035]"
                />
                <div className="absolute inset-x-4 bottom-4 min-h-[108px] border border-black/15 bg-paper/95 text-ink transition-colors duration-300 group-hover:bg-orange group-hover:text-white md:inset-x-5 md:bottom-5 md:min-h-[124px]">
                  <div className="grid grid-cols-[auto_1fr_auto] border-b border-black/15 text-[10px] transition-colors group-hover:border-white/35">
                    <span className="border-r border-black/15 px-3 py-2 font-mono tracking-[0.14em] text-orange group-hover:border-white/35 group-hover:text-white md:px-4">{project.number}</span>
                    <span className="px-3 py-2 font-mono uppercase tracking-[0.14em] text-ink/45 group-hover:text-white/75 md:px-4">{project.category}</span>
                    <span className="border-l border-black/15 px-3 py-2 font-mono tracking-[0.14em] text-ink/45 group-hover:border-white/35 group-hover:text-white/75 md:px-4">{project.year}</span>
                  </div>
                  <div className="flex min-h-[70px] items-center justify-between gap-4 px-3 py-3 md:min-h-[82px] md:px-4">
                    <p className="max-w-[calc(100%-42px)] font-body text-[clamp(15px,1.65vw,23px)] leading-[1.13]">{project.work}</p>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-black/25 font-body text-[17px] leading-none transition-transform duration-300 group-hover:rotate-45 group-hover:border-white">+</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex min-h-[72px] items-start justify-between gap-6 border-t border-black/15 pt-3">
                <div className="flex min-w-0 gap-4">
                  <span className="pt-0.5 font-mono text-[11px] tracking-[0.14em] text-orange">{project.number}</span>
                  <h3 className="text-[clamp(19px,2vw,28px)] leading-[1.05]">{project.name}</h3>
                </div>
                <span className="shrink-0 pt-1 font-mono text-[11px] tracking-[0.14em] text-ink/45">{project.year}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
