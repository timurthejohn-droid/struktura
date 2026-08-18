"use client";

import { useMemo, useState } from "react";
import NewsCard from "./NewsCard";
import { news, newsKinds, type NewsKind } from "./newsData";

/**
 * Общая лента новостей и статей с фильтром по типу материала.
 * Широкие карточки разбивают сетку, чтобы лента не выглядела таблицей.
 */
export default function NewsIndex() {
  const [filter, setFilter] = useState<NewsKind | "Все">("Все");

  const rows = useMemo(
    () => (filter === "Все" ? news : news.filter((item) => item.kind === filter)),
    [filter],
  );

  return (
    <section id="lenta" className="bg-coal-deep py-16 md:py-24">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6 border-b border-white/12 pb-5">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3" aria-label="Фильтр материалов">
            {newsKinds.map((kind) => {
              const isActive = kind === filter;
              return (
                <button
                  key={kind}
                  type="button"
                  onClick={() => setFilter(kind)}
                  aria-pressed={isActive}
                  className="border-b-2 pb-1 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors"
                  style={{
                    borderColor: isActive ? "var(--orange)" : "transparent",
                    color: isActive ? "#fff" : "rgba(255,255,255,0.42)",
                  }}
                >
                  {kind === "Новость" ? "Новости" : kind === "Статья" ? "Статьи" : kind}
                </button>
              );
            })}
          </div>

          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/30">
            {String(rows.length).padStart(2, "0")} материалов
          </span>
        </div>

        <div className="mt-10 grid gap-x-7 gap-y-14 md:mt-14 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
          {rows.map((item) => (
            <div key={item.slug} className={item.wide ? "md:col-span-2" : undefined}>
              <NewsCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
