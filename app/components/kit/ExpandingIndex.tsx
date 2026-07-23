"use client";
import { useState } from "react";

// Раскрывающийся индекс: строка под курсором увеличивается и открывает
// описание. Навигация как оглавление чертежа — плотно, без картинок.

type Row = { n: string; title: string; desc: string };

export default function ExpandingIndex({ rows }: { rows: Row[] }) {
  const [active, setActive] = useState(0);

  return (
    <div style={{ borderTop: "1px solid var(--line-dark)" }}>
      {rows.map((r, i) => {
        const on = active === i;
        return (
          <div
            key={r.title}
            onMouseEnter={() => setActive(i)}
            className="cursor-pointer"
            style={{
              borderBottom: "1px solid var(--line-dark)",
              background: on ? "rgba(255,90,0,0.06)" : "transparent",
              transition: "background-color 0.3s var(--ease-out)",
            }}
          >
            <div className="flex items-center gap-5" style={{ padding: "18px 22px" }}>
              <span className="font-mono text-orange" style={{ fontSize: 12 }}>
                {r.n}
              </span>
              <span
                className="font-mono uppercase flex-1"
                style={{
                  fontSize: on ? 21 : 16,
                  letterSpacing: "0.03em",
                  color: on ? "#fff" : "rgba(255,255,255,0.6)",
                  transition: "font-size 0.3s var(--ease-out), color 0.3s ease",
                }}
              >
                {r.title}
              </span>
              <span className="font-mono" style={{ fontSize: 15, color: on ? "var(--orange)" : "rgba(255,255,255,0.3)" }}>
                {on ? "—" : "+"}
              </span>
            </div>
            <div style={{ maxHeight: on ? 140 : 0, overflow: "hidden", transition: "max-height 0.4s var(--ease-out)" }}>
              <p
                className="font-body text-white/55"
                style={{ fontSize: 14.5, lineHeight: 1.55, padding: "0 22px 20px 59px" }}
              >
                {r.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
