"use client";
import { useEffect, useRef, useState } from "react";
import SectionHead from "../SectionHead";
import CapabilityExplorer from "./CapabilityExplorer";
import { CAPABILITIES } from "./materialsData";

// [02] НАВИГАТОР + КАТАЛОГ в одной секции (master-detail).
// Клик по возможности раскрывает проводник прямо под сеткой:
// семейства → материалы → характеристики, проекты, статьи, мировые кейсы.
// Deep-link: #forma, #kinetika… открывают нужный раздел при загрузке.

export default function MaterialsNavigator() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const explorerRef = useRef<HTMLDivElement>(null);

  // открыть раздел из hash при загрузке (deep-link: /materials#forma)
  useEffect(() => {
    const slug = window.location.hash.replace("#", "");
    if (CAPABILITIES.some((c) => c.slug === slug)) setActiveSlug(slug);
  }, []);

  // после раскрытия — подвести к панели
  useEffect(() => {
    if (!activeSlug) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    explorerRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }, [activeSlug]);

  const select = (slug: string) => {
    setActiveSlug(slug);
    history.replaceState(null, "", `#${slug}`);
  };
  const close = () => {
    setActiveSlug(null);
    history.replaceState(null, "", "#navigator");
  };

  const active = CAPABILITIES.find((c) => c.slug === activeSlug) ?? null;

  return (
    <section id="navigator" className="py-24 md:py-36" style={{ background: "var(--paper)" }}>
      <div className="container-x">
        <SectionHead index="02" kicker="Каталог возможностей" theme="light" />

        <p className="font-body text-ink-soft max-w-2xl mb-12" style={{ fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.6 }}>
          Ищите не&nbsp;сплав, а&nbsp;архитектурную возможность. Нажмите на&nbsp;раздел&nbsp;—
          ниже раскроются материалы, их&nbsp;характеристики, наши проекты и&nbsp;мировые кейсы.
        </p>

        {/* ——— Уровень 1: сетка возможностей ——— */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 1, background: "var(--line-light)" }}>
          {CAPABILITIES.map((item) => {
            const on = activeSlug === item.slug;
            return (
              <button
                key={item.slug}
                onClick={() => (on ? close() : select(item.slug))}
                aria-expanded={on}
                className="group block p-7 md:p-8 text-left transition-colors"
                style={{
                  background: on ? "var(--coal)" : "var(--paper-card)",
                  boxShadow: on ? "inset 0 3px 0 var(--orange)" : undefined,
                }}
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-orange" style={{ fontSize: 13 }}>
                    {item.n}
                  </span>
                  <h3
                    className="font-mono uppercase"
                    style={{ fontSize: "clamp(16px, 1.3vw, 19px)", letterSpacing: "0.01em", color: on ? "#fff" : "var(--ink)" }}
                  >
                    {item.title}
                  </h3>
                </div>
                <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${on ? "var(--line-dark)" : "var(--line-light)"}` }}>
                  <p className="font-body" style={{ fontSize: 14, color: on ? "rgba(255,255,255,0.6)" : "var(--ink-soft)" }}>
                    {item.tags}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.1em", color: on ? "rgba(255,255,255,0.45)" : "rgba(26,26,26,0.35)" }}>
                    {item.materials.length} материалов
                  </span>
                  <span
                    className="font-mono transition-colors"
                    style={{ fontSize: 12, color: on ? "var(--orange)" : "transparent" }}
                  >
                    {on ? "Открыто ↓" : "Открыть →"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ——— Уровень 2: проводник раскрывается на месте ——— */}
        {active && (
          <div ref={explorerRef} style={{ scrollMarginTop: 88 }}>
            <div key={active.slug} className="env-slide">
              {/* шапка раздела: заголовок + переключатель + закрыть */}
              <div className="flex items-end justify-between gap-6 flex-wrap mt-16 md:mt-20 mb-6">
                <div>
                  <p className="font-mono text-orange uppercase mb-3" style={{ fontSize: 11, letterSpacing: "0.14em" }}>
                    {active.n} / 09 · {active.tags}
                  </p>
                  <h3 className="text-ink" style={{ fontSize: "clamp(26px, 3.4vw, 52px)", lineHeight: 1 }}>
                    {active.title}
                  </h3>
                </div>
                <button
                  onClick={close}
                  className="font-mono uppercase text-ink-soft hover:text-orange transition-colors py-2"
                  style={{ fontSize: 11, letterSpacing: "0.12em" }}
                >
                  Свернуть ×
                </button>
              </div>

              <p className="font-body text-ink-soft max-w-3xl mb-8" style={{ fontSize: 15.5, lineHeight: 1.55 }}>
                {active.desc}
              </p>

              {/* переключатель разделов, чтобы не скроллить назад */}
              <div className="flex gap-1.5 mb-8 overflow-x-auto no-scrollbar pb-1">
                {CAPABILITIES.map((c) => {
                  const on = c.slug === active.slug;
                  return (
                    <button
                      key={c.slug}
                      onClick={() => select(c.slug)}
                      className="shrink-0 font-mono uppercase px-4 py-2.5 transition-colors"
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.06em",
                        background: on ? "var(--orange)" : "transparent",
                        color: on ? "#fff" : "var(--ink-soft)",
                        border: `1px solid ${on ? "var(--orange)" : "var(--line-light)"}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.n} {c.title}
                    </button>
                  );
                })}
              </div>

              <CapabilityExplorer capability={active} onSwitch={select} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
