import type { NewsItem } from "./newsData";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Обложка материала: фото, если оно есть, иначе — технический паттерн.
 * Паттерны держат ленту в ритме чертежа, когда снимка под материал нет.
 */
export default function NewsCover({ item }: { item: NewsItem }) {
  if (item.image) {
    return (
      <>
        <img
          src={`${basePath}${item.image}`}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </>
    );
  }

  return (
    <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
      <svg
        viewBox="0 0 400 250"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        aria-hidden
      >
        <rect width="400" height="250" fill="var(--coal-deep)" />
        {item.pattern === "grid" && <PatternGrid />}
        {item.pattern === "hatch" && <PatternHatch />}
        {item.pattern === "arcs" && <PatternArcs />}
        {item.pattern === "dots" && <PatternDots />}
      </svg>
    </div>
  );
}

/* Модульная сетка с несколькими «занятыми» ячейками */
function PatternGrid() {
  const step = 40;
  const filled = [
    [2, 1],
    [5, 2],
    [7, 3],
  ];
  return (
    <g>
      {Array.from({ length: 11 }).map((_, i) => (
        <line key={`v${i}`} x1={i * step} y1="0" x2={i * step} y2="250" stroke="rgba(255,255,255,0.10)" />
      ))}
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * step} x2="400" y2={i * step} stroke="rgba(255,255,255,0.10)" />
      ))}
      {filled.map(([cx, cy]) => (
        <rect
          key={`${cx}-${cy}`}
          x={cx * step}
          y={cy * step}
          width={step}
          height={step}
          fill="var(--orange)"
          opacity={0.85}
        />
      ))}
    </g>
  );
}

/* Диагональная штриховка с оранжевой полосой */
function PatternHatch() {
  return (
    <g>
      {Array.from({ length: 40 }).map((_, i) => (
        <line
          key={i}
          x1={-100 + i * 18}
          y1="0"
          x2={-100 + i * 18 + 250}
          y2="250"
          stroke={i === 14 || i === 15 ? "var(--orange)" : "rgba(255,255,255,0.12)"}
          strokeWidth={i === 14 || i === 15 ? 3 : 1}
        />
      ))}
    </g>
  );
}

/* Концентрические дуги из угла — развёртка радиуса */
function PatternArcs() {
  return (
    <g fill="none">
      {Array.from({ length: 12 }).map((_, i) => (
        <circle
          key={i}
          cx="40"
          cy="230"
          r={30 + i * 34}
          stroke={i === 4 ? "var(--orange)" : "rgba(255,255,255,0.12)"}
          strokeWidth={i === 4 ? 2 : 1}
        />
      ))}
    </g>
  );
}

/* Точечная матрица с нарастающей плотностью */
function PatternDots() {
  const cols = 16;
  const rows = 10;
  return (
    <g>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const accent = r === 4 && c > 5 && c < 10;
          return (
            <circle
              key={`${r}-${c}`}
              cx={16 + c * 25}
              cy={14 + r * 25}
              r={accent ? 4 : 1 + (r / rows) * 2.4}
              fill={accent ? "var(--orange)" : "rgba(255,255,255,0.22)"}
            />
          );
        }),
      )}
    </g>
  );
}
