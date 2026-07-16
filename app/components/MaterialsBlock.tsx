"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useReveal } from "./useReveal";
import SectionHead from "./SectionHead";

// Тизер раздела «Материалы» на главной. Задача — остановить взгляд и увести
// в полноценный раздел /materials («возможности, доказанные проектами»).

const MATERIALS = [
  { name: "Нержавеющая сталь", grad: "linear-gradient(135deg,#edeef0 0%,#9a9ca0 46%,#dadbdd 100%)" },
  { name: "Латунь", grad: "linear-gradient(135deg,#f1d99c 0%,#a9712f 52%,#f3e0a8 100%)" },
  { name: "Медь", grad: "linear-gradient(135deg,#f1b98a 0%,#9a4a25 52%,#e8a878 100%)" },
  { name: "Алюминий", grad: "linear-gradient(135deg,#e3e6e9 0%,#a3a8ad 50%,#cdd1d4 100%)" },
  { name: "Кортен", grad: "linear-gradient(135deg,#c47c4c 0%,#5e2c19 56%,#a85a36 100%)" },
  { name: "Титан", grad: "linear-gradient(135deg,#d3d4da 0%,#7b7e87 50%,#b4b6be 100%)" },
  { name: "Стекло", grad: "linear-gradient(135deg,rgba(198,226,234,0.92) 0%,rgba(120,160,178,0.6) 56%,rgba(212,234,240,0.88) 100%)" },
  { name: "Композит", grad: "linear-gradient(135deg,#45464b 0%,#0e0e11 56%,#5a5b61 100%)" },
];
const N = MATERIALS.length;

// Проекты-доказательства — «мы крутые по материалам»
const RECORDS = [
  { metric: "15 000", label: "пластин · панно Moscow Towers" },
  { metric: "6 × 3 М", label: "панель · зеркальный куб WinePark" },
  { metric: "0 КРЕПЕЖА", label: "биоморфный арт-потолок банка" },
];

function Face({ grad, back = false }: { grad: string; back?: boolean }) {
  return (
    <div
      className="absolute inset-0 rounded-full"
      style={{
        background: grad,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: back ? "rotateY(180deg)" : undefined,
        border: "1px solid rgba(255,255,255,0.22)",
        boxShadow:
          "inset 0 3px 20px rgba(255,255,255,0.4), inset 0 -14px 34px rgba(0,0,0,0.45), 0 26px 60px rgba(0,0,0,0.5)",
      }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(58% 48% at 34% 26%, rgba(255,255,255,0.65), transparent 62%)" }}
      />
      <div className="absolute rounded-full" style={{ inset: "12%", border: "1px solid rgba(255,255,255,0.18)" }} />
    </div>
  );
}

export default function MaterialsBlock() {
  const ref = useReveal();

  // rotating material coin
  const [step, setStep] = useState(0);
  const [faces, setFaces] = useState({ front: 0, back: 1 });
  useEffect(() => {
    const t = setInterval(() => setStep((s) => s + 1), 2400);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const idx = step % N;
    setFaces((f) => (step % 2 === 0 ? { ...f, front: idx } : { ...f, back: idx }));
  }, [step]);
  const activeIdx = step % N;

  return (
    <section id="materials" className="py-24 md:py-36" style={{ background: "var(--paper)" }}>
      <div className="container-x">
        <div ref={ref} className="reveal">
          <SectionHead index="06" kicker="Материалы" theme="light" />

          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <p className="font-mono text-orange uppercase mb-4" style={{ fontSize: 12, letterSpacing: "0.1em" }}>
                Возможности, доказанные проектами
              </p>
              <h2 className="text-ink max-w-3xl" style={{ fontSize: "clamp(28px, 3.8vw, 58px)", lineHeight: 1.02 }}>
                Не каталог материалов.
                <br />
                <span className="text-ink/45">Карта</span> инженерных возможностей
              </h2>
            </div>
            <Link href="/materials" className="btn btn-orange">
              Открыть раздел →
            </Link>
          </div>

          <div className="grid lg:grid-cols-2" style={{ gap: 1, background: "var(--line-light)" }}>
            {/* Rotating material coin */}
            <div className="relative min-h-[400px] overflow-hidden flex items-center justify-center" style={{ background: "#141414", perspective: 1000 }}>
              <div
                className="absolute inset-0 opacity-[0.16]"
                style={{ backgroundImage: "repeating-linear-gradient(60deg, rgba(255,90,0,0.5) 0 1px, transparent 1px 22px)" }}
              />
              <div
                className="relative"
                style={{
                  width: "min(56%, 240px)",
                  aspectRatio: "1 / 1",
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${step * 180}deg)`,
                  transition: "transform 0.95s cubic-bezier(0.6,0.05,0.2,1)",
                  marginBottom: 40,
                }}
              >
                <Face grad={MATERIALS[faces.front].grad} />
                <Face grad={MATERIALS[faces.back].grad} back />
              </div>

              <div className="absolute top-6 left-6 font-mono uppercase text-white/40" style={{ fontSize: 10, letterSpacing: "0.2em" }}>
                29 материалов · 6 семейств
              </div>

              <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Материал</p>
                  <p className="font-mono text-white text-lg tracking-[0.04em]">{MATERIALS[activeIdx].name}</p>
                </div>
                <span className="font-mono text-white/40 text-xs">
                  {String(activeIdx + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Records + manifesto + CTA */}
            <div className="p-8 md:p-12 flex flex-col" style={{ background: "var(--paper-card)" }}>
              <p className="font-body text-ink leading-relaxed mb-8" style={{ fontSize: "clamp(16px, 1.3vw, 19px)" }}>
                Раскрываем потенциал металла, стекла, камня и&nbsp;композитов через расчёт,
                прототипирование и&nbsp;производство. Чем сложнее форма, финиш или размер&nbsp;—
                тем профильнее заказ.
              </p>

              {/* proof records */}
              <div className="flex flex-col">
                {RECORDS.map((r, i) => (
                  <div
                    key={r.label}
                    className="flex items-baseline gap-5 py-4"
                    style={{ borderTop: "1px solid var(--line-light)", borderBottom: i === RECORDS.length - 1 ? "1px solid var(--line-light)" : undefined }}
                  >
                    <span className="font-mono text-ink shrink-0" style={{ fontSize: "clamp(20px, 2.2vw, 30px)", lineHeight: 1, minWidth: 128 }}>
                      {r.metric}
                    </span>
                    <span className="font-body text-ink-soft" style={{ fontSize: 14.5 }}>
                      {r.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* material tags */}
              <div className="mt-8 flex flex-wrap gap-2">
                {MATERIALS.map((m, i) => (
                  <span
                    key={m.name}
                    className="font-mono text-[10px] tracking-[0.06em] uppercase px-3 py-1.5 transition-colors"
                    style={{
                      border: `1px solid ${i === activeIdx ? "var(--orange)" : "var(--line-light)"}`,
                      color: i === activeIdx ? "var(--orange)" : "var(--ink-soft)",
                    }}
                  >
                    {m.name}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-8 flex flex-wrap gap-3">
                <Link href="/materials" className="btn btn-dark">
                  Смотреть возможности
                </Link>
                <Link href="/materials#navigator" className="btn btn-ghost-light">
                  Каталог материалов
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
