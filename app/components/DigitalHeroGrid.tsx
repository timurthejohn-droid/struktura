/**
 * Ambient dot-matrix backdrop for the digital-environment hero — same LED-grid
 * language as the homepage's DigitalEnvFlow board, here just breathing quietly
 * behind the headline instead of displaying data. Deterministic pseudo-random
 * per-cell timing (no client JS/state needed — pure CSS animation).
 */
const COLS = 64;
const ROWS = 22;

function seeded(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export default function DigitalHeroGrid() {
  const cells = Array.from({ length: COLS * ROWS });

  return (
    <div
      aria-hidden
      className="dot-grid pointer-events-none absolute inset-0"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gap: "clamp(3px, 0.6vw, 7px)",
        padding: "clamp(3px, 0.6vw, 7px)",
        maskImage: "linear-gradient(to bottom, black 0%, black 46%, transparent 88%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 46%, transparent 88%)",
      }}
    >
      {cells.map((_, i) => {
        const r1 = seeded(i);
        const r2 = seeded(i + 0.37);
        return (
          <span
            key={i}
            style={
              {
                width: "3px",
                height: "3px",
                borderRadius: "1px",
                background: "var(--orange)",
                "--dot-min": 0.05 + r1 * 0.08,
                "--dot-max": 0.35 + r2 * 0.45,
                "--dot-dur": `${3.2 + r1 * 3.6}s`,
                "--dot-delay": `${-(r2 * 5)}s`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
