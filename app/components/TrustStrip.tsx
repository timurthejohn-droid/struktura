"use client";
import { useEffect, useRef, useState } from "react";

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
          const steps = 50;
          let i = 0;
          const t = setInterval(() => {
            i++;
            setN(Math.round((value * i) / steps));
            if (i >= steps) clearInterval(t);
          }, 22);
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
  return (
    <section className="py-16 md:py-20" style={{ background: "var(--paper)", borderTop: "1px solid var(--line-light)" }}>
      <div className="container-x">
        {/* Metrics */}
        <div className="grid md:grid-cols-3 gap-10 md:gap-6 mb-16">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col">
              <div className="font-mono text-ink leading-none" style={{ fontSize: "clamp(56px, 7vw, 104px)" }}>
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
