"use client";
import { useEffect, useRef, useState } from "react";

const FRAMES = 31;
const FRAME_INDICES = Array.from({ length: FRAMES }, (_, i) => i * 5);

function padded(n: number) {
  return String(n).padStart(4, "0");
}

const cases = [
  { name: "Сбербанк-Сити", type: "Штаб-квартира", year: "2023" },
  { name: "Лахта Центр", type: "Небоскрёб, арка главного входа", year: "2022" },
  { name: "Музей Московского Кремля", type: "Стеклянный пол подземного музея", year: "2020" },
  { name: "Москва-Сити", type: "Монументальные художественные панно", year: "2021" },
];

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<boolean[]>(Array(FRAMES).fill(false));
  const currentFrameRef = useRef(0);
  const [caseIdx, setCaseIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Preload all frames
  useEffect(() => {
    let loadedCount = 0;
    FRAME_INDICES.forEach((fi, i) => {
      const img = new window.Image();
      img.src = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/cone/frame_${padded(fi)}.jpg`;
      img.onload = () => {
        loadedRef.current[i] = true;
        loadedCount++;
        if (loadedCount === FRAMES) setLoaded(true);
      };
      imagesRef.current[i] = img;
    });
  }, []);

  // Draw frame to canvas
  const drawFrame = (frameIdx: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[frameIdx];
    if (!canvas || !img || !img.complete) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Center-crop to canvas size
    const size = Math.min(canvas.width, canvas.height) * 1.15;
    const x = (canvas.width - size) / 2;
    const y = (canvas.height - size) / 2 + 20;
    ctx.drawImage(img, x, y, size, size);
  };

  // Scroll handler
  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const { top, height } = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -top / (height - window.innerHeight)));
      const frameIdx = Math.min(FRAMES - 1, Math.floor(progress * FRAMES));

      if (frameIdx !== currentFrameRef.current) {
        currentFrameRef.current = frameIdx;
        drawFrame(frameIdx);
      }

      // Change hero case based on scroll progress
      const caseProgress = Math.floor(progress * 4);
      setCaseIdx(Math.min(3, caseProgress));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Resize canvas + redraw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(currentFrameRef.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Draw on load
  useEffect(() => {
    if (loaded) drawFrame(0);
  }, [loaded]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "500vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* Canvas background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.55, mixBlendMode: "lighten" }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(33,33,33,0.3) 0%, rgba(33,33,33,0.1) 40%, rgba(33,33,33,0.7) 100%)",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col h-full px-6 md:px-16 pt-28">
          {/* H1 */}
          <div className="flex-1 flex flex-col justify-center max-w-[900px]">
            <p className="section-label mb-6">01 — ГЛАВНАЯ</p>
            <h1
              className="font-mono text-white leading-none mb-8"
              style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
            >
              РАЗРАБОТЧИК И ИНТЕГРАТОР{" "}
              <span className="text-accent">УНИКАЛЬНЫХ</span>{" "}
              АРХИТЕКТУРНЫХ РЕШЕНИЙ
            </h1>
            <p
              className="font-body text-white/70 max-w-xl leading-relaxed mb-12"
              style={{ fontSize: "clamp(15px, 1.2vw, 18px)" }}
            >
              Объединяем проектирование, производство и монтаж в&nbsp;единую
              систему реализации сложных проектов
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                className="px-8 py-4 bg-accent text-white font-mono text-xs tracking-[0.12em] uppercase hover:bg-accent-dark transition-colors"
              >
                Обсудить проект
              </a>
              <a
                href="/projects"
                className="px-8 py-4 border border-white/30 text-white font-mono text-xs tracking-[0.12em] uppercase hover:border-white/70 transition-colors"
              >
                Все проекты
              </a>
            </div>
          </div>

          {/* Current case overlay */}
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="section-number mb-1">
                {String(caseIdx + 1).padStart(2, "0")} / {String(cases.length).padStart(2, "0")}
              </p>
              <h3
                className="font-mono text-white leading-none"
                style={{ fontSize: "clamp(18px, 2vw, 28px)" }}
              >
                {cases[caseIdx].name}
              </h3>
              <p className="font-body text-white/50 text-sm mt-1">
                {cases[caseIdx].type} · {cases[caseIdx].year}
              </p>
            </div>

            {/* Case dots */}
            <div className="flex gap-2">
              {cases.map((_, i) => (
                <span
                  key={i}
                  className="block w-6 h-px"
                  style={{
                    background: i === caseIdx ? "#FF5A00" : "rgba(255,255,255,0.3)",
                    height: i === caseIdx ? "2px" : "1px",
                    transition: "background-color 0.3s ease, height 0.3s ease",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 hidden md:flex">
            <span
              className="font-mono text-[9px] tracking-[0.2em] text-white/40 uppercase"
              style={{ writingMode: "vertical-rl" }}
            >
              Scroll
            </span>
            <div
              className="w-px bg-white/20"
              style={{ height: "80px" }}
            >
              <div
                className="w-full bg-accent"
                style={{ height: "30px", animation: "scrollLine 1.5s ease-in-out infinite" }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollLine {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(50px); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
