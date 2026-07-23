// Технический тикер: бесконечная бегущая моно-строка с оранжевыми «+».
// Как аннотация на чертеже или биржевая лента. Пауза при наведении.
// Анимация — в globals.css (.kit-marquee), чтобы уважать reduced-motion.

export default function KitTicker({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div
      className="relative overflow-hidden"
      style={{ borderTop: "1px solid var(--line-dark)", borderBottom: "1px solid var(--line-dark)" }}
    >
      <div className="kit-marquee flex whitespace-nowrap">
        {row.map((it, i) => (
          <span
            key={i}
            className="font-mono uppercase inline-flex items-center"
            style={{ fontSize: 13, letterSpacing: "0.1em", color: "rgba(255,255,255,0.7)", padding: "16px 0" }}
          >
            <span className="text-orange" style={{ margin: "0 30px" }} aria-hidden>
              +
            </span>
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
