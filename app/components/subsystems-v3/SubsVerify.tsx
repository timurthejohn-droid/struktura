"use client";
import { useEffect, useRef, useState } from "react";
import SectionHead from "../SectionHead";
import { Lead, Reveal } from "./shared";
import Stage from "./three/Stage";
import StressShell from "./three/StressShell";

// К каждому материалу проверки — короткая подпись: что именно проверяли.
const steps = [
  { title: "Расчёт", text: "Нагрузки, деформации, прочность и работоспособность узлов." },
  { title: "Прототип", text: "Натурные образцы и mockup для проверки технологии и сборки." },
  { title: "Испытание", text: "Подтверждение характеристик там, где это требуется проектом и нормативами." },
  { title: "Проектная проверка", text: "Решение для объекта — с учётом условий эксплуатации, регламентов, сводов правил и стандартов." },
];

export default function SubsVerify() {
  const load = useRef(0.6);
  const [value, setValue] = useState(60);
  const [manual, setManual] = useState(false);

  // Нагрузка «дышит», пока её не взяли под контроль
  useEffect(() => {
    if (manual) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      const v = Math.round(55 + Math.sin(performance.now() / 1400) * 40);
      load.current = v / 100;
      setValue(v);
    }, 80);
    return () => clearInterval(id);
  }, [manual]);

  return (
    <section id="verification" className="py-20 md:py-32">
      <div className="container-x">
        <SectionHead index="08" kicker="Инженерная верификация" />
        <Lead>
          Доверие строится не на слове «точность», а на понятной цепочке проверки решения — от
          расчёта до проверки под конкретный объект.
        </Lead>

        <Reveal className="grid overflow-hidden bg-coal-deep text-white lg:grid-cols-[1.4fr_0.6fr]">
          <div className="relative h-[380px] md:h-[520px]">
            <Stage className="absolute inset-0" camera={[6.6, 4.9, 8]} target={[0, 0.5, 0]} fov={36} parallax={0.5}>
              <StressShell loadRef={load} />
            </Stage>
            <div className="pointer-events-none absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
              Расчётная схема · поле перемещений
            </div>
            {/* Шкала с подписанными осями */}
            <div className="pointer-events-none absolute bottom-5 left-5 right-5 md:right-auto md:w-[300px]">
              <div className="h-2" style={{ background: "linear-gradient(90deg,#1d4fa8,#2fa39a,#e8cc44,#d6411f)" }} />
              <div className="mt-1.5 flex justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-white/50">
                <span>0</span>
                <span>Перемещение, отн.</span>
                <span>max</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col border-t border-white/10 p-6 md:p-8 lg:border-l lg:border-t-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">Нагрузка</span>
            <div className="mt-2 font-mono text-[clamp(40px,4vw,64px)] leading-none tabular-nums text-orange">{value}%</div>
            <input
              type="range"
              min={0}
              max={100}
              value={value}
              aria-label="Нагрузка на оболочку"
              onChange={(e) => {
                setManual(true);
                setValue(+e.target.value);
                load.current = +e.target.value / 100;
              }}
              className="mt-5 w-full accent-[var(--orange)]"
            />
            <p className="mt-6 font-body text-[14px] leading-[1.6] text-white/55">
              Схема показывает принцип проверки: под нагрузкой оценивается, как перемещается оболочка
              и как работают опоры и узлы. Реальные значения задаёт расчёт конкретного объекта.
            </p>
          </div>
        </Reveal>

        <Reveal stagger className="mt-px grid gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <article key={s.title} className="relative bg-paper p-6 md:p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center border border-orange font-mono text-[11px] text-orange">{i + 1}</span>
                {i < steps.length - 1 && <span className="sv3-beam h-px flex-1 bg-black/10" />}
              </div>
              <h3 className="mt-6 text-[17px] text-ink">{s.title}</h3>
              <p className="mt-3 font-body text-[14px] leading-snug text-ink/60">{s.text}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
