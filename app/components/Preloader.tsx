"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Прелоадер по брендовым роликам (preloader/1.mp4 + 2.mp4):
// [1] оранжевый «+» вырастает в центре → из него по букве печатается STRUKTURA⁺
// [2] буквы с пружиной пересобираются в вертикальный логотип 3×3 (S T R / U K T / U R A)
// → оверлей растворяется, элементы первого экрана «высвечиваются» (rise-in снимается с паузы).
// Показывается один раз за сессию (sessionStorage), клик — пропустить.

const WORD = "STRUKTURA".split("");
// раскладка вертикального логотипа: буква → [ряд, колонка]
const GRID: [number, number][] = [
  [0, 0], [0, 1], [0, 2],
  [1, 0], [1, 1], [1, 2],
  [2, 0], [2, 1], [2, 2],
];

type Phase = "plus" | "type" | "grid" | "exit" | "done";

const FLAG = "stk-preloaded";

function release() {
  try {
    sessionStorage.setItem(FLAG, "1");
  } catch {}
  document.documentElement.classList.remove("preloading");
}

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>("plus");
  const [count, setCount] = useState(0); // сколько букв напечатано
  const [fs, setFs] = useState(44);
  const rootRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const started = useRef(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(FLAG)) {
        document.documentElement.classList.remove("preloading");
        setPhase("done");
        return;
      }
    } catch {}

    if (rootRef.current) setFs(parseFloat(getComputedStyle(rootRef.current).fontSize));

    const t = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const start = () => {
      if (started.current) return;
      started.current = true;

      if (reduced) {
        // без движения: готовый логотип, короткая пауза, выход
        setCount(WORD.length);
        setPhase("type");
        t(() => {
          release();
          setPhase("exit");
        }, 900);
        t(() => setPhase("done"), 1500);
        return;
      }

      t(() => setPhase("type"), 550);
      WORD.forEach((_, i) => t(() => setCount(i + 1), 620 + i * 95));
      t(() => setPhase("grid"), 2100);
      t(() => {
        release();
        setPhase("exit"); // hero начинает высвечиваться, пока оверлей тает
      }, 3400);
      t(() => setPhase("done"), 4000);
    };

    // ждём шрифт, чтобы буквы не мигали фолбэком; страховка по таймеру
    document.fonts?.ready.then(start);
    const fallback = window.setTimeout(start, 1200);
    timers.current.push(fallback);

    return () => timers.current.forEach(clearTimeout);
  }, []);

  const skip = () => {
    timers.current.forEach(clearTimeout);
    release();
    setPhase("exit");
    timers.current.push(window.setTimeout(() => setPhase("done"), 450));
  };

  if (phase === "done") return null;

  // геометрия (в px от измеренного font-size)
  const H = 0.92 * fs; // шаг букв в строке
  const G = 1.18 * fs; // шаг колонок в логотипе
  const L = 1.14 * fs; // шаг рядов в логотипе
  const w = 0.72 * fs; // бокс буквы
  const grid = phase === "grid" || phase === "exit";

  const letterPos = (i: number): { x: number; y: number } => {
    if (grid) {
      const [row, col] = GRID[i];
      return { x: (col - 1) * G, y: (row - 1) * L };
    }
    const k = Math.max(count, 1);
    return { x: (i - (k - 1) / 2) * H, y: 0 };
  };

  const plusPos = (): { x: number; y: number } => {
    if (phase === "plus") return { x: 0, y: 0 };
    if (grid) return { x: G + 0.72 * fs, y: -L - 0.34 * fs };
    const k = Math.max(count, 1);
    return { x: ((k - 1) / 2) * H + 0.82 * fs, y: -0.3 * fs };
  };

  const pp = plusPos();

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          key="preloader"
          id="stk-preloader"
          onClick={skip}
          className="fixed inset-0 z-[999] flex items-center justify-center cursor-pointer select-none"
          style={{ background: "var(--paper)" }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
          aria-label="Загрузка STRUKTURA — нажмите, чтобы пропустить"
        >
          {/* мгновенный пропуск до гидрации, если прелоадер уже показывали в этой сессии */}
          <script
            dangerouslySetInnerHTML={{
              __html:
                "try{if(sessionStorage.getItem('stk-preloaded')){var e=document.getElementById('stk-preloader');if(e)e.style.display='none';document.documentElement.classList.remove('preloading');}}catch(e){}",
            }}
          />
          <div
            ref={rootRef}
            className="relative font-mono font-medium text-orange"
            style={{ fontSize: "clamp(30px, 4.6vw, 54px)", lineHeight: 1 }}
          >
            {/* «+» — из него всё рождается */}
            <motion.span
              className="absolute flex items-center justify-center"
              style={{ left: "50%", top: "50%", width: w, height: fs, fontSize: "0.66em" }}
              initial={{ opacity: 0, scale: 0.2, x: -w / 2, y: -fs / 2 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: pp.x - w / 2,
                y: pp.y - fs / 2,
              }}
              transition={{ type: "spring", duration: 0.65, bounce: phase === "grid" ? 0.3 : 0.15 }}
            >
              +
            </motion.span>

            {/* буквы */}
            {WORD.map((ch, i) => {
              const p = letterPos(i);
              const visible = i < count;
              return (
                <motion.span
                  key={i}
                  className="absolute flex items-center justify-center"
                  style={{ left: "50%", top: "50%", width: w, height: fs }}
                  initial={false}
                  animate={{
                    opacity: visible ? 1 : 0,
                    scale: visible ? 1 : 0.35,
                    x: p.x - w / 2,
                    y: p.y - fs / 2,
                  }}
                  transition={
                    grid
                      ? { type: "spring", duration: 0.72, bounce: 0.32, delay: i * 0.045 }
                      : { type: "spring", stiffness: 320, damping: 30 }
                  }
                >
                  {ch}
                </motion.span>
              );
            })}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
