"use client";

import { useMemo, useState } from "react";
import { caseCategories, cases, type CaseCategory } from "./casesData";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Полный список работ под стопкой: быстрый просмотр и фильтр по направлению.
// Строки с готовой страницей кликабельны, остальные — просто индекс.

export default function CasesIndex() {
  const [filter, setFilter] = useState<CaseCategory | "Все">("Все");
  const rows = useMemo(
    () => (filter === "Все" ? cases : cases.filter((item) => item.category === filter)),
    [filter],
  );

  return (
    <section className="relative z-[20] bg-coal-deep py-16 md:py-24">
      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <p className="eyebrow text-white/40">Полный индекс</p>
            <h2 className="mt-6 max-w-[620px] text-[clamp(26px,3.4vw,48px)] leading-[1.02] text-white">
              Все работы одним списком
            </h2>
          </div>
          <p className="max-w-[300px] font-body text-[14px] leading-[1.5] text-white/45 md:pb-2">
            Отфильтруйте по направлению — или вернитесь к стопке кейсов выше.
          </p>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3" aria-label="Фильтр проектов">
          {caseCategories.map((category) => {
            const isActive = category === filter;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                aria-pressed={isActive}
                className="border-b-2 pb-1 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors"
                style={{
                  borderColor: isActive ? "var(--orange)" : "transparent",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.42)",
                }}
              >
                {category}
              </button>
            );
          })}
          <span className="ml-auto font-mono text-[11px] tracking-[0.14em] text-white/30">
            {String(rows.length).padStart(2, "0")}
          </span>
        </div>

        <div className="mt-4 border-t border-white/12">
          {rows.map((item) => {
            const Row = item.href ? "a" : "div";
            return (
              <Row
                key={item.slug}
                {...(item.href ? { href: `${basePath}${item.href}` } : {})}
                className="group grid grid-cols-[38px_minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-2 border-b border-white/12 px-1 py-5 transition-colors hover:bg-white/[0.04] md:grid-cols-[56px_minmax(0,1fr)_minmax(0,1fr)_180px_74px] md:items-center md:gap-x-6"
                style={{ cursor: item.href ? "pointer" : "default" }}
              >
                <span className="font-mono text-[11px] tracking-[0.14em] text-orange">{item.number}</span>

                <span className="font-mono text-[clamp(15px,1.7vw,24px)] uppercase leading-[1.1] text-white transition-colors group-hover:text-orange">
                  {item.name}
                </span>

                <span className="order-last col-span-2 col-start-2 font-body text-[13px] leading-[1.45] text-white/50 md:order-none md:col-span-1 md:col-start-auto md:text-[14px]">
                  {item.work}
                </span>

                <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 md:block">
                  {item.category}
                </span>

                <span className="justify-self-end font-mono text-[11px] tracking-[0.14em] text-white/40">
                  {item.href ? (
                    <span className="inline-flex items-center gap-2">
                      {item.year}
                      <span aria-hidden className="text-orange opacity-0 transition-opacity group-hover:opacity-100">
                        →
                      </span>
                    </span>
                  ) : (
                    item.year
                  )}
                </span>
              </Row>
            );
          })}
        </div>
      </div>
    </section>
  );
}
