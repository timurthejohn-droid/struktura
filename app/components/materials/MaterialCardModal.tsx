"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CAPABILITIES, CaseItem, FAMILIES, MATERIALS, Material } from "./materialsData";
import { DOT, LEVEL_LABEL, Level, allContent, capsOf, proofFor } from "./capabilityMatrix";
import { CASE_IMAGE, MATERIAL_IMAGE, withBase } from "./materialMedia";

// Карточка материала на весь экран. Одна и та же во всех вариантах каталога:
// куда бы человек ни зашёл — по возможности, по материалу или из сетки —
// он приходит в это окно. Чипы возможностей сверху фильтруют доказательства.

/**
 * Визуал материала: съёмка → видео → фирменный градиент.
 * Позиционирование задаёт вызывающий (className) — свой `relative` тут ставить
 * нельзя, он перебивает переданный `absolute` и схлопывает блок в ноль высоты.
 */
function MaterialVisual({ m, className = "" }: { m: Material; className?: string }) {
  const img = MATERIAL_IMAGE[m.name];
  return (
    <div className={`overflow-hidden ${className}`} style={{ background: img || m.video ? "var(--coal)" : m.grad }}>
      {img ? (
        <img src={withBase(img)} alt={m.name} className="absolute inset-0 h-full w-full object-cover" />
      ) : m.video ? (
        <video src={withBase(m.video)} className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline />
      ) : (
        <>
          <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.22) 0 2px, transparent 2px 46px)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(90% 70% at 50% 15%, rgba(255,255,255,0.28), transparent 55%)" }} />
          <div className="absolute inset-0" style={{ boxShadow: "inset 0 -50px 90px rgba(0,0,0,0.45)" }} />
        </>
      )}
    </div>
  );
}

/** Слот под фото, которого у нас пока нет: не выдумываем изображение. */
function PhotoSlot({ grad, index }: { grad: string; index: number }) {
  return (
    <div className="relative overflow-hidden" style={{ aspectRatio: "16 / 10", background: "var(--coal)" }}>
      <div className="absolute inset-0 opacity-[0.22]" style={{ background: grad }} />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 12px)" }}
      />
      <span className="absolute top-3 left-4 font-mono text-white/70" style={{ fontSize: 22 }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="absolute bottom-3 left-4 font-mono uppercase text-white/35" style={{ fontSize: 9, letterSpacing: "0.16em" }}>
        Фото — по запросу
      </span>
      <span className="absolute top-3 right-3" style={{ width: 14, height: 14, borderTop: "1px solid var(--orange)", borderRight: "1px solid var(--orange)" }} />
      <span className="absolute bottom-3 right-3" style={{ width: 14, height: 14, borderBottom: "1px solid var(--orange)", borderRight: "1px solid var(--orange)" }} />
    </div>
  );
}

function CaseCard({ item, index, grad }: { item: CaseItem; index: number; grad: string }) {
  const img = CASE_IMAGE[item.title];
  return (
    <article>
      {img ? (
        <div className="relative overflow-hidden" style={{ aspectRatio: "16 / 10", background: "var(--coal)" }}>
          <img src={withBase(img)} alt={item.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      ) : (
        <PhotoSlot grad={grad} index={index} />
      )}
      <h5 className="font-mono text-white uppercase mt-4" style={{ fontSize: 14, letterSpacing: "0.02em", lineHeight: 1.25 }}>
        {item.title}
      </h5>
      <p className="font-mono text-orange uppercase mt-1.5" style={{ fontSize: 10, letterSpacing: "0.1em" }}>
        {item.meta}
      </p>
      <p className="font-body text-white/55 mt-2" style={{ fontSize: 13.5, lineHeight: 1.55 }}>
        {item.desc}
      </p>
    </article>
  );
}

function ArticleRow({ item, index }: { item: CaseItem; index: number }) {
  return (
    <div className="py-4 flex items-baseline gap-4" style={{ borderTop: "1px solid var(--line-dark)" }}>
      <span className="font-mono text-orange shrink-0" style={{ fontSize: 11 }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex-1">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <h5 className="font-mono text-white uppercase" style={{ fontSize: 13.5, letterSpacing: "0.02em" }}>
            {item.title}
          </h5>
          <span className="font-mono text-white/35 uppercase" style={{ fontSize: 10, letterSpacing: "0.1em" }}>
            {item.meta}
          </span>
        </div>
        <p className="font-body text-white/55 mt-1.5" style={{ fontSize: 13.5, lineHeight: 1.55 }}>
          {item.desc}
        </p>
      </div>
    </div>
  );
}

export default function MaterialCardModal({
  material,
  initialCap = null,
  onClose,
}: {
  material: Material | null;
  initialCap?: string | null;
  onClose: () => void;
}) {
  const [cap, setCap] = useState<string | null>(initialCap);

  useEffect(() => setCap(initialCap), [initialCap, material]);

  // Esc + блокировка прокрутки фона
  useEffect(() => {
    if (!material) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [material, onClose]);

  const family = material ? FAMILIES.find((f) => f.id === material.family) : null;
  const idx = material
    ? MATERIALS.filter((m) => m.family === material.family).findIndex((m) => m.name === material.name) + 1
    : 1;
  const code = `${family?.n ?? "01"}.${String(idx).padStart(2, "0")}`;

  const caps = material ? capsOf(material.name) : [];
  const content = material ? (cap ? proofFor(material.name, cap) : allContent(material.name)) : null;
  const capObj = CAPABILITIES.find((c) => c.slug === cap) ?? null;
  const capLevel = cap ? caps.find((x) => x.cap.slug === cap)?.level ?? null : null;

  return (
    <AnimatePresence>
      {material && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto no-scrollbar"
          style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Карточка материала: ${material.name}`}
        >
          <motion.div
            className="w-full max-w-[1120px] my-6 md:my-10 mx-4"
            style={{ background: "var(--coal-deep)", border: "1px solid var(--line-dark)" }}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* шапка */}
            <div
              className="sticky top-0 z-10 flex items-center justify-between gap-4 px-5 md:px-9 py-4"
              style={{ background: "var(--coal-deep)", borderBottom: "1px solid var(--line-dark)" }}
            >
              <span className="font-mono text-white/50 uppercase" style={{ fontSize: 10.5, letterSpacing: "0.16em" }}>
                {code} · Материал / {family?.name}
              </span>
              <button
                onClick={onClose}
                className="font-mono uppercase text-white/60 hover:text-orange transition-colors"
                style={{ fontSize: 11, letterSpacing: "0.12em" }}
                aria-label="Закрыть карточку"
              >
                Закрыть ✕
              </button>
            </div>

            {/* визуал + имя */}
            <div className="relative">
              <div style={{ aspectRatio: "16 / 7" }} className="w-full relative">
                <MaterialVisual m={material} className="absolute inset-0" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(16,16,16,0.1) 30%, rgba(16,16,16,0.92) 100%)" }} />
                <div className="absolute bottom-0 left-0 right-0 px-5 md:px-9 pb-6">
                  <h3 className="font-mono text-white uppercase" style={{ fontSize: "clamp(28px, 4vw, 56px)", lineHeight: 1 }}>
                    {material.name}
                  </h3>
                  <p className="font-mono text-orange uppercase mt-2" style={{ fontSize: 11, letterSpacing: "0.12em" }}>
                    {material.sub}
                  </p>
                </div>
              </div>
            </div>

            {/* тезис */}
            <div className="px-5 md:px-9 py-7" style={{ borderBottom: "1px solid var(--line-dark)" }}>
              <p className="font-body text-white/80 max-w-3xl" style={{ fontSize: "clamp(16px, 1.5vw, 21px)", lineHeight: 1.5 }}>
                {material.edge}
              </p>
            </div>

            {/* чипы возможностей = фильтр доказательств */}
            <div className="px-5 md:px-9 py-7" style={{ borderBottom: "1px solid var(--line-dark)" }}>
              <p className="font-mono text-white/40 uppercase mb-4" style={{ fontSize: 10, letterSpacing: "0.16em" }}>
                Что этот материал умеет — {caps.length} из 9
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCap(null)}
                  className="font-mono uppercase px-3 py-2"
                  style={{
                    fontSize: 10.5,
                    letterSpacing: "0.1em",
                    border: "1px solid",
                    borderColor: cap === null ? "var(--orange)" : "var(--line-dark)",
                    background: cap === null ? "var(--orange)" : "transparent",
                    color: cap === null ? "#fff" : "rgba(255,255,255,0.6)",
                    transition: "background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease",
                  }}
                >
                  Всё сразу
                </button>
                {caps.map(({ cap: c, level }) => {
                  const on = cap === c.slug;
                  return (
                    <button
                      key={c.slug}
                      onClick={() => setCap(c.slug)}
                      title={LEVEL_LABEL[level]}
                      className="font-mono uppercase px-3 py-2 inline-flex items-center gap-2"
                      style={{
                        fontSize: 10.5,
                        letterSpacing: "0.1em",
                        border: "1px solid",
                        borderColor: on ? "var(--orange)" : "var(--line-dark)",
                        background: on ? "var(--orange)" : "transparent",
                        color: on ? "#fff" : "rgba(255,255,255,0.72)",
                        transition: "background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease",
                      }}
                    >
                      <span style={{ fontSize: 9, color: on ? "#fff" : level === "proven" ? "var(--orange)" : "rgba(255,255,255,0.4)" }}>
                        {DOT[level]}
                      </span>
                      {c.title}
                    </button>
                  );
                })}
              </div>
              <p className="font-mono text-white/30 uppercase mt-4" style={{ fontSize: 9.5, letterSpacing: "0.1em" }}>
                ● доказано проектом · ◐ стандартно · ○ можно разработать
              </p>
            </div>

            {/* доказательства */}
            {content && (
              <div key={cap ?? "all"} className="px-5 md:px-9 py-8 env-slide" style={{ borderBottom: "1px solid var(--line-dark)" }}>
                {capObj && capLevel && (
                  <div className="mb-7">
                    <h4 className="font-mono text-white uppercase" style={{ fontSize: "clamp(17px, 1.8vw, 24px)", letterSpacing: "0.02em" }}>
                      <span className="text-orange mr-3">{capObj.n}</span>
                      {material.name} <span className="text-orange">×</span> {capObj.title}
                    </h4>
                    <p className="font-body text-white/55 mt-2 max-w-2xl" style={{ fontSize: 14, lineHeight: 1.55 }}>
                      {capObj.desc}
                    </p>
                  </div>
                )}

                {content.total === 0 ? (
                  <div className="p-5" style={{ border: "1px solid var(--line-dark)" }}>
                    <p className="font-mono text-white/70 uppercase" style={{ fontSize: 11.5, letterSpacing: "0.1em", lineHeight: 1.7 }}>
                      {capLevel === "standard"
                        ? "Штатная для нас работа — публичного кейса именно на эту пару пока нет."
                        : "Пара не из каталога: считаем, прототипируем и подтверждаем образцом."}
                    </p>
                    <p className="font-body text-white/45 mt-2" style={{ fontSize: 13.5, lineHeight: 1.55 }}>
                      Закрытые проекты и образцы покажем на встрече.
                    </p>
                  </div>
                ) : (
                  <>
                    {content.projects.length > 0 && (
                      <>
                        <p className="font-mono text-orange uppercase mb-5" style={{ fontSize: 11, letterSpacing: "0.2em" }}>
                          Наши проекты
                        </p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9">
                          {content.projects.map((it, i) => (
                            <CaseCard key={it.title} item={it} index={i} grad={material.grad} />
                          ))}
                        </div>
                      </>
                    )}

                    {content.world.length > 0 && (
                      <>
                        <p className="font-mono text-orange uppercase mt-12 mb-5" style={{ fontSize: 11, letterSpacing: "0.2em" }}>
                          Мировые кейсы
                        </p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9">
                          {content.world.map((it, i) => (
                            <CaseCard key={it.title} item={it} index={i} grad={material.grad} />
                          ))}
                        </div>
                      </>
                    )}

                    {content.articles.length > 0 && (
                      <>
                        <p className="font-mono text-orange uppercase mt-12 mb-1" style={{ fontSize: 11, letterSpacing: "0.2em" }}>
                          Статьи
                        </p>
                        {content.articles.map((it, i) => (
                          <ArticleRow key={it.title} item={it} index={i} />
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            {/* характеристики */}
            <div className="px-5 md:px-9 py-8">
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
            <div
              className="px-5 md:px-9 py-8 flex flex-wrap items-center justify-between gap-5"
              style={{ borderTop: "1px solid rgba(255,90,0,0.35)" }}
            >
              <p className="font-mono text-white uppercase" style={{ fontSize: 14, letterSpacing: "0.04em" }}>
                Задача с этим материалом? Проверим на реализуемость.
              </p>
              <Link href="/#contact" className="btn btn-orange">
                Обсудить проект
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { MaterialVisual };
