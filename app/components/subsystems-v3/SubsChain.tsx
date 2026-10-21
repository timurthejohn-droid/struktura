"use client";
import { useEffect, useState } from "react";
import SectionHead from "../SectionHead";
import { useAutoStep, useInView } from "./hooks";
import { Tag, cubic } from "./illustrations";
import { Lead, Reveal } from "./shared";

const ID = "S-024 · N-07";
const O = "#ff5a00";
const mono = "CoFo Sans Mono, monospace";

const story = [
  { step: "BIM", title: "Элемент в модели", text: "Деталь получает геометрию, координату и идентификатор в общей модели." },
  { step: "CAM", title: "Данные обработки", text: "Из модели автоматически формируется производственное задание." },
  { step: "CNC · Robot", title: "Изготовление", text: "Экструзия, ЧПУ, роботизированные и аддитивные операции." },
  { step: "ID", title: "Нанесённая метка", text: "Метка связывает деталь с моделью и монтажным комплектом." },
  { step: "Монтаж", title: "Место в конструкции", text: "Деталь встаёт на своё место и проходит проверку положения." },
];

// Оболочка в кадре «место в конструкции»
const shell = cubic([40, 80], [200, 30], [400, 30], [560, 80]);

// Контур детали — общий для всех кадров
const PART = "M210 110 H390 V150 H270 V250 H210 Z";
const HOLES = [
  [240, 130],
  [330, 130],
  [240, 220],
];

function Frame({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <g className={on ? "cmp-on" : ""} style={{ opacity: on ? 1 : 0, transition: "opacity .6s var(--ease-out)" }}>
      {children}
    </g>
  );
}

function PartStage({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 600 360" className="h-auto w-full" role="img" aria-label={`Деталь ${ID}: ${story[step].title}`}>
      {/* 01 — модель */}
      <Frame on={step === 0}>
        {[[60, 60], [440, 70], [70, 250], [450, 240]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} h80 v20 h-50 v50 h-30 z`} fill="none" stroke="rgba(255,255,255,.14)" />
        ))}
        <path d={PART} pathLength={1} fill="none" stroke="#fff" strokeWidth="1.5" className="cmp-draw" style={{ strokeDasharray: 1 }} />
        {HOLES.map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r="7" fill="none" stroke="#fff" className="cmp-pop" />
        ))}
        <g stroke={O} strokeWidth="1" className="cmp-pop" style={{ animationDelay: ".6s" }}>
          <path d="M210 92 H390 M210 86 V98 M390 86 V98" />
          <path d="M410 110 V150 M404 110 H416 M404 150 H416" />
        </g>
        <text x="282" y="84" fill={O} fontFamily={mono} fontSize="11">180</text>
        <text x="420" y="134" fill={O} fontFamily={mono} fontSize="11">40</text>
        <g className="cmp-pop" style={{ animationDelay: ".9s" }}>
          <path d="M210 250 l-30 30 M210 250 h40 M210 250 v-40" stroke="rgba(255,255,255,.5)" />
          <text x="150" y="298" fill="rgba(255,255,255,.55)" fontFamily={mono} fontSize="10">КООРДИНАТА · ОРИЕНТАЦИЯ · ID</text>
        </g>
      </Frame>

      {/* 02 — данные обработки */}
      <Frame on={step === 1}>
        <path d={PART} fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.5)" />
        <path
          d="M220 120 H380 V128 H220 V136 H380 V142 H280 V150 H220 V160 H262 V170 H220 V180 H262 V190 H220 V200 H262 V210 H220 V220 H262 V230 H220 V240 H262"
          pathLength={1}
          fill="none"
          stroke={O}
          strokeWidth="1.2"
          className="cmp-draw"
          style={{ strokeDasharray: 1, animationDuration: "2.4s" }}
        />
        <g fontFamily={mono} fontSize="10" fill="rgba(255,255,255,.55)">
          {["G90 G54", "T04 M06", "S12000 M03", "G00 X220 Y120", "G01 Z-6 F800", "G01 X380", "…", "M30"].map((l, i) => (
            <text key={l} x="440" y={120 + i * 16} className="cmp-pop" style={{ animationDelay: `${0.2 + i * 0.12}s` }}>
              {l}
            </text>
          ))}
        </g>
      </Frame>

      {/* 03 — изготовление */}
      <Frame on={step === 2}>
        <path d={PART} fill="#3a3936" stroke="rgba(255,255,255,.6)" />
        {HOLES.map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r="7" fill="#181818" stroke="rgba(255,255,255,.5)" />
        ))}
        <g className="sv3-drive" style={{ animationDuration: "2.6s" }}>
          <rect x="292" y="30" width="26" height="62" fill="none" stroke="#fff" strokeWidth="1.5" />
          <rect x="300" y="92" width="10" height="16" fill="#fff" />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={296 + i * 5} cy={114 - (i % 2) * 4} r="1.6" fill={O} className="sv3-blink" style={{ animationDelay: `${i * 0.12}s`, animationDuration: ".6s" }} />
          ))}
        </g>
        <g fontFamily={mono} fontSize="10" fill="rgba(255,255,255,.55)">
          <text x="60" y="300">СЕРИЯ ДЕТАЛЕЙ ИЗ МОДЕЛИ</text>
          <text x="420" y="300" fill={O}>ОБРАБОТКА ЧПУ</text>
        </g>
      </Frame>

      {/* 04 — метка */}
      <Frame on={step === 3}>
        <path d={PART} fill="#3a3936" stroke="rgba(255,255,255,.6)" />
        <g className="cmp-pop" style={{ animationDelay: ".2s" }}>
          <Tag x={214} y={160} size={46} seed={5} />
        </g>
        <g className="sv3-scan" style={{ animationDuration: "2.2s" }}>
          <rect x="190" y="150" width="2" height="70" fill={O} />
        </g>
        <path d="M262 182 H440" stroke={O} strokeDasharray="3 4" className="cmp-pop" style={{ animationDelay: ".5s" }} />
        <g fontFamily={mono} className="cmp-pop" style={{ animationDelay: ".6s" }}>
          <rect x="440" y="150" width="130" height="66" fill="none" stroke="rgba(255,255,255,.3)" />
          <text x="452" y="172" fontSize="12" fill="#fff">{ID}</text>
          <text x="452" y="190" fontSize="9" fill="rgba(255,255,255,.55)">КОМПЛЕКТ K-12</text>
          <text x="452" y="204" fontSize="9" fill={O}>ЗОНА B · ЯРУС 3</text>
        </g>
      </Frame>

      {/* 05 — место в конструкции */}
      <Frame on={step === 4}>
        <path d={shell.d} fill="none" stroke="#fff" strokeWidth="8" opacity=".85" />
        <path d="M40 300 H560" stroke="rgba(255,255,255,.3)" strokeWidth="6" />
        {[80, 160, 240, 320, 400, 480].map((x, i) => {
          const y = shell.y(x) + 4;
          const hit = i === 3;
          return (
            <g key={x}>
              <path d={`M${x} ${y} V300`} stroke="rgba(255,255,255,.35)" strokeWidth="3" />
              <rect x={x - 12} y={y} width="24" height="16" fill={hit ? O : "#3a3936"} stroke={hit ? O : "rgba(255,255,255,.5)"} className={hit ? "cmp-pop" : ""} style={hit ? { animationDelay: ".3s" } : undefined} />
            </g>
          );
        })}
        <g className="cmp-pop" style={{ animationDelay: ".8s" }}>
          <circle cx="320" cy="140" r="22" fill="none" stroke="#8ac9a2" strokeWidth="2" />
          <path d="M309 140 l8 8 15-17" stroke="#8ac9a2" strokeWidth="3" fill="none" />
          <text x="352" y="144" fontFamily={mono} fontSize="11" fill="#8ac9a2">ПОЛОЖЕНИЕ ПОДТВЕРЖДЕНО</text>
        </g>
      </Frame>
    </svg>
  );
}

const jointStates = [
  { title: "Метки сохраняют связь с моделью", text: "Идентификаторы связывают элемент с его местом, актуальными данными и монтажным комплектом." },
  { title: "Сопряжение задаёт положение", text: "Принцип «папа–мама» направляет соединение. Ориентация, доступ и регулировки продуманы при разработке узла." },
  { title: "Проверка собранного результата", text: "После соединения проверяются фиксация и предусмотренное положение. Результат контроля возвращается в модель." },
];

/** Узел «папа–мама» с метками. Геометрию заменить на реальный узел STRUKTURA, когда будет. */
function Joint({ v }: { v: number }) {
  const dx = 110 * (1 - v);
  const ready = v >= 0.95;
  return (
    <svg viewBox="0 0 600 260" className="h-auto w-full" role="img" aria-label="Сопряжение «папа–мама», метки и проверка положения">
      <defs>
        <linearGradient id="sv3-ja" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#4a4945" />
          <stop offset="1" stopColor="#2a2927" />
        </linearGradient>
      </defs>
      <g transform={`translate(${-dx} 0)`}>
        <path d="M120 70 H300 V112 H340 V148 H300 V190 H120 Z" fill="url(#sv3-ja)" stroke="#e9e7e1" strokeWidth="1.2" />
        <Tag x={140} y={90} size={28} seed={11} />
        <text x="140" y="174" fill="#fff" fontFamily={mono} fontSize="12">N-07 / A</text>
        <path d="M268 160 V176 M276 160 V176 M284 160 V176" stroke={O} strokeWidth="2" />
      </g>
      <g transform={`translate(${dx} 0)`}>
        <path d="M300 70 H470 V190 H300 V150 H342 V110 H300 Z" fill="url(#sv3-ja)" stroke="#e9e7e1" strokeWidth="1.2" />
        <Tag x={420} y={90} size={28} seed={13} />
        <text x="452" y="174" textAnchor="end" fill="#fff" fontFamily={mono} fontSize="12">N-07 / B</text>
        <path d="M316 160 V176 M324 160 V176 M332 160 V176" stroke={O} strokeWidth="2" />
      </g>
      <path d="M300 40 V220" stroke={O} strokeDasharray="4 5" opacity=".55" />
      <text x="300" y="246" textAnchor="middle" fill={ready ? "#8ac9a2" : "rgba(255,255,255,.55)"} fontSize="11" fontFamily={mono} letterSpacing="1">
        {ready ? "ФИКСАЦИЯ · ПОЛОЖЕНИЕ ПОДТВЕРЖДЕНО" : "МЕТКИ → ИДЕНТИФИКАЦИЯ · СОПРЯЖЕНИЕ → ПОЛОЖЕНИЕ"}
      </text>
      <g style={{ opacity: ready ? 1 : 0, transition: "opacity .4s" }} stroke="#8ac9a2" fill="none">
        <circle cx="530" cy="130" r="22" strokeWidth="2" />
        <path d="M519 130 l8 8 15-17" strokeWidth="3" />
      </g>
    </svg>
  );
}

export default function SubsChain() {
  const [viewRef, seen] = useInView<HTMLDivElement>(0.3);
  const [step, setStep] = useAutoStep(story.length, 3800, seen);

  // Узел сам собирается/разбирается, пока пользователь не тронет ползунок
  const [v, setV] = useState(0);
  const [manual, setManual] = useState(false);
  const [jointRef, jointSeen] = useInView<HTMLDivElement>(0.4);
  useEffect(() => {
    if (manual || !jointSeen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setV(1);
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = ((now - t0) / 5200) % 1;
      const x = t < 0.55 ? t / 0.55 : t < 0.85 ? 1 : 1 - (t - 0.85) / 0.15;
      setV(x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [manual, jointSeen]);
  const k = v < 0.3 ? 0 : v < 0.95 ? 1 : 2;

  return (
    <section id="bim-cam" className="bg-coal py-20 text-white md:py-32">
      <div className="container-x">
        <SectionHead index="06" kicker="От модели к изготовлению и сборке" theme="dark" />
        <Lead dark>
          BIM → CAM: геометрия, данные обработки и маркировка связаны одной моделью. Вот история
          одной детали — от элемента в модели до её места в собранной конструкции.
        </Lead>

        <div ref={viewRef} className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
          <ol className="border-t border-white/12">
            {story.map((s, i) => {
              const on = i === step;
              return (
                <li key={s.title} className="border-b border-white/12">
                  <button type="button" onClick={() => setStep(i)} className="relative w-full py-5 text-left" aria-current={on}>
                    <span className="absolute bottom-0 left-0 h-[2px] bg-orange" style={{ width: on ? "100%" : "0%", transition: on ? "width 3.8s linear" : "none" }} />
                    <div className="flex items-baseline gap-4">
                      <span className={`font-mono text-[12px] ${on ? "text-orange" : "text-white/35"}`}>{String(i + 1).padStart(2, "0")}</span>
                      <span className={`flex-1 font-mono text-[clamp(14px,1.2vw,17px)] uppercase ${on ? "text-white" : "text-white/55"}`}>{s.title}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">{s.step}</span>
                    </div>
                    <p
                      className="overflow-hidden pl-9 font-body text-[14px] leading-snug text-white/60 transition-all duration-500"
                      style={{ maxHeight: on ? 60 : 0, opacity: on ? 1 : 0, marginTop: on ? 8 : 0 }}
                    >
                      {s.text}
                    </p>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="relative border border-white/12 bg-coal-deep p-4 md:p-8">
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
              <span>{ID}</span>
              <span className="text-orange">{story[step].step}</span>
            </div>
            <PartStage step={step} />
          </div>
        </div>

        <Reveal className="mt-16 md:mt-24">
          <p className="font-mono uppercase" style={{ fontSize: "clamp(20px, 2.6vw, 40px)", lineHeight: 1.08 }}>
            Мы стандартизируем <span className="text-orange">не архитектуру</span>,<br className="hidden md:block" /> а способ её надёжной реализации
          </p>
        </Reveal>

        <div ref={jointRef} className="mt-16 grid gap-10 border-t border-white/12 pt-12 md:mt-20 lg:grid-cols-[1.3fr_0.7fr] lg:gap-14">
          <div>
            <span className="eyebrow text-orange">Метки · сопряжения · регулировки · проверка</span>
            <div className="mt-6">
              <Joint v={v} />
            </div>
            <label htmlFor="joint-progress" className="mt-4 block font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
              Собрать узел вручную
            </label>
            <input
              id="joint-progress"
              type="range"
              min={0}
              max={100}
              value={Math.round(v * 100)}
              onChange={(e) => {
                setManual(true);
                setV(+e.target.value / 100);
              }}
              className="mt-2 w-full accent-[var(--orange)]"
            />
          </div>
          <div aria-live="polite" className="flex flex-col justify-center">
            <h3 className="text-[clamp(22px,2vw,30px)] leading-[1.05]">Детали знают своё место в конструкции</h3>
            <div className="mt-8 flex gap-1.5">
              {jointStates.map((s, i) => (
                <span key={s.title} className={`h-[3px] flex-1 transition-colors duration-500 ${i <= k ? "bg-orange" : "bg-white/12"}`} />
              ))}
            </div>
            <p key={k} className="env-slide mt-5 font-mono text-[12px] uppercase tracking-[0.14em] text-orange">{jointStates[k].title}</p>
            <p key={`t${k}`} className="env-slide mt-3 font-body text-[15px] leading-[1.6] text-white/65">{jointStates[k].text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
