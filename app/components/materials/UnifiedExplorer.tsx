"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CAPABILITIES, CaseItem, FAMILIES, MATERIALS, Material } from "./materialsData";
import {
  CAP_SHORT,
  LEVEL_LABEL,
  Level,
  capsOf,
  levelFor,
  materialsOf,
  matrixStats,
  proofFor,
} from "./capabilityMatrix";
import MaterialRadar from "./MaterialRadar";

// Каталог с двумя входами. Оба входа сходятся в ОДНУ карточку материала —
// это принципиально: иначе человек не понимает, всё ли он увидел.
//   вход «по возможности» — 9 возможностей → материалы внутри
//   вход «по материалу»   — 6 семейств → 29 материалов → радар возможностей
// entry задаёт стартовый вход, toggle показывает переключатель.

type Entry = "capability" | "material";

const DOT: Record<Level, string> = { proven: "●", standard: "◐", possible: "○" };

function LevelChip({ level, compact = false }: { level: Level; compact?: boolean }) {
  const color =
    level === "proven" ? "var(--orange)" : level === "standard" ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)";
  return (
    <span
      className="font-mono uppercase inline-flex items-center gap-1.5 whitespace-nowrap"
      style={{ fontSize: compact ? 9 : 10, letterSpacing: "0.1em", color }}
    >
      <span style={{ fontSize: compact ? 8 : 9 }}>{DOT[level]}</span>
      {compact ? LEVEL_LABEL[level].split(" ")[0] : LEVEL_LABEL[level]}
    </span>
  );
}

function CaseRow({ item, index }: { item: CaseItem; index: number }) {
  return (
    <div className="py-4" style={{ borderTop: "1px solid var(--line-dark)" }}>
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <h4 className="font-mono text-white uppercase" style={{ fontSize: 14, letterSpacing: "0.02em" }}>
          <span className="text-orange mr-3">{String(index + 1).padStart(2, "0")}</span>
          {item.title}
        </h4>
        <span className="font-mono text-white/40 uppercase" style={{ fontSize: 10, letterSpacing: "0.1em" }}>
          {item.meta}
        </span>
      </div>
      <p className="font-body text-white/55 mt-2 max-w-2xl" style={{ fontSize: 13.5, lineHeight: 1.55 }}>
        {item.desc}
      </p>
    </div>
  );
}

function ProofBlock({ label, items }: { label: string; items: CaseItem[] }) {
  if (!items.length) return null;
  return (
    <div className="mt-7">
      <p className="font-mono text-orange uppercase mb-1" style={{ fontSize: 10.5, letterSpacing: "0.2em" }}>
        {label}
      </p>
      {items.map((it, i) => (
        <CaseRow key={it.title} item={it} index={i} />
      ))}
    </div>
  );
}

export default function UnifiedExplorer({
  entry: initialEntry = "capability",
  toggle = true,
}: {
  entry?: Entry;
  toggle?: boolean;
}) {
  const [entry, setEntry] = useState<Entry>(initialEntry);
  const [capSlug, setCapSlug] = useState<string | null>(null); // раскрытая возможность (вход 1)
  const [openFamily, setOpenFamily] = useState<string>(FAMILIES[0].id);
  const [material, setMaterial] = useState<Material | null>(null);
  const [selCap, setSelCap] = useState<string | null>(null); // возможность в карточке
  const panelRef = useRef<HTMLDivElement>(null);

  const cap = CAPABILITIES.find((c) => c.slug === capSlug) ?? null;
  const stats = useMemo(() => matrixStats(), []);

  const scrollPanelTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
    panelRef.current?.scrollTo({ top: 0, behavior });
    // на узких экранах колонки складываются: подводим панель к экрану,
    // иначе выбор материала выглядит так, будто ничего не произошло
    if (window.innerWidth < 1024) {
      requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior, block: "start" }));
    }
  };

  // ——— вход 1: возможность → её материалы, отсортированные по уровню ———
  const capGroups = useMemo(() => {
    if (!cap) return [];
    const rows = materialsOf(cap.slug);
    return FAMILIES.map((family) => ({
      family,
      items: rows.filter((r) => r.material.family === family.id),
    })).filter((g) => g.items.length > 0);
  }, [cap]);

  // ——— вход 2: семейство → материалы ———
  const famGroups = useMemo(
    () =>
      FAMILIES.map((family) => ({
        family,
        items: MATERIALS.filter((m) => m.family === family.id),
      })),
    []
  );

  const openCapability = (slug: string) => {
    const c = CAPABILITIES.find((x) => x.slug === slug);
    if (!c) return;
    setCapSlug(slug);
    const first = materialsOf(slug)[0];
    setMaterial(first?.material ?? null);
    setSelCap(slug);
    scrollPanelTop();
  };

  const pickMaterial = (m: Material, cs?: string) => {
    setMaterial(m);
    const best = cs ?? capsOf(m.name)[0]?.cap.slug ?? null;
    setSelCap(best);
    scrollPanelTop();
  };

  const switchEntry = (e: Entry) => {
    setEntry(e);
    if (e === "material") {
      setCapSlug(null);
      if (material) setOpenFamily(material.family);
    } else if (material) {
      // сохраняем контекст: открываем возможность, по которой смотрели материал
      const slug = selCap ?? capsOf(material.name)[0]?.cap.slug ?? null;
      setCapSlug(slug);
    }
  };

  // deep-link: /lab/materials-a#kinetika
  useEffect(() => {
    const slug = window.location.hash.replace("#", "");
    if (CAPABILITIES.some((c) => c.slug === slug)) openCapability(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const family = material ? FAMILIES.find((f) => f.id === material.family) : null;
  const idxInFamily = material
    ? MATERIALS.filter((m) => m.family === material.family).findIndex((m) => m.name === material.name) + 1
    : 1;
  const code = `${family?.n ?? "01"}.${String(idxInFamily).padStart(2, "0")}`;

  const selCapObj = CAPABILITIES.find((c) => c.slug === selCap) ?? null;
  const selLevel = material && selCap ? levelFor(material.name, selCap) : null;
  const proof = material && selCap ? proofFor(material.name, selCap) : null;
  const caps = material ? capsOf(material.name) : [];

  return (
    <div className="relative">
      <span className="hidden lg:block absolute -bottom-5 -left-5" style={{ width: 22, height: 22, borderLeft: "1px solid var(--orange)", borderBottom: "1px solid var(--orange)" }} aria-hidden />
      <span className="hidden lg:block absolute -bottom-5 -right-5" style={{ width: 22, height: 22, borderRight: "1px solid var(--orange)", borderBottom: "1px solid var(--orange)" }} aria-hidden />

      {/* ————— Тумблер входа ————— */}
      {toggle && (
        <div
          className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 md:px-6 py-4"
          style={{ border: "1px solid var(--line-light)", borderBottom: "none", background: "var(--paper-card)" }}
        >
          <span className="font-mono uppercase text-ink/40" style={{ fontSize: 10, letterSpacing: "0.16em" }}>
            Вход в каталог
          </span>
          <div className="flex" style={{ border: "1px solid var(--line-light)" }}>
            {([
              ["capability", "По возможности"],
              ["material", "По материалу"],
            ] as [Entry, string][]).map(([id, label]) => {
              const on = entry === id;
              return (
                <button
                  key={id}
                  onClick={() => switchEntry(id)}
                  aria-pressed={on}
                  className="font-mono uppercase px-4 md:px-5 py-2.5"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    background: on ? "var(--orange)" : "transparent",
                    color: on ? "#fff" : "var(--ink-soft)",
                    transition: "background-color 0.2s ease, color 0.2s ease",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <span className="font-mono uppercase text-ink/35 ml-auto hidden md:block" style={{ fontSize: 10, letterSpacing: "0.12em" }}>
            {stats.proven} доказано · {stats.standard} стандартно · {stats.possible} можно разработать
          </span>
        </div>
      )}

      <div className="grid lg:grid-cols-[0.42fr_1fr]" style={{ border: "1px solid var(--line-light)", background: "var(--paper)" }}>
        {/* ————— Левая колонка ————— */}
        <aside
          className="flex flex-col no-scrollbar lg:overflow-y-auto"
          style={{ borderRight: "1px solid var(--line-light)", maxHeight: "calc(100vh - 140px)" }}
        >
          {entry === "material" ? (
            /* — Вход 2: семейства → материалы — */
            <div key="by-material" className="env-slide flex flex-col flex-1">
              <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--line-light)" }}>
                <span className="font-mono text-orange uppercase" style={{ fontSize: 12, letterSpacing: "0.14em" }}>
                  Каталог материалов
                </span>
              </div>

              {famGroups.map(({ family: f, items }) => {
                const open = openFamily === f.id;
                return (
                  <div key={f.id}>
                    <button
                      onClick={() => setOpenFamily(open ? "" : f.id)}
                      className="w-full flex items-center justify-between gap-3 px-6 py-4 text-left"
                      style={{ borderBottom: "1px solid var(--line-light)" }}
                    >
                      <span className="font-mono uppercase" style={{ fontSize: 12.5, letterSpacing: "0.1em", color: open ? "var(--orange)" : "var(--ink)" }}>
                        <span className="text-ink/30 mr-3">{f.n}</span>
                        {f.name}
                      </span>
                      <span className="font-mono" style={{ fontSize: 15, color: open ? "var(--orange)" : "var(--ink-soft)" }}>
                        {open ? "–" : "+"}
                      </span>
                    </button>

                    {open &&
                      items.map((m) => {
                        const on = material?.name === m.name;
                        const list = capsOf(m.name);
                        const proven = list.filter((x) => x.level === "proven").length;
                        return (
                          <button
                            key={m.name}
                            onClick={() => pickMaterial(m)}
                            className="w-full flex items-center gap-3 px-6 py-3 text-left"
                            style={{
                              borderBottom: "1px solid var(--line-light)",
                              background: on ? "rgba(255,90,0,0.07)" : "transparent",
                              boxShadow: on ? "inset 3px 0 0 var(--orange)" : undefined,
                            }}
                          >
                            <span className="font-mono uppercase flex-1" style={{ fontSize: 12, letterSpacing: "0.06em", color: on ? "var(--orange)" : "var(--ink)" }}>
                              {m.name}
                            </span>
                            {/* сила материала: сколько возможностей и сколько доказано */}
                            <span className="font-mono" style={{ fontSize: 10, color: "var(--ink-soft)" }}>
                              {list.length}
                            </span>
                            {proven > 0 && (
                              <span className="font-mono text-orange" style={{ fontSize: 10 }}>
                                ●{proven}
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>
                );
              })}

              <div className="mt-auto px-6 py-5">
                <p className="font-mono text-ink/35 uppercase" style={{ fontSize: 10, letterSpacing: "0.12em", lineHeight: 1.7 }}>
                  29 материалов · 6 семейств · {stats.total} связей
                </p>
              </div>
            </div>
          ) : !cap ? (
            /* — Вход 1, уровень 1: возможности — */
            <div key="caps" className="env-slide flex flex-col flex-1">
              <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--line-light)" }}>
                <span className="font-mono text-orange uppercase" style={{ fontSize: 12, letterSpacing: "0.14em" }}>
                  Каталог возможностей
                </span>
              </div>
              {CAPABILITIES.map((c) => {
                const rows = materialsOf(c.slug);
                const proven = rows.filter((r) => r.level === "proven").length;
                return (
                  <button
                    key={c.slug}
                    onClick={() => openCapability(c.slug)}
                    className="group w-full flex items-center gap-4 px-6 py-[18px] text-left transition-colors hover:bg-white"
                    style={{ borderBottom: "1px solid var(--line-light)" }}
                  >
                    <span className="font-mono text-orange" style={{ fontSize: 11 }}>
                      {c.n}
                    </span>
                    <span className="font-mono uppercase text-ink flex-1" style={{ fontSize: 13, letterSpacing: "0.08em" }}>
                      {c.title}
                    </span>
                    <span className="font-mono text-ink/35" style={{ fontSize: 10.5 }}>
                      {rows.length}
                    </span>
                    {proven > 0 && (
                      <span className="font-mono text-orange" style={{ fontSize: 10 }}>
                        ●{proven}
                      </span>
                    )}
                    <span className="font-mono text-ink/25 group-hover:text-orange transition-colors" style={{ fontSize: 13 }}>
                      →
                    </span>
                  </button>
                );
              })}
              <div className="mt-auto px-6 py-5">
                <p className="font-mono text-ink/35 uppercase" style={{ fontSize: 10, letterSpacing: "0.12em", lineHeight: 1.7 }}>
                  9 возможностей · 29 материалов · {stats.total} связей
                </p>
              </div>
            </div>
          ) : (
            /* — Вход 1, уровень 2: материалы возможности — */
            <div key={cap.slug} className="env-slide flex flex-col flex-1">
              <button
                onClick={() => {
                  setCapSlug(null);
                  setMaterial(null);
                  setSelCap(null);
                }}
                className="w-full flex items-center gap-3 px-6 py-4 text-left transition-colors hover:bg-white"
                style={{ borderBottom: "1px solid var(--line-light)" }}
              >
                <span className="font-mono text-orange" style={{ fontSize: 13 }}>←</span>
                <span className="font-mono uppercase text-ink-soft" style={{ fontSize: 10.5, letterSpacing: "0.12em" }}>
                  Все возможности
                </span>
              </button>

              <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--line-light)", background: "rgba(255,90,0,0.06)" }}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-orange uppercase" style={{ fontSize: 13, letterSpacing: "0.1em" }}>
                    {cap.title}
                  </span>
                  <span className="font-mono text-ink/35" style={{ fontSize: 10.5 }}>
                    {cap.n} / 09
                  </span>
                </div>
              </div>

              {capGroups.map(({ family: f, items }) => (
                <div key={f.id}>
                  <div className="px-6 py-3" style={{ borderBottom: "1px solid var(--line-light)", background: "rgba(0,0,0,0.02)" }}>
                    <span className="font-mono uppercase text-ink-soft" style={{ fontSize: 10.5, letterSpacing: "0.12em" }}>
                      {f.name}
                    </span>
                  </div>
                  {items.map(({ material: m, level }) => {
                    const on = material?.name === m.name;
                    return (
                      <button
                        key={m.name}
                        onClick={() => pickMaterial(m, cap.slug)}
                        className="w-full flex items-center gap-3 px-6 py-3 text-left"
                        style={{
                          borderBottom: "1px solid var(--line-light)",
                          background: on ? "rgba(255,90,0,0.07)" : "transparent",
                          boxShadow: on ? "inset 3px 0 0 var(--orange)" : undefined,
                        }}
                      >
                        <span
                          className="font-mono"
                          style={{
                            fontSize: 10,
                            color:
                              level === "proven"
                                ? "var(--orange)"
                                : level === "standard"
                                ? "var(--ink-soft)"
                                : "rgba(0,0,0,0.25)",
                          }}
                        >
                          {DOT[level]}
                        </span>
                        <span className="font-mono uppercase flex-1" style={{ fontSize: 12, letterSpacing: "0.06em", color: on ? "var(--orange)" : "var(--ink)" }}>
                          {m.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}

              <div className="mt-auto px-6 py-5" style={{ borderTop: "1px solid var(--line-light)" }}>
                <p className="font-mono text-ink/35 uppercase" style={{ fontSize: 9.5, letterSpacing: "0.1em", lineHeight: 1.8 }}>
                  ● доказано проектом · ◐ стандартно · ○ можно разработать
                </p>
              </div>
            </div>
          )}
        </aside>

        {/* ————— Правая панель: одна и та же для обоих входов ————— */}
        <div ref={panelRef} className="no-scrollbar lg:overflow-y-auto" style={{ background: "var(--coal-deep)", maxHeight: "calc(100vh - 140px)" }}>
          {!material ? (
            <div className="flex flex-col justify-between min-h-[420px] lg:min-h-[560px] p-8 md:p-12">
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-white/50 uppercase" style={{ fontSize: 11, letterSpacing: "0.18em" }}>
                  Каталог
                </span>
                <span className="font-mono text-orange/70 uppercase" style={{ fontSize: 10, letterSpacing: "0.2em" }}>
                  STRUKTURA<span style={{ fontSize: 8, verticalAlign: "super" }}>+</span>
                </span>
              </div>
              <div>
                <h3 className="font-mono text-white uppercase" style={{ fontSize: "clamp(26px, 3.2vw, 46px)", lineHeight: 1.05 }}>
                  {entry === "material" ? (
                    <>
                      Возьмите материал —
                      <br />
                      <span className="text-white/45">увидите, что он умеет</span>
                    </>
                  ) : (
                    <>
                      Ищите возможность,
                      <br />
                      <span className="text-white/45">а не сплав</span>
                    </>
                  )}
                </h3>
                <p className="font-body text-white/60 mt-6 max-w-xl" style={{ fontSize: 15.5, lineHeight: 1.6 }}>
                  {entry === "material"
                    ? "Профиль на 9 осях показывает, где материал силён, где работает штатно, а где нужен R&D. Клик по оси — проекты, статьи и мировые кейсы, доказывающие эту возможность."
                    : "Выберите раздел слева — внутри материалы, отсортированные по уровню доказанности, их характеристики и кейсы."}
                </p>
              </div>
              <p className="font-mono text-white/35 uppercase" style={{ fontSize: 10.5, letterSpacing: "0.16em", lineHeight: 1.8 }}>
                Материал <span className="text-orange">×</span> геометрия <span className="text-orange">×</span> технология{" "}
                <span className="text-orange">×</span> конструкция
              </p>
            </div>
          ) : (
            <div key={material.name} className="env-slide">
              {/* шапка */}
              <div className="flex items-center justify-between px-6 md:px-9 pt-7">
                <span className="font-mono text-white/50 uppercase" style={{ fontSize: 11, letterSpacing: "0.18em" }}>
                  Материал / {family?.name ?? ""}
                </span>
                <span className="font-mono text-white/50" style={{ fontSize: 11, letterSpacing: "0.1em" }}>
                  {code}
                </span>
              </div>

              <div className="px-6 md:px-9 mt-4">
                <h3 className="font-mono text-white uppercase" style={{ fontSize: "clamp(24px, 2.7vw, 38px)", lineHeight: 1.05 }}>
                  {material.name}
                </h3>
                <p className="font-mono text-orange uppercase mt-2" style={{ fontSize: 10.5, letterSpacing: "0.12em" }}>
                  {material.sub}
                </p>
              </div>

              {/* радар + карта возможностей */}
              <div className="px-6 md:px-9 mt-6 grid lg:grid-cols-[1fr_0.85fr] gap-6 items-center">
                <div style={{ border: "1px solid var(--line-dark)", background: "var(--coal)" }} className="p-2">
                  <MaterialRadar
                    material={material.name}
                    selected={selCap}
                    onSelect={(s) => setSelCap(s)}
                  />
                </div>

                <div>
                  <p className="font-mono text-white/40 uppercase mb-3" style={{ fontSize: 10, letterSpacing: "0.16em" }}>
                    Возможности · {caps.length} из 9
                  </p>
                  <div className="flex flex-col" style={{ gap: 1, background: "var(--line-dark)" }}>
                    {caps.map(({ cap: c, level }) => {
                      const on = selCap === c.slug;
                      return (
                        <button
                          key={c.slug}
                          onClick={() => setSelCap(c.slug)}
                          className="flex items-center gap-3 px-3 py-2.5 text-left"
                          style={{
                            background: on ? "rgba(255,90,0,0.16)" : "var(--coal-deep)",
                            boxShadow: on ? "inset 2px 0 0 var(--orange)" : undefined,
                            transition: "background-color 0.2s ease",
                          }}
                        >
                          <span className="font-mono" style={{ fontSize: 10, color: level === "proven" ? "var(--orange)" : "rgba(255,255,255,0.45)" }}>
                            {DOT[level]}
                          </span>
                          <span className="font-mono uppercase flex-1 text-white" style={{ fontSize: 11, letterSpacing: "0.08em" }}>
                            {CAP_SHORT[c.slug]}
                          </span>
                          <LevelChip level={level} compact />
                        </button>
                      );
                    })}
                  </div>
                  <p className="font-mono text-white/30 uppercase mt-3" style={{ fontSize: 9.5, letterSpacing: "0.1em", lineHeight: 1.7 }}>
                    Луч длиннее — позиция сильнее.
                    <br />
                    Клик по оси или строке — доказательства.
                  </p>
                </div>
              </div>

              {/* выбранная возможность + доказательства */}
              {selCapObj && selLevel && proof && (
                <div key={selCapObj.slug} className="px-6 md:px-9 py-8 mt-8 env-slide" style={{ borderTop: "1px solid rgba(255,90,0,0.35)" }}>
                  <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    <h4 className="font-mono text-white uppercase" style={{ fontSize: "clamp(18px, 1.9vw, 26px)", letterSpacing: "0.02em" }}>
                      <span className="text-orange mr-3">{selCapObj.n}</span>
                      {material.name} <span className="text-orange">×</span> {selCapObj.title}
                    </h4>
                    <LevelChip level={selLevel} />
                  </div>
                  <p className="font-body text-white/60 mt-3 max-w-2xl" style={{ fontSize: 14.5, lineHeight: 1.6 }}>
                    {selCapObj.desc}
                  </p>

                  {proof.total > 0 ? (
                    <>
                      <ProofBlock label="Наши проекты" items={proof.projects} />
                      <ProofBlock label="Статьи" items={proof.articles} />
                      <ProofBlock label="Мировые кейсы" items={proof.world} />
                    </>
                  ) : (
                    <div className="mt-6 p-5" style={{ border: "1px solid var(--line-dark)" }}>
                      <p className="font-mono text-white/70 uppercase" style={{ fontSize: 11.5, letterSpacing: "0.1em", lineHeight: 1.7 }}>
                        {selLevel === "standard"
                          ? "Штатная для нас работа — публичного кейса именно на эту пару в разделе пока нет."
                          : "Пара не из каталога: считаем, прототипируем и подтверждаем образцом до запуска."}
                      </p>
                      <p className="font-body text-white/45 mt-2" style={{ fontSize: 13.5, lineHeight: 1.55 }}>
                        Покажем закрытые проекты и образцы на встрече.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* характеристики */}
              <div className="px-6 md:px-9 py-8" style={{ borderTop: "1px solid rgba(255,90,0,0.35)" }}>
                <p className="font-mono text-orange uppercase mb-6" style={{ fontSize: 11, letterSpacing: "0.2em" }}>
                  Характеристики
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: 1, background: "var(--line-dark)" }}>
                  {[
                    { l: "Формат", v: material.fmt },
                    { l: "Вес", v: material.weight },
                    { l: "Зона", v: material.zone },
                    { l: "Пожарный статус", v: material.fire },
                  ].map((s) => (
                    <div key={s.l} className="p-4" style={{ background: "var(--coal-deep)" }}>
                      <div className="font-mono uppercase text-white/40" style={{ fontSize: 9.5, letterSpacing: "0.12em" }}>
                        {s.l}
                      </div>
                      <div className="font-body text-white mt-1.5" style={{ fontSize: 13.5, lineHeight: 1.4 }}>
                        {s.v}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-7">
                  <div>
                    <p className="font-mono uppercase text-white/40 mb-2" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
                      Что может
                    </p>
                    {material.can.map((c) => (
                      <p key={c} className="font-body text-white/75 mb-1.5" style={{ fontSize: 14, lineHeight: 1.5 }}>
                        <span className="text-orange">—</span> {c}
                      </p>
                    ))}
                  </div>
                  <div>
                    <p className="font-mono uppercase text-white/40 mb-2" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
                      Что важно учесть
                    </p>
                    <p className="font-body text-white/60" style={{ fontSize: 14, lineHeight: 1.55 }}>
                      {material.watch}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="px-6 md:px-9 py-9 flex flex-wrap items-center justify-between gap-5" style={{ borderTop: "1px solid rgba(255,90,0,0.35)" }}>
                <p className="font-mono text-white uppercase" style={{ fontSize: 14, letterSpacing: "0.04em" }}>
                  Задача с этим материалом? Проверим на реализуемость.
                </p>
                <Link href="/#contact" className="btn btn-orange">
                  Обсудить проект
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
