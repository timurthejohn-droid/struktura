"use client";
import { useEffect, useRef, useState } from "react";
import { useReveal } from "./useReveal";

const metrics = [
  { value: 14, suffix: "", label: "лет реализуем уникальные проекты" },
  { value: 10, suffix: "", label: "отраслевых наград" },
  { value: 70, suffix: "+", label: "лучших экспертов в команде" },
];

const clients = ["ЛАХТА ЦЕНТР", "СБЕР", "ATOM", "МУЗЕЙ КРЕМЛЯ", "МОСКВА-СИТИ", "MR GROUP", "ГАЗПРОМ", "VESPER"];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !done.current) {
          done.current = true;
          // rAF + ease-out: цифры разгоняются и мягко тормозят у цели
          const dur = 1200;
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 4);
            setN(Math.round(value * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
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

export default function TrustStrip() {
  const revealRef = useReveal();
  const metricsRef = useReveal(0.3);
  return (
    <section className="py-16 md:py-20" style={{ background: "var(--paper)", borderTop: "1px solid var(--line-light)" }}>
      <div className="container-x reveal" ref={revealRef}>
        {/* Metrics */}
        <div ref={metricsRef} className="reveal-stagger grid md:grid-cols-3 gap-10 md:gap-6 mb-16">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col items-center text-center">
              <div
                className="font-mono text-ink leading-none"
                style={{ fontSize: "clamp(56px, 7vw, 104px)", fontVariantNumeric: "tabular-nums" }}
              >
                <Counter value={m.value} suffix={m.suffix} />
              </div>
              <p className="font-body text-ink-soft text-sm mt-3 max-w-[220px]">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Client ticker */}
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/35 mb-6">
          Реализовано для лидеров рынка
        </p>
        <div
          className="relative overflow-hidden no-scrollbar"
          style={{ maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" }}
        >
          <div className="flex gap-14 w-max animate-logo-scroll">
            {[...clients, ...clients].map((c, i) => (
              <span key={i} className="font-mono text-base md:text-lg tracking-[0.08em] text-ink/35 whitespace-nowrap">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
