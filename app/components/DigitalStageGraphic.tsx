"use client";

/* ── per-stage brand graphic (abstract, our visual language) ── */
export default function DigitalStageGraphic({ index }: { index: number }) {
  const O = "#ff5a00";
  const W = "rgba(255,255,255,0.55)";
  const D = "rgba(255,255,255,0.22)";
  const common = {
    viewBox: "0 0 220 180",
    fill: "none" as const,
    className: "stk-svg",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (index) {
    case 0: // Предпроект — концепт-рамка, ограничения
      return (
        <svg {...common}>
          <rect x="34" y="30" width="152" height="120" stroke={D} strokeWidth="1" strokeDasharray="4 5" />
          <path d="M34 30 L186 150" stroke={D} strokeWidth="1" />
          <path d="M34 46 L34 30 L50 30" stroke={W} strokeWidth="1.5" />
          <path d="M170 150 L186 150 L186 134" stroke={W} strokeWidth="1.5" />
          <rect x="96" y="76" width="28" height="28" stroke={O} strokeWidth="1.5" transform="rotate(45 110 90)" />
          <circle cx="110" cy="90" r="3" fill={O} />
        </svg>
      );
    case 1: // R&D — параметрическая сеть узлов
      return (
        <svg {...common}>
          {[[46, 58], [110, 38], [176, 66], [70, 120], [140, 128]].map((p, i) => (
            <line key={i} x1={p[0]} y1={p[1]} x2={110} y2={90} stroke={D} strokeWidth="1" />
          ))}
          <line x1="46" y1="58" x2="176" y2="66" stroke={D} strokeWidth="1" />
          <line x1="70" y1="120" x2="140" y2="128" stroke={D} strokeWidth="1" />
          {[[46, 58], [110, 38], [176, 66], [70, 120], [140, 128]].map((p, i) => (
            <rect key={`n${i}`} x={p[0] - 5} y={p[1] - 5} width="10" height="10" stroke={W} strokeWidth="1.4" transform={`rotate(45 ${p[0]} ${p[1]})`} />
          ))}
          <rect x="102" y="82" width="16" height="16" fill={O} transform="rotate(45 110 90)" />
        </svg>
      );
    case 2: // Проектирование — слои чертежей + размерная линия
      return (
        <svg {...common}>
          <rect x="52" y="44" width="120" height="86" stroke={D} strokeWidth="1" />
          <rect x="44" y="52" width="120" height="86" stroke={D} strokeWidth="1" />
          <rect x="36" y="60" width="120" height="86" stroke={W} strokeWidth="1.5" />
          <line x1="36" y1="60" x2="156" y2="60" stroke={O} strokeWidth="1.5" />
          <line x1="36" y1="146" x2="156" y2="146" stroke={O} strokeWidth="1.5" strokeDasharray="3 4" />
          <path d="M180 60 L180 146 M176 66 L180 60 L184 66 M176 140 L180 146 L184 140" stroke={O} strokeWidth="1.2" />
          <circle cx="96" cy="103" r="10" stroke={W} strokeWidth="1.2" />
        </svg>
      );
    case 3: // Производство — ЧПУ-траектория и «голова»
      return (
        <svg {...common}>
          <rect x="40" y="34" width="140" height="112" stroke={D} strokeWidth="1" />
          <path
            d="M56 50 H164 M164 50 V72 M164 72 H56 M56 72 V94 M56 94 H164 M164 94 V116 M164 116 H56 M56 116 V132"
            stroke={W}
            strokeWidth="1.4"
          />
          <rect x="96" y="86" width="16" height="16" fill={O} />
          <path d="M104 78 V86 M104 102 V110" stroke={O} strokeWidth="1.4" />
        </svg>
      );
    case 4: // Логистика — маршрут с точками и стрелкой
      return (
        <svg {...common}>
          <path d="M34 132 C 70 132, 74 60, 110 60 S 150 120, 186 60" stroke={W} strokeWidth="1.5" strokeDasharray="5 6" />
          {[[34, 132], [110, 60], [186, 60]].map((p, i) => (
            <rect key={i} x={p[0] - 5} y={p[1] - 5} width="10" height="10" stroke={O} strokeWidth="1.5" transform={`rotate(45 ${p[0]} ${p[1]})`} />
          ))}
          <path d="M178 52 L186 60 L178 68" stroke={O} strokeWidth="1.5" />
          <rect x="96" y="112" width="26" height="20" stroke={D} strokeWidth="1.2" />
          <path d="M96 118 H122" stroke={D} strokeWidth="1.2" />
        </svg>
      );
    default: // Монтаж — сборочная сетка фасада
      return (
        <svg {...common}>
          {Array.from({ length: 3 }).map((_, r) =>
            Array.from({ length: 4 }).map((__, c) => (
              <rect
                key={`${r}-${c}`}
                x={44 + c * 34}
                y={40 + r * 34}
                width="30"
                height="30"
                stroke={D}
                strokeWidth="1"
              />
            ))
          )}
          <rect x="78" y="74" width="30" height="30" stroke={O} strokeWidth="1.6" fill="rgba(255,90,0,0.12)" />
          <rect x="112" y="74" width="30" height="30" stroke={O} strokeWidth="1.6" fill="rgba(255,90,0,0.12)" />
          <path d="M150 89 H128 M134 83 L128 89 L134 95" stroke={O} strokeWidth="1.4" />
        </svg>
      );
  }
}
