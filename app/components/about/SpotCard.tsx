"use client";

import { useCallback } from "react";

/**
 * Спотлайт-карточка из референс-кита: за курсором идёт мягкое оранжевое пятно,
 * по диагонали проявляются угловые засечки. На тач-устройствах — обычная карточка.
 */
export default function SpotCard({
  children,
  theme = "dark",
  className = "",
}: {
  children: React.ReactNode;
  theme?: "dark" | "light";
  className?: string;
}) {
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  }, []);

  const dark = theme === "dark";

  return (
    <div
      onMouseMove={onMove}
      className={`spot border ${dark ? "border-white/12" : "border-black/10"} ${className}`}
      style={
        {
          background: dark ? "var(--coal-deep)" : "var(--paper-card)",
          "--spot-tint": dark ? "rgba(255,90,0,0.18)" : "rgba(255,90,0,0.09)",
        } as React.CSSProperties
      }
    >
      <div className="spot-glow" />
      <span
        className="spot-corner"
        style={{ top: 0, left: 0, borderTop: "1px solid var(--orange)", borderLeft: "1px solid var(--orange)" }}
      />
      <span
        className="spot-corner"
        style={{ bottom: 0, right: 0, borderBottom: "1px solid var(--orange)", borderRight: "1px solid var(--orange)" }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
