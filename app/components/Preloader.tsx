"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Прелоадер — оригинальный брендовый ролик 1 в 1:
// public/preloader.mp4 = склейка preloader/1.mp4 (+ → печать STRUKTURA⁺)
// и 2.mp4 (пересборка в вертикальный логотип), 5.3 c, 47 КБ, без звука.
// После ролика оверлей тает, элементы первого экрана высвечиваются
// (снимается пауза rise-in). Показывается раз за сессию, клик — пропустить.

const FLAG = "stk-preloaded";
const BG = "#fdfdfd"; // точный фон ролика — стык с object-contain невидим

function release() {
  try {
    sessionStorage.setItem(FLAG, "1");
  } catch {}
  document.documentElement.classList.remove("preloading");
}

export default function Preloader() {
  const [phase, setPhase] = useState<"play" | "exit" | "done">("play");
  const videoRef = useRef<HTMLVideoElement>(null);
  const timers = useRef<number[]>([]);

  const finish = () => {
    release();
    setPhase("exit");
    timers.current.push(window.setTimeout(() => setPhase("done"), 600));
  };

  useEffect(() => {
    try {
      if (sessionStorage.getItem(FLAG)) {
        document.documentElement.classList.remove("preloading");
        setPhase("done");
        return;
      }
    } catch {}

    // отмечаем показ сразу: уход со страницы до конца ролика — тоже показ
    try {
      sessionStorage.setItem(FLAG, "1");
    } catch {}

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // без движения: ролик не играем, сразу открываем сайт
      finish();
      return;
    }

    // страховка: если видео не загрузилось/не запустилось — не держим людей
    timers.current.push(window.setTimeout(finish, 8000));

    const v = videoRef.current;
    v?.play().catch(finish);

    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "done") return null;

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          key="preloader"
          id="stk-preloader"
          onClick={finish}
          className="fixed inset-0 z-[999] cursor-pointer select-none"
          style={{ background: BG }}
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
          <video
            ref={videoRef}
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/preloader.mp4`}
            className="h-full w-full object-contain"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={finish}
            onError={finish}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
