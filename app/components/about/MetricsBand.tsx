"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "../useReveal";

const metrics = [
  { value: 14, suffix: "", label: "лет реализуем уникальные проекты" },
  { value: 70, suffix: "+", label: "лучших экспертов в команде" },
  { value: 10, suffix: "", label: "отраслевых наград" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || done.current) return;
        done.current = true;
        const dur = 1200;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          setN(Math.round(value * (1 - Math.pow(1 - p, 4))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

/** Тикающие цифры из референс-кита: компания «одним взглядом» сразу под героем. */
export default function MetricsBand() {
  const ref = useReveal(0.25);

  return (
    <section className="border-b border-black/10 bg-paper">
      <div ref={ref} className="container-x reveal">
        <div className="grid border-l border-black/10 md:grid-cols-3">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="flex items-baseline gap-6 border-b border-r border-black/10 px-6 py-9 last:border-b-0 md:border-b-0 md:px-8 md:py-12"
            >
              <span
                className="font-mono leading-[0.85] text-ink"
                style={{ fontSize: "clamp(46px,5.4vw,86px)", fontVariantNumeric: "tabular-nums" }}
              >
                <Counter value={m.value} suffix={m.suffix} />
              </span>
              <p className="max-w-[190px] font-body text-[13px] leading-[1.45] text-ink/50">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
