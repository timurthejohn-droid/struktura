"use client";
import { useMemo, useState } from "react";
import { CAPABILITIES, FAMILIES, MATERIALS, Material } from "./materialsData";
import { DOT, LEVEL_LABEL, Level, capsOf, materialsOf } from "./capabilityMatrix";
import MaterialCardModal, { MaterialVisual } from "./MaterialCardModal";

// Простой вход: сетка материалов видна сразу, возможности — фильтр над ней.
// Архитектору не нужно ничего понимать про «карту возможностей»: он видит
// материалы. Тому, кто мыслит задачей, достаточно нажать одну плашку.
// Оба пути ведут в ту же полноэкранную карточку.

/** Чертёжный шифр материала: номер семейства . порядковый номер внутри него. */
function codeOf(m: Material) {
  const f = FAMILIES.find((x) => x.id === m.family);
  const i = MATERIALS.filter((x) => x.family === m.family).findIndex((x) => x.name === m.name) + 1;
  return `${f?.n ?? "01"}.${String(i).padStart(2, "0")}`;
}

function Tile({
  m,
  level,
  code,
  onOpen,
}: {
  m: Material;
  level: Level | null;
  code: string;
  onOpen: () => void;
}) {
  const caps = capsOf(m.name);
  const proven = caps.filter((c) => c.level === "proven").length;

  return (
    <button onClick={onOpen} className="group text-left w-full" aria-label={`Открыть карточку: ${m.name}`}>
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "4 / 3", border: "1px solid var(--line-dark)" }}
      >
        <MaterialVisual m={m} className="absolute inset-0" />
        <span
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(16,16,16,0.05) 40%, rgba(16,16,16,0.88) 100%)" }}
        />
        {/* уровень по выбранной возможности */}
        {level && (
          <span
            className="absolute top-0 left-0 font-mono uppercase inline-flex items-center gap-1.5 px-2.5 py-1.5"
            style={{
              fontSize: 9.5,
              letterSpacing: "0.1em",
              background: level === "proven" ? "var(--orange)" : "rgba(16,16,16,0.88)",
              color: "#fff",
            }}
          >
            <span style={{ fontSize: 8 }}>{DOT[level]}</span>
            {LEVEL_LABEL[level]}
          </span>
        )}
        <span
          className="absolute top-2.5 right-3 font-mono"
          style={{ fontSize: 9.5, letterSpacing: "0.1em", color: "rgba(255,255,255,0.55)" }}
        >
          {code}
        </span>
        <span
          className="absolute bottom-3 left-4 right-4 font-mono uppercase text-white"
          style={{ fontSize: 13, letterSpacing: "0.04em", lineHeight: 1.15 }}
        >
          {m.name}
        </span>
        {/* обводка при наведении — плитка читается как кликабельная */}
        <span
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{ boxShadow: "inset 0 0 0 2px var(--orange)", transition: "opacity 0.22s var(--ease-out)" }}
        />
      </div>

      <p className="font-body text-white/55 mt-2.5" style={{ fontSize: 13, lineHeight: 1.45 }}>
        {m.sub}
      </p>
      <p className="font-mono uppercase text-white/35 mt-1.5" style={{ fontSize: 9.5, letterSpacing: "0.1em" }}>
        {caps.length} возможностей
        {proven > 0 && <span className="text-orange"> · {proven} доказано</span>}
      </p>
    </button>
  );
}

export default function MaterialsGrid() {
  const [cap, setCap] = useState<string | null>(null);
  const [cardFor, setCardFor] = useState<Material | null>(null);

  const capObj = CAPABILITIES.find((c) => c.slug === cap) ?? null;

  // без фильтра — по семействам; с фильтром — плоский список от сильных к слабым
  const filtered = useMemo(() => {
    if (!cap) return null;
    return materialsOf(cap);
  }, [cap]);

  return (
    <div>
      {/* ————— Фильтр ————— */}
      <div className="mb-10">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCap(null)}
            className="font-mono uppercase px-4 py-2.5"
            style={{
              fontSize: 11,
              letterSpacing: "0.1em",
              border: "1px solid",
              borderColor: cap === null ? "var(--orange)" : "var(--line-dark)",
              background: cap === null ? "var(--orange)" : "transparent",
              color: "#fff",
              transition: "background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease",
            }}
          >
            Все материалы · {MATERIALS.length}
          </button>

          {CAPABILITIES.map((c) => {
            const on = cap === c.slug;
            const n = materialsOf(c.slug).length;
            return (
              <button
                key={c.slug}
                onClick={() => setCap(c.slug)}
                className="font-mono uppercase px-4 py-2.5"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  border: "1px solid",
                  borderColor: on ? "var(--orange)" : "var(--line-dark)",
                  background: on ? "var(--orange)" : "transparent",
                  color: on ? "#fff" : "rgba(255,255,255,0.7)",
                  transition: "background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease",
                }}
              >
                {c.title} <span style={{ opacity: 0.6 }}>· {n}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <p className="font-body text-white/55 max-w-3xl" style={{ fontSize: 15, lineHeight: 1.5 }}>
            {capObj ? (
              <>
                <span className="text-white">{filtered?.length}</span> материалов умеют:{" "}
                <span className="text-orange">{capObj.title.toLowerCase()}</span>. {capObj.desc}
              </>
            ) : (
              <>Все материалы, с которыми мы работаем. Нужна конкретная задача — нажмите возможность выше.</>
            )}
          </p>
          {capObj && (
            <span className="font-mono uppercase text-white/35" style={{ fontSize: 9.5, letterSpacing: "0.1em" }}>
              ● доказано проектом · ◐ стандартно · ○ можно разработать
            </span>
          )}
        </div>
      </div>

      {/* ————— Сетка ————— */}
      {filtered ? (
        <div key={cap} className="env-slide grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-9">
          {filtered.map(({ material: m, level }) => (
            <Tile key={m.name} m={m} level={level} code={codeOf(m)} onOpen={() => setCardFor(m)} />
          ))}
        </div>
      ) : (
        <div key="all" className="env-slide flex flex-col gap-14">
          {FAMILIES.map((f) => {
            const items = MATERIALS.filter((m) => m.family === f.id);
            return (
              <section key={f.id}>
                <div
                  className="flex items-baseline justify-between gap-4 pb-3 mb-6"
                  style={{ borderBottom: "1px solid var(--line-dark)" }}
                >
                  <h3 className="font-mono uppercase text-white" style={{ fontSize: 15, letterSpacing: "0.08em" }}>
                    <span className="text-orange mr-3">{f.n}</span>
                    {f.name}
                  </h3>
                  <span className="font-mono uppercase text-white/30 hidden sm:block" style={{ fontSize: 10, letterSpacing: "0.1em" }}>
                    {f.desc}
                  </span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-9">
                  {items.map((m) => (
                    <Tile key={m.name} m={m} level={null} code={codeOf(m)} onOpen={() => setCardFor(m)} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <MaterialCardModal material={cardFor} initialCap={cap} onClose={() => setCardFor(null)} />
    </div>
  );
}
