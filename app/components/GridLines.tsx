/**
 * Faint vertical modular grid lines aligned to the content container —
 * the brandbook column-rule device. Place inside a `relative` section as the
 * first child and give the real content `relative z-10` so it sits on top.
 */
export default function GridLines({
  theme = "dark",
  count = 5,
}: {
  theme?: "dark" | "light";
  count?: number;
}) {
  const color = theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
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
