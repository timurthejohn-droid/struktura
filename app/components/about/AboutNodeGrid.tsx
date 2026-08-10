/**
 * Подложка героя «О компании»: каркас из узлов и связей — визуальная метафора
 * страницы («люди, знания и технологии работают как единая система»).
 * Геометрия детерминированная, отрисовка — чистый CSS (без клиентского JS).
 */
const COLS = 13;
const ROWS = 8;
const W = 1440;
const H = 900;

const stepX = W / (COLS - 1);
const stepY = H / (ROWS - 1);

function point(i: number, j: number) {
  const x = i * stepX + Math.sin(j * 0.9 + i * 0.35) * 22;
  const y = j * stepY + Math.cos(i * 0.7) * 26 + Math.sin(j * 1.3) * 10;
  return [x, y] as const;
}

const rows = Array.from({ length: ROWS }, (_, j) =>
  Array.from({ length: COLS }, (_, i) => point(i, j))
);

export default function AboutNodeGrid({ theme = "light" }: { theme?: "light" | "dark" }) {
  const line = theme === "dark" ? "rgba(255,255,255,0.09)" : "rgba(26,26,26,0.09)";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        maskImage: "linear-gradient(to bottom, black 0%, black 52%, transparent 92%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 52%, transparent 92%)",
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        {/* горизонтальные связи */}
        {rows.map((row, j) => (
          <polyline
            key={`h${j}`}
            className="ab-line"
            points={row.map(([x, y]) => `${x},${y}`).join(" ")}
            fill="none"
            stroke={line}
            strokeWidth={1}
            style={{ animationDelay: `${0.15 + j * 0.09}s` }}
          />
        ))}

        {/* вертикальные связи */}
        {Array.from({ length: COLS }, (_, i) => (
          <polyline
            key={`v${i}`}
            className="ab-line"
            points={rows.map((row) => `${row[i][0]},${row[i][1]}`).join(" ")}
            fill="none"
            stroke={line}
            strokeWidth={1}
            style={{ animationDelay: `${0.3 + i * 0.05}s` }}
          />
        ))}

        {/* узлы: редкие — оранжевые, остальные приглушённые */}
        {rows.map((row, j) =>
          row.map(([x, y], i) => {
            const accent = (i * 5 + j * 3) % 11 === 0;
            return (
              <rect
                key={`n${i}-${j}`}
                className="ab-node"
                x={x - 2.5}
                y={y - 2.5}
                width={5}
                height={5}
                fill={accent ? "var(--orange)" : line}
                opacity={accent ? 1 : 0.8}
                style={{ animationDelay: `${0.7 + (i * 0.03 + j * 0.06)}s` }}
              />
            );
          })
        )}
      </svg>
    </div>
  );
}
