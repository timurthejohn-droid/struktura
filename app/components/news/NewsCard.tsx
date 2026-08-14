import NewsCover from "./NewsCover";
import type { NewsItem } from "./newsData";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Карточка материала без рамок и подложек: обложка, под ней — типографика
 * прямо на фоне секции. Широкая (`wide`) занимает две колонки сетки.
 * Пока у материала нет своей страницы, карточка не кликабельна.
 */
export default function NewsCard({ item }: { item: NewsItem }) {
  const inner = (
    <>
      {/* Высота обложки общая для всех карточек: широкая отличается шириной,
          иначе заголовки в строке разъезжаются по вертикали. */}
      <div className="relative h-[230px] overflow-hidden bg-coal md:h-[270px] lg:h-[310px]">
        <NewsCover item={item} />
      </div>

      <div className={`mt-5 ${item.wide ? "max-w-[720px]" : ""}`}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em]">
          <span className="text-orange">{item.kind}</span>
          <span aria-hidden className="text-white/25">
            ·
          </span>
          <span className="text-white/40">{item.topic}</span>
          <span aria-hidden className="text-white/25">
            ·
          </span>
          <time dateTime={item.date} className="text-white/40">
            {item.dateLabel}
          </time>
        </div>

        <h3
          className="mt-4 font-body normal-case text-white transition-colors duration-300 group-hover:text-orange"
          style={{
            fontSize: item.wide ? "clamp(24px, 2.3vw, 34px)" : "clamp(19px, 1.6vw, 24px)",
            lineHeight: 1.16,
            fontWeight: 500,
            letterSpacing: 0,
          }}
        >
          {item.title}
        </h3>

        <p
          className="mt-3 max-w-[560px] font-body text-white/50"
          style={{ fontSize: 15, lineHeight: 1.5 }}
        >
          {item.excerpt}
        </p>

        <div className="mt-5 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.16em]">
          <span className="flex items-center gap-2 text-white/70 transition-colors duration-300 group-hover:text-orange">
            Читать
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
          {item.readTime && <span className="text-white/30">{item.readTime}</span>}
        </div>
      </div>
    </>
  );

  const className = "group block";

  if (item.href) {
    return (
      <a href={`${basePath}${item.href}`} className={className}>
        {inner}
      </a>
    );
  }

  return <article className={className}>{inner}</article>;
}
