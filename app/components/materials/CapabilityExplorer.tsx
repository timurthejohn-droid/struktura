"use client";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Capability,
  CAPABILITIES,
  CONTENT,
  FAMILIES,
  MATERIALS,
  Material,
  CaseItem,
} from "./materialsData";

// Каталог возможности: двойная навигация.
// Слева — дерево «семейство → материал» (только материалы этой возможности),
// справа — тёмная панель материала в стилистике чертёжного штампа.
// Внутри панели листается: характеристики → наши проекты → статьи → мировые кейсы.

type Group = { family: (typeof FAMILIES)[number]; items: Material[] };

function CaseRow({ item, index }: { item: CaseItem; index: number }) {
  return (
    <div className="py-5" style={{ borderTop: "1px solid var(--line-dark)" }}>
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <h4 className="font-mono text-white uppercase" style={{ fontSize: 15, letterSpacing: "0.02em" }}>
          <span className="text-orange mr-3">{String(index + 1).padStart(2, "0")}</span>
          {item.title}
        </h4>
        <span className="font-mono text-white/40 uppercase" style={{ fontSize: 10.5, letterSpacing: "0.1em" }}>
          {item.meta}
        </span>
      </div>
      <p className="font-body text-white/55 mt-2 max-w-2xl" style={{ fontSize: 14, lineHeight: 1.55 }}>
        {item.desc}
      </p>
    </div>
  );
}

function ContentBlock({ label, items }: { label: string; items?: CaseItem[] }) {
  if (!items?.length) return null;
  return (
    <div className="px-6 md:px-9 py-8" style={{ borderTop: "1px solid rgba(255,90,0,0.35)" }}>
      <p className="font-mono text-orange uppercase mb-2" style={{ fontSize: 11, letterSpacing: "0.2em" }}>
        {label}
      </p>
      {items.map((it, i) => (
        <CaseRow key={it.title} item={it} index={i} />
      ))}
    </div>
  );
}

export default function CapabilityExplorer({
  capability,
  onSwitch,
}: {
  capability: Capability;
  onSwitch: (slug: string) => void;
}) {
  // материалы возможности, сгруппированные по семействам (в порядке FAMILIES)
  const groups = useMemo<Group[]>(() => {
    const inCap = capability.materials
      .map((name) => MATERIALS.find((m) => m.name === name))
      .filter((m): m is Material => Boolean(m));
    return FAMILIES.map((family) => ({
      family,
      items: inCap.filter((m) => m.family === family.id),
    })).filter((g) => g.items.length > 0);
  }, [capability]);

  const [openFamily, setOpenFamily] = useState<string>(groups[0]?.family.id ?? "metal");
  const [active, setActive] = useState<Material>(groups[0]?.items[0] ?? MATERIALS[0]);
  const panelRef = useRef<HTMLDivElement>(null);

  const select = (m: Material) => {
    setActive(m);
    panelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const g = groups.find((gr) => gr.family.id === active.family);
  const idxInFamily = (g?.items.findIndex((m) => m.name === active.name) ?? 0) + 1;
  const code = `${g?.family.n ?? "01"}.${String(idxInFamily).padStart(2, "0")}`;
  const content = CONTENT[active.name];

  const capIdx = CAPABILITIES.findIndex((c) => c.slug === capability.slug);
  const prev = CAPABILITIES[(capIdx + CAPABILITIES.length - 1) % CAPABILITIES.length];
  const next = CAPABILITIES[(capIdx + 1) % CAPABILITIES.length];

  return (
    <div className="relative">
      {/* угловые засечки как на чертеже */}
      <span className="hidden lg:block absolute -bottom-5 -left-5" style={{ width: 22, height: 22, borderLeft: "1px solid var(--orange)", borderBottom: "1px solid var(--orange)" }} aria-hidden />
      <span className="hidden lg:block absolute -bottom-5 -right-5" style={{ width: 22, height: 22, borderRight: "1px solid var(--orange)", borderBottom: "1px solid var(--orange)" }} aria-hidden />

      <div className="grid lg:grid-cols-[0.42fr_1fr]" style={{ border: "1px solid var(--line-light)", background: "var(--paper)" }}>
        {/* ————— Левая колонка: дерево каталога ————— */}
        <aside className="flex flex-col" style={{ borderRight: "1px solid var(--line-light)" }}>
          <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--line-light)" }}>
            <span className="font-mono text-orange uppercase" style={{ fontSize: 12, letterSpacing: "0.14em" }}>
              Каталог материалов
            </span>
          </div>

          {groups.map(({ family, items }) => {
            const open = openFamily === family.id;
            return (
              <div key={family.id}>
                <button
                  onClick={() => setOpenFamily(open ? "" : family.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors"
                  style={{ borderBottom: "1px solid var(--line-light)" }}
                >
                  <span
                    className="font-mono uppercase"
                    style={{ fontSize: 13, letterSpacing: "0.1em", color: open ? "var(--orange)" : "var(--ink)" }}
                  >
                    {family.name}
                  </span>
                  <span className="font-mono" style={{ fontSize: 15, color: open ? "var(--orange)" : "var(--ink-soft)" }}>
                    {open ? "–" : "+"}
                  </span>
                </button>

                {open &&
                  items.map((m, i) => {
                    const on = active.name === m.name;
                    return (
                      <button
                        key={m.name}
                        onClick={() => select(m)}
                        className="w-full flex items-center gap-4 px-6 py-3.5 text-left transition-colors"
                        style={{
                          borderBottom: "1px solid var(--line-light)",
                          background: on ? "rgba(255,90,0,0.07)" : "transparent",
                          boxShadow: on ? "inset 3px 0 0 var(--orange)" : undefined,
                        }}
                      >
                        <span className="font-mono" style={{ fontSize: 11, color: on ? "var(--orange)" : "var(--ink-soft)" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className="font-mono uppercase"
                          style={{ fontSize: 12.5, letterSpacing: "0.08em", color: on ? "var(--orange)" : "var(--ink)" }}
                        >
                          {m.name}
                        </span>
                      </button>
                    );
                  })}
              </div>
            );
          })}

          {/* переключение возможности (уровень 1) */}
          <div className="mt-auto px-6 py-5 flex items-center justify-between gap-3" style={{ borderTop: "1px solid var(--line-light)" }}>
            <button onClick={() => onSwitch(prev.slug)} className="font-mono uppercase text-ink-soft hover:text-orange transition-colors text-left" style={{ fontSize: 11, letterSpacing: "0.08em" }}>
              ← {prev.title}
            </button>
            <button onClick={() => onSwitch(next.slug)} className="font-mono uppercase text-ink-soft hover:text-orange transition-colors text-right" style={{ fontSize: 11, letterSpacing: "0.08em" }}>
              {next.title} →
            </button>
          </div>
        </aside>

        {/* ————— Правая панель: материал ————— */}
        <div
          ref={panelRef}
          className="no-scrollbar lg:overflow-y-auto"
          style={{ background: "var(--coal-deep)", maxHeight: "calc(100vh - 140px)" }}
        >
          {/* шапка панели */}
          <div className="flex items-center justify-between px-6 md:px-9 pt-7">
            <span className="font-mono text-white/50 uppercase" style={{ fontSize: 11, letterSpacing: "0.18em" }}>
              Материал / {g?.family.name ?? ""}
            </span>
            <span className="font-mono text-white/50" style={{ fontSize: 11, letterSpacing: "0.1em" }}>
              {code}
            </span>
          </div>

          {/* визуал материала */}
          <div className="px-6 md:px-9 mt-6">
            <div className="relative overflow-hidden" style={{ aspectRatio: "16 / 8", background: active.grad }}>
              {/* ламели — намёк на панель/оболочку */}
              <div
                className="absolute inset-0"
                style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.22) 0 2px, transparent 2px 46px)" }}
              />
              <div className="absolute inset-0" style={{ background: "radial-gradient(90% 70% at 50% 15%, rgba(255,255,255,0.28), transparent 55%)" }} />
              <div className="absolute inset-0" style={{ boxShadow: "inset 0 -50px 90px rgba(0,0,0,0.45)" }} />
              <span className="absolute bottom-3 right-4 font-mono uppercase" style={{ fontSize: 9.5, letterSpacing: "0.16em", color: "rgba(255,255,255,0.65)" }}>
                {active.sub}
              </span>
            </div>
          </div>

          {/* чертёжный штамп */}
          <div className="px-6 md:px-9 mt-7">
            <div className="grid grid-cols-[auto_1fr]" style={{ border: "1px solid rgba(255,90,0,0.55)" }}>
              <div className="flex items-center justify-center px-6 md:px-8" style={{ borderRight: "1px solid rgba(255,90,0,0.55)" }}>
                <span className="font-mono text-white" style={{ fontSize: "clamp(30px, 3.4vw, 46px)", letterSpacing: "0.02em" }}>
                  {String(idxInFamily).padStart(2, "0")}
                  <span className="text-orange" style={{ fontSize: "0.5em", verticalAlign: "super" }}>+</span>
                </span>
              </div>
              <div>
                <div className="px-4 md:px-5 py-3 font-mono text-white uppercase" style={{ fontSize: 12, letterSpacing: "0.13em", borderBottom: "1px solid rgba(255,90,0,0.4)" }}>
                  Материал — {active.name}
                </div>
                <div className="px-4 md:px-5 py-3 font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.1em", lineHeight: 1.6, color: "rgba(255,255,255,0.75)", borderBottom: "1px solid rgba(255,90,0,0.4)" }}>
                  Возможность — {active.edge}
                </div>
                <div className="grid md:grid-cols-2">
                  <div className="px-4 md:px-5 py-3 font-mono uppercase" style={{ fontSize: 10.5, letterSpacing: "0.1em", lineHeight: 1.6, color: "rgba(255,255,255,0.6)", borderRight: "1px solid rgba(255,90,0,0.4)" }}>
                    Статус — {active.statuses.join(" · ")}
                  </div>
                  <div className="px-4 md:px-5 py-3 font-mono uppercase" style={{ fontSize: 10.5, letterSpacing: "0.1em", lineHeight: 1.6, color: "rgba(255,255,255,0.6)" }}>
                    Техника — {active.fmt} · {active.zone}
                  </div>
                </div>
              </div>
            </div>

            <p className="font-mono text-white/35 uppercase mt-4 mb-8" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
              Листайте вниз: характеристики · проекты · статьи · мировые кейсы ↓
            </p>
          </div>

          {/* ХАРАКТЕРИСТИКИ */}
          <div className="px-6 md:px-9 py-8" style={{ borderTop: "1px solid rgba(255,90,0,0.35)" }}>
            <p className="font-mono text-orange uppercase mb-6" style={{ fontSize: 11, letterSpacing: "0.2em" }}>
              Характеристики
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: 1, background: "var(--line-dark)" }}>
              {[
                { l: "Формат", v: active.fmt },
                { l: "Вес", v: active.weight },
                { l: "Зона", v: active.zone },
                { l: "Пожарный статус", v: active.fire },
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
                {active.can.map((c) => (
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
                  {active.watch}
                </p>
              </div>
            </div>
          </div>

          <ContentBlock label="Наши проекты" items={content?.projects} />
          <ContentBlock label="Статьи" items={content?.articles} />
          <ContentBlock label="Мировые кейсы" items={content?.world} />

          {/* CTA в конце панели */}
          <div className="px-6 md:px-9 py-9 flex flex-wrap items-center justify-between gap-5" style={{ borderTop: "1px solid rgba(255,90,0,0.35)" }}>
            <p className="font-mono text-white uppercase" style={{ fontSize: 14, letterSpacing: "0.04em" }}>
              Задача с этим материалом? Проверим на реализуемость.
            </p>
            <Link href="/#contact" className="btn btn-orange">
              Обсудить проект
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
