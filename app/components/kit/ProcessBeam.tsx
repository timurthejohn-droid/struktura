// Поток процесса: узлы этапов соединены линией, по которой бесконечно
// пробегает оранжевый импульс. Прямая отсылка к «цифровой среде»: данные
// текут между этапами без потерь. Анимация — .beam-track в CSS.

const STAGES = ["Предпроект", "R&D", "Проектирование", "Производство", "Логистика", "Монтаж"];

export default function ProcessBeam() {
  return (
    <div className="relative overflow-x-auto no-scrollbar">
      {/* на узких экранах линия этапов не сжимается, а прокручивается вбок */}
      <div className="relative" style={{ minWidth: 560 }}>
      {/* линия с бегущим импульсом — по центру ряда узлов */}
      <div className="beam-track absolute left-0 right-0" style={{ top: 5 }} aria-hidden />

      <div className="relative grid" style={{ gridTemplateColumns: `repeat(${STAGES.length}, 1fr)` }}>
        {STAGES.map((s, i) => (
          <div key={s} className="flex flex-col items-center text-center px-1">
            <span
              style={{ width: 11, height: 11, background: "var(--coal)", border: "1px solid var(--orange)" }}
              aria-hidden
            />
            <span
              className="font-mono uppercase text-white/60 mt-4"
              style={{ fontSize: 10, letterSpacing: "0.08em", lineHeight: 1.3 }}
            >
              <span className="text-orange">{String(i + 1).padStart(2, "0")}</span> {s}
            </span>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
