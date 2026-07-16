"use client";
import { useReveal } from "./useReveal";

const projects = [
  {
    id: "sberbank",
    name: "Сбербанк-Сити",
    challenge: "1,2 км фасадов с нулевой зазором",
    solution: "Алгоритмическое проектирование всех узлов в BIM, ЧПУ-производство",
    type: "Штаб-квартира",
    year: "2023",
    accent: true,
  },
  {
    id: "lakhta",
    name: "Лахта Центр",
    challenge: "Бесшовные гиперболические параболоиды — арка главного входа",
    solution: "R&D + собственная подсистема STRUKTURA, алгоритмическое раскрой",
    type: "Небоскрёб",
    year: "2022",
    accent: false,
  },
  {
    id: "kremlin",
    name: "Музей Московского Кремля",
    challenge: "Несущий стеклянный пол подземного музея с нулевым швом",
    solution: "Собственные узлы крепления, инженерный R&D под ПД",
    type: "Культурный объект",
    year: "2020",
    accent: false,
  },
  {
    id: "citytower",
    name: "Москва-Сити",
    challenge: "Монументальные художественные панно 400м² в лобби",
    solution: "Совместная разработка с А.Бергером, цифровой контроль цвета",
    type: "Бизнес-центр",
    year: "2021",
    accent: false,
  },
  {
    id: "bank",
    name: "Арт-потолок штаб-квартиры банка",
    challenge: "Кинетическая конструкция из 1200 элементов",
    solution: "Параметрическое проектирование, синхронизация движения",
    type: "Корпоративный",
    year: "2022",
    accent: false,
  },
];

export default function ProjectsGrid() {
  const ref = useReveal();

  return (
    <section className="py-24" style={{ background: "var(--bg)" }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label mb-3">03 — ПРОЕКТЫ</p>
            <h2
              className="font-mono text-white"
              style={{ fontSize: "clamp(28px, 3vw, 48px)" }}
            >
              РЕАЛИЗОВАННЫЕ ОБЪЕКТЫ
            </h2>
          </div>
          <a
            href="/projects"
            className="hidden md:block font-mono text-xs tracking-[0.12em] uppercase text-accent hover:text-white transition-colors border-b border-accent pb-0.5"
          >
            Все проекты →
          </a>
        </div>

        {/* Grid */}
        <div
          ref={ref}
          className="reveal grid gap-px"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            background: "var(--border)",
          }}
        >
          {/* Featured project — spans 2 cols */}
          <div
            className="col-span-2 relative group"
            style={{ background: "var(--bg)", minHeight: "420px" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-90" />
            {/* Placeholder bg */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background:
                  "repeating-linear-gradient(45deg, #FF5A00 0px, #FF5A00 1px, transparent 1px, transparent 40px)",
              }}
            />
            <div className="absolute bottom-0 left-0 p-8 z-10">
              <p className="section-number mb-2">
                01 — {projects[0].type} · {projects[0].year}
              </p>
              <h3
                className="font-mono text-white mb-3"
                style={{ fontSize: "clamp(22px, 2.5vw, 36px)" }}
              >
                {projects[0].name}
              </h3>
              <p className="font-body text-white/60 text-sm mb-4 max-w-sm">
                <span className="text-accent">Вызов:</span> {projects[0].challenge}
              </p>
              <p className="font-body text-white/50 text-sm">
                <span className="text-white/70">Решение:</span> {projects[0].solution}
              </p>
              <div className="mt-6">
                <a
                  href={`/projects/${projects[0].id}`}
                  className="inline-block font-mono text-[11px] tracking-[0.12em] uppercase text-accent border-b border-accent/40 hover:border-accent transition-colors"
                >
                  Читать кейс →
                </a>
              </div>
            </div>
          </div>

          {/* Right column — 2 smaller projects stacked */}
          <div className="flex flex-col gap-px" style={{ background: "transparent" }}>
            {projects.slice(1, 3).map((p, i) => (
              <div
                key={p.id}
                className="relative group flex-1"
                style={{ background: "var(--bg)", minHeight: "210px" }}
              >
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: `repeating-linear-gradient(${i * 30}deg, #888 0px, #888 1px, transparent 1px, transparent 30px)`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 z-10">
                  <p className="section-number mb-1">
                    {String(i + 2).padStart(2, "0")} — {p.year}
                  </p>
                  <h3 className="font-mono text-white text-base">{p.name}</h3>
                  <p className="font-body text-white/50 text-xs mt-1">{p.type}</p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={`/projects/${p.id}`}
                    className="font-mono text-[10px] tracking-[0.12em] uppercase text-accent"
                  >
                    Кейс →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom row — 2 more projects */}
          {projects.slice(3).map((p, i) => (
            <div
              key={p.id}
              className="relative group"
              style={{ background: "var(--bg)", minHeight: "220px" }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background: `repeating-linear-gradient(${90 + i * 45}deg, #888 0px, #888 1px, transparent 1px, transparent 35px)`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 z-10">
                <p className="section-number mb-1">
                  {String(i + 4).padStart(2, "0")} — {p.year}
                </p>
                <h3 className="font-mono text-white text-lg">{p.name}</h3>
                <p className="font-body text-white/50 text-xs mt-1 mb-3">{p.type}</p>
                <p className="font-body text-white/50 text-xs max-w-xs">
                  <span className="text-accent">Вызов:</span> {p.challenge}
                </p>
              </div>
            </div>
          ))}

          {/* CTA cell */}
          <div
            className="flex items-center justify-center p-8"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
            }}
          >
            <a
              href="/projects"
              className="font-mono text-xs tracking-[0.15em] uppercase text-accent hover:text-white transition-colors text-center"
            >
              ВСЕ ПРОЕКТЫ →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
