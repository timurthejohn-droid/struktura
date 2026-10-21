/**
 * Faint vertical modular grid lines aligned to the content container —
 * the brandbook column-rule device. Place inside a `relative` section as the
 * first child and give the real content `relative z-10` so it sits on top.
 *
 * `positions` — доли ширины контентной области (без полей контейнера), например
 * золотое сечение [0, 0.382, 0.618, 1]. Без него — `count` равных колонок по краям контейнера.
 */
export default function GridLines({
  theme = "dark",
  count = 5,
  positions,
}: {
  theme?: "dark" | "light";
  count?: number;
  positions?: number[];
}) {
  const color = theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  if (positions) {
    return (
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden>
        <div className="container-x h-full">
          <div className="relative h-full">
            {positions.map((p) => (
              <span
                key={p}
                className="absolute inset-y-0"
                style={{ left: `${p * 100}%`, width: 1, background: color, marginLeft: p >= 1 ? -1 : 0 }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden>
      <div className="container-x h-full relative">
        <div className="absolute inset-0 flex justify-between">
          {Array.from({ length: count }).map((_, i) => (
            <span key={i} style={{ width: 1, height: "100%", background: color }} />
          ))}
        </div>
      </div>
    </div>
  );
}
