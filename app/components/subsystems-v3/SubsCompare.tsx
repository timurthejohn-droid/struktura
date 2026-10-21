"use client";
import { useInView } from "./hooks";
import { cubic } from "./illustrations";

// Одна и та же внешняя форма — два устройства конструкции.
const shell = cubic([50, 140], [150, 30], [380, 30], [520, 152]);
const shellPath = shell.d;
// Точки крепления лежат на оболочке (+4 — половина толщины линии оболочки)
const PTS: [number, number][] = [70, 122, 176, 232, 288, 344, 400, 452, 498].map((x) => [x, shell.y(x) + 4]);

function Draw({ d, delay, stroke, width = 2, dash = false }: { d: string; delay: number; stroke: string; width?: number; dash?: boolean }) {
  return (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="cmp-draw"
      style={{ animationDelay: `${delay}s`, strokeDasharray: dash ? undefined : 1 }}
    />
  );
}

function Scheme({ integrated }: { integrated: boolean }) {
  const c = integrated ? "#ff5a00" : "#8a8479";
  return (
    <svg viewBox="0 0 570 300" className="h-auto w-full" role="img"
      aria-label={integrated ? "Подсистема STRUKTURA: несущая работа, геометрия и регулировки в одной системе" : "Раздельный подход: силовой каркас и отдельные элементы позиционирования"}>
      <defs>
        <pattern id={`hatch-${integrated}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V8" stroke="#bdb8ad" strokeWidth="1.2" />
        </pattern>
      </defs>
      <rect x="30" y="252" width="510" height="16" fill={`url(#hatch-${integrated})`} />
      <path d="M30 252H540" stroke="#8d8a83" strokeWidth="1.5" />

      <Draw d={shellPath} delay={0} stroke="#1a1a1a" width={7} />

      {integrated ? (
        <>
          {/* Ребро повторяет форму, узлы с регулировкой сразу под облицовкой */}
          <Draw d={`M${PTS.map(([x, y]) => `${x} ${y + 30}`).join(" L")}`} delay={0.5} stroke={c} width={5} />
          {PTS.map(([x, y], i) => (
            <g key={x}>
              <Draw d={`M${x} ${y + 30} L${x} ${y}`} delay={0.8 + i * 0.05} stroke={c} width={3} />
              <circle cx={x} cy={y + 30} r="5" fill="#fff" stroke={c} strokeWidth="2" className="cmp-pop" style={{ animationDelay: `${1 + i * 0.05}s` }} />
              <path d={`M${x + 10} ${y + 10}v16 M${x + 7} ${y + 13}l3 -3 3 3 M${x + 7} ${y + 23}l3 3 3 -3`} stroke={c} strokeWidth="1.2" fill="none" className="cmp-pop" style={{ animationDelay: `${1.2 + i * 0.05}s` }} />
              {i % 4 === 0 && <Draw d={`M${x} ${y + 30} V252`} delay={0.6} stroke="#55534f" width={4} />}
            </g>
          ))}
        </>
      ) : (
        <>
          {/* Прямой силовой каркас + «лестница» доборных элементов до оболочки */}
          <Draw d="M60 196 H510" delay={0.4} stroke="#55534f" width={8} />
          {[90, 290, 490].map((x) => (
            <Draw key={x} d={`M${x} 196 V252`} delay={0.5} stroke="#55534f" width={8} />
          ))}
          {PTS.map(([x, y], i) => {
            const bx = x + (i % 2 ? 9 : -9);
            const mid = (y + 196) / 2 + (i % 2 ? 8 : -6);
            return (
              <g key={x}>
                <Draw d={`M${bx} 196 V${mid} H${x} V${y + 7}`} delay={0.8 + i * 0.06} stroke={c} width={3} />
                <rect x={bx - 6} y={mid - 5} width="12" height="10" fill="#fff" stroke={c} strokeWidth="1.5" className="cmp-pop" style={{ animationDelay: `${1.2 + i * 0.06}s` }} />
                <rect x={x - 5} y={y} width="10" height="7" fill="#fff" stroke={c} strokeWidth="1.5" className="cmp-pop" style={{ animationDelay: `${1.3 + i * 0.06}s` }} />
              </g>
            );
          })}
        </>
      )}
    </svg>
  );
}

const rows = [
  { k: "Уровни конструкции", a: "Каркас + доборные элементы", b: "Одна подсистема" },
  { k: "Положение облицовки", a: "Выводится доборными элементами", b: "Заложено в модели" },
  { k: "Сопряжения и допуски", a: "Увязываются между уровнями", b: "Разработаны совместно" },
];

export default function SubsCompare() {
  const [ref, seen] = useInView<HTMLDivElement>(0.3);
  return (
    <div ref={ref} className={`container-x py-20 md:py-28 ${seen ? "cmp-on" : ""}`}>
      <div className="grid gap-6 border-t border-black/10 pt-10 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
        <div>
          <span className="eyebrow text-orange">Два подхода к одной форме</span>
          <h3 className="mt-5 text-[clamp(24px,2.6vw,38px)] leading-[1.02] text-ink">Точность закладывается в устройство системы</h3>
        </div>
        <p className="font-body text-[clamp(15px,1.2vw,18px)] leading-[1.6] text-ink/60 md:pt-9">
          Внешняя архитектурная поверхность одна и та же. Отличается то, как организованы несущая
          работа, крепление и положение элементов.
        </p>
      </div>

      <div className="mt-12 grid gap-px border border-black/10 bg-black/10 md:grid-cols-2">
        {[false, true].map((integrated) => (
          <article key={String(integrated)} className={`relative bg-paper p-5 md:p-8 ${integrated ? "md:bg-white" : ""}`}>
            <div className="mb-6 flex items-center justify-between">
              <h4 className={`text-[14px] ${integrated ? "text-ink" : "text-ink/55"}`}>{integrated ? "Подсистема STRUKTURA" : "Раздельный подход"}</h4>
              <span className={`flex h-7 w-7 items-center justify-center font-mono text-[11px] ${integrated ? "bg-orange text-white" : "border border-black/15 text-ink/45"}`}>
                {integrated ? "B" : "A"}
              </span>
            </div>
            <Scheme integrated={integrated} />
            <dl className="mt-6 border-t border-black/10">
              {rows.map((r) => (
                <div key={r.k} className="grid grid-cols-[1fr_1.2fr] gap-4 border-b border-black/10 py-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">{r.k}</dt>
                  <dd className={`font-body text-[14px] ${integrated ? "text-ink" : "text-ink/55"}`}>{integrated ? r.b : r.a}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
      <p className="mt-6 bg-ink px-6 py-5 font-mono text-[12px] uppercase tracking-[0.12em] text-white md:text-[13px]">
        Силовая функция <span className="text-orange">+</span> точное позиционирование <span className="text-orange">+</span> регулировки — в одной инженерной системе
      </p>
    </div>
  );
}
