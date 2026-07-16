"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import SectionHead from "../SectionHead";
import { FAMILIES, FamilyId, MATERIALS, Material, SURFACES } from "./materialsData";

// [05] КАТАЛОГ — шесть семейств материалов + технологии поверхности.
// Карточка отвечает на пять вопросов; полный паспорт раскрывается по клику.

type Filter = FamilyId | "all";

function classify(status: string): "standard" | "check" | "prove" | "warn" {
  const s = status.toLowerCase();
  if (s.startsWith("стандартно")) return "standard";
  if (s.startsWith("доказа") || s.startsWith("решение")) return "prove";
  if (s.startsWith("не рекоменд") || s.startsWith("не ремонт")) return "warn";
  return "check"; // проверка / учесть / прочее
}

const CHIP: Record<ReturnType<typeof classify>, { color: string; border: string }> = {
  standard: { color: "var(--ink-soft)", border: "var(--line-light)" },
  check: { color: "var(--orange)", border: "rgba(255,90,0,0.4)" },
  prove: { color: "#0c7d76", border: "rgba(15,157,148,0.45)" },
  warn: { color: "#b53f30", border: "rgba(181,63,48,0.45)" },
};

function StatusChip({ status }: { status: string }) {
  const c = CHIP[classify(status)];
  return (
    <span
      className="font-mono uppercase px-2.5 py-1"
      style={{ fontSize: 10, letterSpacing: "0.04em", color: c.color, border: `1px solid ${c.border}` }}
    >
      {status}
    </span>
  );
}

function familyName(id: FamilyId) {
  return FAMILIES.find((f) => f.id === id)?.name ?? "";
}

function Detail({ m, onClose }: { m: Material; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const specs = [
    { l: "Формат", v: m.fmt },
    { l: "Вес", v: m.weight },
    { l: "Зона", v: m.zone },
    { l: "Пожарный статус", v: m.fire },
  ];

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: "rgba(16,16,16,0.72)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto no-scrollbar"
        style={{ background: "var(--paper-card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="relative h-28 sm:h-32" style={{ background: m.grad }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.28))" }} />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex items-center justify-center font-mono"
            style={{ width: 34, height: 34, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 16 }}
            aria-label="Закрыть"
          >
            ×
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <span className="font-mono uppercase text-white/85" style={{ fontSize: 10, letterSpacing: "0.16em" }}>
              {familyName(m.family)}
            </span>
            <h3 className="font-mono uppercase text-white" style={{ fontSize: "clamp(22px, 3vw, 34px)", lineHeight: 1 }}>
              {m.name}
            </h3>
          </div>
        </div>

        <div className="p-6 sm:p-9">
          <p className="font-body text-ink-soft" style={{ fontSize: 15 }}>
            {m.sub}
          </p>

          {/* Что может */}
          <div className="mt-7">
            <p className="font-mono text-ink/40 uppercase mb-3" style={{ fontSize: 10, letterSpacing: "0.16em" }}>
              Что может
            </p>
            <ul className="flex flex-col gap-2">
              {m.can.map((c) => (
                <li key={c} className="flex gap-3 font-body text-ink" style={{ fontSize: 15.5, lineHeight: 1.5 }}>
                  <span className="text-orange mt-0.5">—</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Предел */}
          <div className="mt-7 p-5" style={{ background: "var(--paper)" }}>
            <p className="font-mono text-orange uppercase mb-2" style={{ fontSize: 10, letterSpacing: "0.16em" }}>
              Предел / сильный ход
            </p>
            <p className="font-body text-ink" style={{ fontSize: 16, lineHeight: 1.5 }}>
              {m.edge}
            </p>
          </div>

          {/* Статусы */}
          <div className="mt-7 flex flex-wrap gap-2">
            {m.statuses.map((s) => (
              <StatusChip key={s} status={s} />
            ))}
          </div>

          {/* Что учесть */}
          <div className="mt-7">
            <p className="font-mono text-ink/40 uppercase mb-2" style={{ fontSize: 10, letterSpacing: "0.16em" }}>
              Что важно учесть
            </p>
            <p className="font-body text-ink-soft" style={{ fontSize: 14.5, lineHeight: 1.55 }}>
              {m.watch}
            </p>
          </div>

          {/* Технический минимум */}
          <div className="mt-7">
            <p className="font-mono text-ink/40 uppercase mb-3" style={{ fontSize: 10, letterSpacing: "0.16em" }}>
              Технический минимум
            </p>
            <div className="grid grid-cols-2" style={{ gap: 1, background: "var(--line-light)" }}>
              {specs.map((s) => (
                <div key={s.l} className="p-4" style={{ background: "var(--paper-card)" }}>
                  <div className="font-mono text-ink/45 uppercase" style={{ fontSize: 9.5, letterSpacing: "0.1em" }}>
                    {s.l}
                  </div>
                  <div className="font-body text-ink mt-1" style={{ fontSize: 14 }}>
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/#projects" className="btn btn-dark" onClick={onClose}>
              Проекты
            </Link>
            <Link href="/#contact" className="btn btn-ghost-light" onClick={onClose}>
              Запросить консультацию
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MaterialsCatalog() {
  const [filter, setFilter] = useState<Filter>("all");
  const [sel, setSel] = useState<Material | null>(null);

  const list = filter === "all" ? MATERIALS : MATERIALS.filter((m) => m.family === filter);

  return (
    <section id="catalog" className="py-24 md:py-36" style={{ background: "var(--paper)" }}>
      <div className="container-x">
        <SectionHead index="05" kicker="Каталог материалов" theme="light" />

        <p className="font-body text-ink-soft max-w-2xl mb-10" style={{ fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.6 }}>
          Шесть семейств материалов в&nbsp;единой логике: возможность&nbsp;— предел&nbsp;—
          доказательство&nbsp;— что учесть. Нажмите на&nbsp;карточку, чтобы раскрыть паспорт.
        </p>

        {/* Фильтр по семействам */}
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { id: "all" as Filter, name: `Все · ${MATERIALS.length}` },
            ...FAMILIES.map((fam) => ({ id: fam.id as Filter, name: fam.name })),
          ].map((f) => {
            const on = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="font-mono uppercase px-4 py-2.5 transition-colors"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  background: on ? "var(--ink)" : "transparent",
                  color: on ? "#fff" : "var(--ink-soft)",
                  border: `1px solid ${on ? "var(--ink)" : "var(--line-light)"}`,
                }}
              >
                {f.name}
              </button>
            );
          })}
        </div>

        {/* Сетка карточек */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gap: 1, background: "var(--line-light)" }}>
          {list.map((m) => (
            <button
              key={m.name}
              onClick={() => setSel(m)}
              className="group text-left flex flex-col transition-transform"
              style={{ background: "var(--paper-card)" }}
            >
              <div className="relative h-24" style={{ background: m.grad }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.12)" }} />
                <span className="absolute top-3 left-3 font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.12em", color: "rgba(0,0,0,0.5)" }}>
                  {familyName(m.family)}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-mono text-ink uppercase" style={{ fontSize: 16, letterSpacing: "0.01em", lineHeight: 1.1 }}>
                  {m.name}
                </h3>
                <p className="font-body text-ink-soft mt-1.5" style={{ fontSize: 13, lineHeight: 1.4 }}>
                  {m.sub}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {m.statuses.slice(0, 2).map((s) => (
                    <StatusChip key={s} status={s} />
                  ))}
                </div>
                <span className="font-mono uppercase text-ink/35 group-hover:text-orange mt-auto pt-5 transition-colors" style={{ fontSize: 10, letterSpacing: "0.1em" }}>
                  Паспорт →
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Уровень 2 — трансформации и поверхности */}
        <div className="mt-16 pt-10" style={{ borderTop: "1px solid var(--line-light)" }}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mb-6">
            <span className="font-mono uppercase text-white px-3 py-1.5" style={{ fontSize: 10, letterSpacing: "0.12em", background: "#0f9d94" }}>
              Уровень 2
            </span>
            <h3 className="font-mono text-ink uppercase" style={{ fontSize: "clamp(18px, 1.8vw, 26px)" }}>
              Трансформации и поверхности
            </h3>
          </div>
          <p className="font-body text-ink-soft max-w-2xl mb-6" style={{ fontSize: 15 }}>
            PVD, патина, анодирование и&nbsp;3D-печать не&nbsp;конкурируют с&nbsp;металлом или стеклом&nbsp;—
            это способы трансформации. Связь строится тегами: материал + технология + эффект + среда.
          </p>
          <div className="flex flex-wrap gap-2">
            {SURFACES.map((s) => (
              <span
                key={s}
                className="font-mono uppercase px-4 py-2"
                style={{ fontSize: 11, letterSpacing: "0.06em", color: "var(--ink-soft)", border: "1px solid var(--line-light)" }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {sel && <Detail m={sel} onClose={() => setSel(null)} />}
    </section>
  );
}
