/**
 * Анимированные микроиллюстрации страницы подсистем (чистый SVG + CSS-петли из subs.css).
 * Единый язык: тонкие линии, оранжевый акцент, моно-подписи.
 */
const O = "#ff5a00";
const mono = "CoFo Sans Mono, monospace";

type P = { dark?: boolean };
const ink = (dark?: boolean) => (dark ? "rgba(255,255,255,0.55)" : "rgba(26,26,26,0.55)");
const faint = (dark?: boolean) => (dark ? "rgba(255,255,255,0.14)" : "rgba(26,26,26,0.12)");

type Pt = [number, number];

/** Кубическая кривая Безье: точка и угол касательной по координате x (x монотонен по t). */
export function cubic(p0: Pt, p1: Pt, p2: Pt, p3: Pt) {
  const at = (t: number) => {
    const u = 1 - t;
    const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
    return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]] as Pt;
  };
  const tAt = (x: number) => {
    let lo = 0, hi = 1;
    for (let i = 0; i < 40; i++) {
      const m = (lo + hi) / 2;
      if (at(m)[0] < x) lo = m; else hi = m;
    }
    return (lo + hi) / 2;
  };
  const y = (x: number) => at(tAt(x))[1];
  const angle = (x: number) => {
    const t = tAt(x);
    const [ax, ay] = at(Math.max(0, t - 0.001));
    const [bx, by] = at(Math.min(1, t + 0.001));
    return (Math.atan2(by - ay, bx - ax) * 180) / Math.PI;
  };
  const d = `M${p0[0]} ${p0[1]} C ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`;
  return { y, angle, d };
}

/** Псевдо-QR метка, детерминированная по seed. */
export function Tag({ x, y, size = 30, seed = 7, color = O }: { x: number; y: number; size?: number; seed?: number; color?: string }) {
  const n = 7;
  const c = size / n;
  const cells: [number, number][] = [];
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      const corner = (i < 2 && j < 2) || (i < 2 && j > 4) || (i > 4 && j < 2);
      const v = Math.sin((i * 7 + j * 13 + seed) * 12.9898) * 43758.5453;
      if (corner || v - Math.floor(v) > 0.52) cells.push([i, j]);
    }
  return (
    <g>
      {cells.map(([i, j]) => (
        <rect key={`${i}-${j}`} x={x + i * c} y={y + j * c} width={c * 0.9} height={c * 0.9} fill={color} />
      ))}
    </g>
  );
}

export function IlluModel({ dark }: P) {
  const lines = Array.from({ length: 9 }, (_, i) => i);
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full">
      {lines.map((i) => (
        <path key={`u${i}`} d={`M${20 + i * 20} ${118 - Math.sin((i / 8) * Math.PI) * 10} Q ${30 + i * 18} ${70 - Math.sin((i / 8) * Math.PI) * 36} ${40 + i * 16} ${40 - Math.sin((i / 8) * Math.PI) * 18}`} stroke={faint(dark)} fill="none" />
      ))}
      {[0, 1, 2, 3, 4].map((k) => (
        <path key={`v${k}`} d={`M20 ${118 - k * 19} C 70 ${70 - k * 18} 130 ${66 - k * 14} 180 ${110 - k * 17}`} stroke={ink(dark)} strokeWidth=".9" fill="none" />
      ))}
      <g className="sv3-float">
        <circle cx="112" cy="58" r="5" fill={O} />
        <circle cx="112" cy="58" r="11" fill="none" stroke={O} className="sv3-blink" />
      </g>
      <text x="122" y="40" fontFamily={mono} fontSize="8" fill={O}>N-07</text>
    </svg>
  );
}

export function IlluData({ dark }: P) {
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full">
      <rect x="20" y="16" width="160" height="108" fill="none" stroke={faint(dark)} />
      {Array.from({ length: 8 }, (_, r) => (
        <g key={r}>
          <rect x="28" y={26 + r * 12} width={22} height="4" fill={ink(dark)} opacity=".6" />
          <rect x="58" y={26 + r * 12} width={30 + ((r * 37) % 50)} height="4" fill={ink(dark)} opacity=".35" />
          <rect x="150" y={26 + r * 12} width={20} height="4" fill={r === 3 ? O : ink(dark)} opacity={r === 3 ? 1 : 0.35} />
        </g>
      ))}
      <g className="sv3-scan">
        <rect x="0" y="16" width="2" height="108" fill={O} />
        <rect x="-30" y="16" width="30" height="108" fill={O} opacity=".08" />
      </g>
      <text x="28" y="12" fontFamily={mono} fontSize="7" fill={ink(dark)}>CAM · G-CODE</text>
    </svg>
  );
}

export function IlluMarking({ dark }: P) {
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full">
      <path d="M30 104 L60 40 H170 L150 104 Z" fill="none" stroke={ink(dark)} strokeWidth="1.2" />
      <path d="M60 40 L66 30 H176 L170 40" fill="none" stroke={faint(dark)} />
      <g className="sv3-blink">
        <Tag x={86} y={55} size={34} seed={3} />
      </g>
      <text x="100" y="124" textAnchor="middle" fontFamily={mono} fontSize="8" fill={O}>S-024 / N-07</text>
    </svg>
  );
}

export function IlluLogistics({ dark }: P) {
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full">
      <path d="M10 112 H190" stroke={faint(dark)} />
      <path d="M20 40 C 70 10 130 70 180 30" fill="none" stroke={O} className="sv3-dash" />
      <circle cx="20" cy="40" r="3" fill={O} />
      <circle cx="180" cy="30" r="3" fill={O} />
      <g className="sv3-drive">
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={66 + i * 24} y={88} width="22" height="22" fill="none" stroke={ink(dark)} />
            <rect x={70 + i * 24} y={92} width="6" height="6" fill={i === 1 ? O : ink(dark)} />
          </g>
        ))}
        <rect x="78" y="64" width="22" height="22" fill="none" stroke={ink(dark)} />
        <rect x="82" y="68" width="6" height="6" fill={ink(dark)} />
      </g>
    </svg>
  );
}

const assemblyArc = cubic([20, 110], [60, 60], [140, 60], [180, 110]);

export function IlluAssembly({ dark }: P) {
  const xs = [40, 70, 100, 130, 160];
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full">
      <path d={assemblyArc.d} fill="none" stroke={faint(dark)} strokeWidth="10" />
      {xs.map((x, i) => {
        const y = assemblyArc.y(x);
        const seg = <rect x={x - 13} y={y - 4} width="26" height="8" fill={i === 2 ? O : ink(dark)} opacity={i === 2 ? 1 : 0.7} transform={`rotate(${assemblyArc.angle(x)} ${x} ${y})`} />;
        return i === 2 ? <g key={x} className="sv3-slot">{seg}</g> : <g key={x}>{seg}</g>;
      })}
      <g className="sv3-blink">
        <circle cx="168" cy="34" r="12" fill="none" stroke={O} />
        <path d="M162 34l4 4 8-9" stroke={O} strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
}

/** Адаптивность: одна форма — опоры перестраиваются под разные основания. */
const adaptArc = cubic([15, 70], [70, 10], [140, 10], [195, 70]);

export function IlluAdapt({ dark }: P) {
  const xs = [30, 60, 90, 120, 150, 180];
  return (
    <svg viewBox="0 0 210 160" className="h-full w-full">
      <path d={adaptArc.d} fill="none" stroke={dark ? "#fff" : "#1a1a1a"} strokeWidth="5" />
      {xs.map((x) => {
        const top = adaptArc.y(x) + 6;
        return (
          <g key={x}>
            <line x1={x} y1={top} x2={x} y2={136} stroke={O} strokeWidth="2.5">
              {x > 105 && <animate attributeName="y2" values="136;104;104;136;136" keyTimes="0;0.3;0.5;0.8;1" dur="4s" repeatCount="indefinite" />}
            </line>
            <rect x={x - 4} y={top - 3} width="8" height="6" fill={O} />
          </g>
        );
      })}
      <path d="M8 136 H105 V136 H202" stroke={ink(dark)} strokeWidth="4" fill="none">
        <animate
          attributeName="d"
          values="M8 136 H105 V136 H202;M8 136 H105 V104 H202;M8 136 H105 V104 H202;M8 136 H105 V136 H202;M8 136 H105 V136 H202"
          keyTimes="0;0.3;0.5;0.8;1"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
      <text x="10" y="154" fontFamily={mono} fontSize="8" fill={ink(dark)}>УСЛОВИЯ ОБЪЕКТА → ПАРАМЕТРЫ СИСТЕМЫ</text>
    </svg>
  );
}

/** Производство: фреза идёт по траектории, детали выходят серией. */
export function IlluProduction({ dark }: P) {
  return (
    <svg viewBox="0 0 210 160" className="h-full w-full">
      <path d="M20 110 C 60 80 120 130 190 96" stroke={O} strokeWidth="1.2" fill="none" className="sv3-dash" />
      <path d="M20 118 H190 V132 H20 Z" fill="none" stroke={ink(dark)} />
      <g className="sv3-drive">
        <rect x="96" y="40" width="16" height="44" fill="none" stroke={dark ? "#fff" : "#1a1a1a"} strokeWidth="1.5" />
        <rect x="101" y="84" width="6" height="18" fill={dark ? "#fff" : "#1a1a1a"} />
        <circle cx="104" cy="104" r="3" fill={O} className="sv3-blink" />
      </g>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={30 + i * 40} y="140" width="30" height="8" fill={i === 3 ? O : ink(dark)} opacity={i === 3 ? 1 : 0.5} />
      ))}
      <text x="20" y="22" fontFamily={mono} fontSize="8" fill={ink(dark)}>ИНДИВИДУАЛЬНО · СЕРИЙНО</text>
    </svg>
  );
}

/** Сборка: «папа–мама» — шип входит в паз, детали сходятся по линии стыка и меткам. */
export function IlluJoint({ dark }: P) {
  const line = dark ? "#fff" : "#1a1a1a";
  return (
    <svg viewBox="0 0 210 160" className="h-full w-full">
      <g className="sv3-join">
        <path d="M20 50 H105 V72 H127 V88 H105 V110 H20 Z" fill="none" stroke={line} strokeWidth="1.5" />
        <path d="M88 96 V104 M94 96 V104" stroke={O} strokeWidth="2" />
      </g>
      <path d="M190 50 H105 V70 H129 V90 H105 V110 H190 Z" fill="none" stroke={line} strokeWidth="1.5" />
      <path d="M116 96 V104 M122 96 V104" stroke={O} strokeWidth="2" />
      <path d="M105 30 V130" stroke={O} strokeDasharray="3 4" opacity=".7" />
      <text x="20" y="140" fontFamily={mono} fontSize="8" fill={ink(dark)}>N-07/A</text>
      <text x="190" y="140" textAnchor="end" fontFamily={mono} fontSize="8" fill={ink(dark)}>N-07/B</text>
    </svg>
  );
}

/** Надёжность: поле напряжений под нагрузкой. */
export function IlluStress({ dark }: P) {
  return (
    <svg viewBox="0 0 210 160" className="h-full w-full">
      <defs>
        <linearGradient id="sv3-fea" x1="0" x2="1">
          <stop stopColor="#1d4fa8" />
          <stop offset=".4" stopColor="#2fa39a" />
          <stop offset=".7" stopColor="#e8cc44" />
          <stop offset="1" stopColor="#d6411f" />
        </linearGradient>
      </defs>
      <path d="M20 120 C 70 40 140 40 190 120 L190 128 C 140 52 70 52 20 128 Z" fill="url(#sv3-fea)" className="sv3-blink" style={{ animationDuration: "3s" }} />
      {[50, 80, 105, 130, 160].map((x, i) => (
        <g key={x} className="sv3-float" style={{ animationDelay: `${i * 0.15}s` }}>
          <path d={`M${x} 18 V36 M${x - 4} 31 l4 5 4 -5`} stroke={dark ? "#fff" : "#1a1a1a"} strokeWidth="1.2" fill="none" />
        </g>
      ))}
      <path d="M20 128 v14 M190 128 v14" stroke={ink(dark)} />
      <text x="20" y="154" fontFamily={mono} fontSize="8" fill={ink(dark)}>РАСЧЁТ · MOCKUP · ИСПЫТАНИЕ</text>
    </svg>
  );
}
