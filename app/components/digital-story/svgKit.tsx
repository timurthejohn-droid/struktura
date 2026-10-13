import { CORE_LAYERS } from "../digital/coreStoryData";

// Визуальный язык 3D-схемы в SVG: стеклянное ядро, светящиеся кольца слоёв,
// оранжевый хребет, ромбы участников и бегущие точки данных.
// Все иллюстрации страницы собираются из этих элементов — чтобы они выглядели одним целым со схемой.

export const LAYER = CORE_LAYERS.map((l) => l.color);
export const ORANGE = "#ff5a00";
export const GREEN = "#40cfae";

export function GlowDefs({ id }: { id: string }) {
  return (
    <defs>
      <filter id={`${id}-glow`} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="2.4" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id={`${id}-halo`} x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
      {/* стекло: прозрачный центр и светлый край — как френель в 3D */}
      <radialGradient id={`${id}-glass`} cx="50%" cy="50%" r="50%">
        <stop offset="0.6" stopColor="#dfe9ff" stopOpacity="0.015" />
        <stop offset="0.9" stopColor="#dfe9ff" stopOpacity="0.12" />
        <stop offset="1" stopColor="#dfe9ff" stopOpacity="0.42" />
      </radialGradient>
      <radialGradient id={`${id}-warm`} cx="50%" cy="58%" r="55%">
        <stop offset="0" stopColor={ORANGE} stopOpacity="0.28" />
        <stop offset="1" stopColor={ORANGE} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-pearl`} cx="42%" cy="36%" r="70%">
        <stop offset="0" stopColor="#fbf8f2" />
        <stop offset="0.62" stopColor="#efe6dc" />
        <stop offset="1" stopColor="#d9c3b0" />
      </radialGradient>
      <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={ORANGE} stopOpacity="0.28" />
        <stop offset="1" stopColor={ORANGE} stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}

/** Стеклянное ядро: тёплое свечение внутри, френелевский край, сетка широт, блик. */
export function GlassCore({ id, cx, cy, r, warm = 1 }: { id: string; cx: number; cy: number; r: number; warm?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy + r * 0.35} r={r * 1.1} fill={`url(#${id}-warm)`} opacity={warm} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-glass)`} stroke="rgba(223,233,255,0.45)" strokeWidth="0.8" />
      {[-0.55, 0, 0.55].map((k) => (
        <ellipse key={k} cx={cx} cy={cy + k * r} rx={r * Math.sqrt(1 - k * k)} ry={r * 0.13} fill="none" stroke="rgba(255,255,255,0.07)" />
      ))}
      {[0.35, 0.75].map((k) => (
        <ellipse key={k} cx={cx} cy={cy} rx={r * k} ry={r} fill="none" stroke="rgba(255,255,255,0.05)" />
      ))}
      <path
        d={`M${cx - r * 0.62} ${cy - r * 0.55} Q${cx - r * 0.35} ${cy - r * 0.86} ${cx + r * 0.05} ${cy - r * 0.9}`}
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  );
}

/** Стопка светящихся колец слоёв внутри ядра; count — сколько слоёв уже проявилось. */
export function LayerRings({ id, cx, cy, r, count = 6, spin = true }: { id: string; cx: number; cy: number; r: number; count?: number; spin?: boolean }) {
  const gap = r * 0.17;
  return (
    <g filter={`url(#${id}-glow)`}>
      {LAYER.slice(0, count).map((c, i) => {
        const y = cy + (i - 2.5) * gap;
        const rx = r * 0.8 * Math.sqrt(1 - Math.pow(((i - 2.5) * gap) / r, 2));
        return (
          <g key={c}>
            <ellipse cx={cx} cy={y} rx={rx} ry={rx * 0.16} fill="none" stroke={c} strokeOpacity="0.85" strokeWidth="1" />
            {spin &&
              [0, 1, 2].map((k) => (
                <circle key={k} r="1.8" fill={c}>
                  <animateMotion
                    dur={`${7 + i * 1.3}s`}
                    begin={`${-k * 2.4 - i}s`}
                    repeatCount="indefinite"
                    path={`M${cx - rx} ${y} A${rx} ${rx * 0.16} 0 1 ${i % 2} ${cx + rx} ${y} A${rx} ${rx * 0.16} 0 1 ${i % 2} ${cx - rx} ${y}`}
                  />
                </circle>
              ))}
          </g>
        );
      })}
    </g>
  );
}

/** Сетчатая форма — 3D-геометрия внутри ядра. */
export function WireForm({ cx, cy, r, opacity = 0.55 }: { cx: number; cy: number; r: number; opacity?: number }) {
  const h = r * 1.1;
  const rows = [-0.5, -0.3, -0.1, 0.1, 0.3, 0.5];
  return (
    <g stroke="#ece6da" strokeOpacity={opacity} fill="none" strokeWidth="0.7">
      {rows.map((k) => {
        const w = r * (0.5 + 0.08 * Math.cos(k * 4));
        return <ellipse key={k} cx={cx} cy={cy + k * h} rx={w} ry={w * 0.16} />;
      })}
      {[-0.9, -0.55, -0.18, 0.18, 0.55, 0.9].map((k) => (
        <path key={k} d={`M${cx + k * r * 0.5} ${cy - h * 0.5} Q${cx + k * r * 0.62} ${cy} ${cx + k * r * 0.5} ${cy + h * 0.5}`} />
      ))}
      {rows.map((k, i) =>
        [-0.7, 0, 0.7].map((u) => (
          <circle key={`${k}${u}`} cx={cx + u * r * 0.5} cy={cy + k * h + (i % 2 ? 2 : -2)} r="1.3" fill="#ece6da" fillOpacity={opacity} stroke="none" />
        )),
      )}
    </g>
  );
}

/** Хребет подсистемы: стойка, рёбра и узлы. */
export function Spine({ id, cx, cy, r, levels = 4 }: { id: string; cx: number; cy: number; r: number; levels?: number }) {
  const h = r * 0.82;
  const ys = Array.from({ length: levels }, (_, i) => cy - h + ((i + 0.5) * (2 * h)) / levels);
  return (
    <g filter={`url(#${id}-glow)`}>
      <line x1={cx} y1={cy - h} x2={cx} y2={cy + h} stroke={ORANGE} strokeWidth="3" />
      {ys.map((y) => {
        const w = r * 0.42;
        return (
          <g key={y}>
            <line x1={cx - w} y1={y} x2={cx + w} y2={y} stroke={ORANGE} strokeWidth="1.8" />
            <rect x={cx - w - 3} y={y - 3} width="6" height="6" fill="#ffd2b8" />
            <rect x={cx + w - 3} y={y - 3} width="6" height="6" fill="#ffd2b8" />
          </g>
        );
      })}
    </g>
  );
}

/** Ромб участника со свечением. */
export function Node({ id, x, y, c, s = 6 }: { id: string; x: number; y: number; c: string; s?: number }) {
  return (
    <g filter={`url(#${id}-glow)`}>
      <rect x={x - s} y={y - s} width={s * 2} height={s * 2} fill={c} transform={`rotate(45 ${x} ${y})`} />
    </g>
  );
}

/** Связь с бегущими точками: цвет — к участнику, белые — обратно. */
export function Link2({ id, d, c, dur = 3.4, back = true, opacity = 0.5 }: { id: string; d: string; c: string; dur?: number; back?: boolean; opacity?: number }) {
  return (
    <g>
      <path d={d} fill="none" stroke={c} strokeOpacity={opacity} strokeWidth="1" />
      <g filter={`url(#${id}-glow)`}>
        <circle r="2.6" fill={c}>
          <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={d} />
        </circle>
        {back && (
          <circle r="2" fill="#fff">
            <animateMotion dur={`${dur * 1.15}s`} repeatCount="indefinite" path={d} keyPoints="1;0" keyTimes="0;1" calcMode="linear" />
          </circle>
        )}
      </g>
    </g>
  );
}

/** Дуга от края ядра к точке — как связи в 3D. */
export function arc(cx: number, cy: number, r: number, x: number, y: number, lift = 30) {
  const dx = x - cx;
  const dy = y - cy;
  const l = Math.hypot(dx, dy) || 1;
  const sx = cx + (dx / l) * r;
  const sy = cy + (dy / l) * r;
  return `M${sx.toFixed(1)} ${sy.toFixed(1)} Q${((sx + x) / 2).toFixed(1)} ${((sy + y) / 2 - lift).toFixed(1)} ${x} ${y}`;
}

/** Подпись участника в стиле карточек 3D-схемы. */
export function Tag({ x, y, text, c, anchor = "middle" }: { x: number; y: number; text: string; c: string; anchor?: "start" | "middle" | "end" }) {
  const w = text.length * 6.4 + 22;
  const left = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  return (
    <g>
      <rect x={left} y={y - 11} width={w} height="22" fill="rgba(14,14,14,0.86)" stroke="rgba(255,255,255,0.14)" />
      <rect x={left} y={y - 11} width={w} height="2" fill={c} />
      <rect x={left + 8} y={y - 2} width="5" height="5" fill={c} />
      <text x={left + 18} y={y + 3.5} fill="#fff" className="ds-svg-label">
        {text}
      </text>
    </g>
  );
}
