type Theme = "light" | "dark" | "orange";

const C: Record<Theme, { index: string; title: string; mark: string; line: string }> = {
  light: {
    index: "var(--orange)",
    title: "var(--ink)",
    mark: "rgba(26,26,26,0.22)",
    line: "var(--line-light)",
  },
  dark: {
    index: "var(--orange)",
    title: "#ffffff",
    mark: "rgba(255,255,255,0.18)",
    line: "var(--line-dark)",
  },
  orange: {
    index: "#1a1a1a",
    title: "#ffffff",
    mark: "var(--orange-dark)",
    line: "rgba(0,0,0,0.22)",
  },
};

/**
 * Brandbook section header: a hairline meta row (section index + wide-tracked
 * STRUKTURA⁺ wordmark) followed by the BIG section name — so the block is
 * instantly identifiable while scrolling.
 */
export default function SectionHead({
  index,
  kicker,
  theme = "light",
  className = "",
}: {
  index: string;
  kicker: string;
  theme?: Theme;
  className?: string;
}) {
  const c = C[theme];
  return (
    <div className={`mb-10 md:mb-14 ${className}`}>
      <div
        className="flex items-center justify-between gap-4 pb-3"
        style={{ borderBottom: `1px solid ${c.line}` }}
      >
        <span
          className="font-mono font-medium"
          style={{ color: c.index, fontSize: 13, letterSpacing: "0.04em" }}
        >
          {index}
        </span>
        <span
          className="hidden sm:inline font-mono select-none"
          style={{ color: c.mark, fontSize: 12, letterSpacing: "0.32em" }}
          aria-hidden
        >
          STRUKTURA
          <span style={{ fontSize: 9, verticalAlign: "super", letterSpacing: 0 }}>+</span>
        </span>
      </div>

      <h2
        className="font-mono uppercase mt-5"
        style={{
          color: c.title,
          fontSize: "clamp(30px, 4.6vw, 72px)",
          lineHeight: 0.98,
          letterSpacing: "-0.01em",
        }}
      >
        {kicker}
      </h2>
    </div>
  );
}
