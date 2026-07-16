"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";

// [LAB] Тизер раздела «Материалы» для главной страницы.
// Scroll-story: изометрический лист материала проходит четыре превращения —
// форма → масштаб → кинетика → акустика — и приводит к CTA в раздел /materials.
// Canvas + painter's algorithm, прогресс привязан к скроллу (scrub),
// внутри сцены живёт собственное время (кинетика, звук, дыхание поверхности).

const STAGES = [
  {
    n: "01",
    t: "Любая форма",
    d: "Плоскость, изгиб, двойная кривизна. Геометрию диктует проект, а не станок.",
  },
  {
    n: "02",
    t: "Любой масштаб",
    d: "От детали интерьера до фасада. Крупный формат — без потери точности.",
  },
  {
    n: "03",
    t: "Кинетика",
    d: "Материал может двигаться: кинетические фасады и трансформируемые поверхности.",
  },
  {
    n: "04",
    t: "Акустика",
    d: "Форма управляет звуком: отражение, рассеивание и фокусировка.",
  },
];

// границы глав по прогрессу пина
const CUTS = [0.1, 0.34, 0.56, 0.78];

const N = 13; // тайлов по стороне

// smoothstep-сегмент: 0 до a, 1 после b
const seg = (p: number, a: number, b: number) => {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const stageIndex = (p: number) => {
  if (p < CUTS[0]) return -1;
  if (p < CUTS[1]) return 0;
  if (p < CUTS[2]) return 1;
  if (p < CUTS[3]) return 2;
  return 3;
};

export default function MaterialsTeaser() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [idx, setIdx] = useState(-1);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const s = stageIndex(v);
    setIdx((prev) => (prev === s ? prev : s));
  });

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let W = 0;
    let H = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const cos30 = Math.cos(Math.PI / 6);

    // высота поверхности в точке (u,v ∈ -1..1), в долях span
    const heightAt = (
      u: number,
      v: number,
      curve: number,
      bowl: number,
      time: number
    ) =>
      curve * (0.3 * (u * u - v * v) + 0.1 * Math.sin(2 * u + 0.8) * Math.cos(1.6 * v)) +
      bowl * 0.24 * ((u * u + v * v) / 2 - 0.5) +
      0.016 * Math.sin(time * 0.8 + u * 2.3 + v * 3.1);

    const draw = (p: number, time: number) => {
      ctx.clearRect(0, 0, W, H);

      // --- параметры сцены из прогресса скролла ---
      const assembleT = seg(p, 0.0, 0.1);
      const curve = seg(p, 0.12, 0.28) - 0.8 * seg(p, 0.8, 0.9);
      const bowl = seg(p, 0.8, 0.9);
      const grow = seg(p, 0.36, 0.5);
      const kin = seg(p, 0.58, 0.66) - seg(p, 0.82, 0.9);
      const sound = seg(p, 0.82, 0.92);
      const dimA = seg(p, 0.38, 0.44) - seg(p, 0.54, 0.6);

      const scale = 0.52 + 0.1 * assembleT + 0.72 * grow - 0.5 * seg(p, 0.56, 0.66);
      const meters = 2 + 22 * grow;

      const mobile = W < 720;
      const cx = W * (mobile ? 0.5 : 0.56);
      const cy = H * (mobile ? 0.42 : 0.47);
      const span = Math.min(W, H) * (mobile ? 0.3 : 0.34) * scale;
      const hs = span; // масштаб высот

      const proj = (X: number, Z: number, Y: number) => ({
        x: cx + (X - Z) * cos30,
        y: cy + (X + Z) * 0.5 - Y,
      });

      // --- фоновая чертёжная сетка (изометрическая плоскость) ---
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      const G = 8;
      const ext = 1.65;
      for (let g = 0; g <= G; g++) {
        const c = (g / G) * 2 - 1;
        const a1 = proj(c * span * ext, -span * ext, 0);
        const a2 = proj(c * span * ext, span * ext, 0);
        ctx.beginPath();
        ctx.moveTo(a1.x, a1.y);
        ctx.lineTo(a2.x, a2.y);
        ctx.stroke();
        const b1 = proj(-span * ext, c * span * ext, 0);
        const b2 = proj(span * ext, c * span * ext, 0);
        ctx.beginPath();
        ctx.moveTo(b1.x, b1.y);
        ctx.lineTo(b2.x, b2.y);
        ctx.stroke();
      }

      // --- тайлы листа, задние — первыми (painter's algorithm) ---
      const cell = (2 / N) * span; // мировая сторона тайла
      const gap = 0.05; // зазор между панелями, в долях тайла

      for (let d = 0; d <= 2 * (N - 1); d++) {
        for (let i = 0; i < N; i++) {
          const j = d - i;
          if (j < 0 || j >= N) continue;

          // появление: волна от дальнего угла
          const ka = Math.min(
            1,
            Math.max(0, (assembleT * 1.45 - 0.4 * ((i + j) / (2 * N))) / 1)
          );
          if (ka <= 0.01) continue;
          const rise = (1 - ka) * 46;

          // кинетика: ламель качается вокруг оси вдоль u
          const th = kin * Math.sin(time * 2.2 + i * 0.9 + j * 0.5) * 0.85;
          const sinT = Math.sin(th);
          const cosT = Math.cos(th);
          const centerV = ((j + 0.5) / N) * 2 - 1;

          const pts: { x: number; y: number }[] = [];
          const corners = [
            [i, j],
            [i + 1, j],
            [i + 1, j + 1],
            [i, j + 1],
          ];
          let hAvg = 0;
          for (const [ci, cj] of corners) {
            const u = (ci / N) * 2 - 1;
            const vRaw = (cj / N) * 2 - 1;
            // сжимаем к центру тайла на величину зазора
            const uC = ((i + 0.5) / N) * 2 - 1;
            const uu = uC + (u - uC) * (1 - gap);
            const vv0 = centerV + (vRaw - centerV) * (1 - gap);
            // поворот ламели: смещение по v и подъём по высоте
            const dv = vv0 - centerV;
            const vv = centerV + dv * cosT;
            const h = heightAt(uu, vv0, curve, bowl, time);
            hAvg += h;
            const Y = h * hs + dv * span * sinT;
            const pt = proj(uu * span, vv * span, Y);
            pts.push({ x: pt.x, y: pt.y + rise });
          }
          hAvg /= 4;

          const depth = (i + j) / (2 * (N - 1)); // 0 — дальний, 1 — ближний
          const glint = Math.abs(sinT);

          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          ctx.lineTo(pts[1].x, pts[1].y);
          ctx.lineTo(pts[2].x, pts[2].y);
          ctx.lineTo(pts[3].x, pts[3].y);
          ctx.closePath();

          ctx.fillStyle = `rgba(255,90,0,${
            ka * (0.05 + 0.07 * depth + 0.1 * glint + 0.16 * Math.max(0, hAvg))
          })`;
          ctx.fill();
          ctx.strokeStyle = `rgba(255,122,46,${ka * (0.3 + 0.4 * depth)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // --- размерная линия и человек (глава «масштаб») ---
      if (dimA > 0.01) {
        const off = 1.22;
        const A = proj(off * span, -span, 0);
        const B = proj(off * span, span, 0);
        ctx.strokeStyle = `rgba(255,90,0,${dimA * 0.85})`;
        ctx.fillStyle = `rgba(255,90,0,${dimA * 0.95})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
        // выносные линии от углов листа
        const cA = proj(span, -span, 0);
        const cB = proj(span, span, 0);
        ctx.strokeStyle = `rgba(255,90,0,${dimA * 0.35})`;
        ctx.beginPath();
        ctx.moveTo(cA.x, cA.y);
        ctx.lineTo(A.x, A.y);
        ctx.moveTo(cB.x, cB.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
        // засечки на концах
        ctx.strokeStyle = `rgba(255,90,0,${dimA * 0.85})`;
        for (const P of [A, B]) {
          ctx.beginPath();
          ctx.moveTo(P.x - 4, P.y - 4);
          ctx.lineTo(P.x + 4, P.y + 4);
          ctx.stroke();
        }
        // подпись
        const mid = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
        ctx.font = `500 12px "CoFo Sans Mono", ui-monospace, monospace`;
        ctx.textAlign = "left";
        ctx.fillText(`${Math.round(meters)} М`, mid.x + 14, mid.y + 4);

        // человек 1.8 м — референс масштаба
        const pxPerMeter = (2 * span) / meters;
        const hh = 1.8 * pxPerMeter;
        const foot = proj(1.35 * span, 0.55 * span, 0);
        ctx.strokeStyle = `rgba(255,255,255,${dimA * 0.8})`;
        ctx.lineWidth = Math.max(1, hh * 0.045);
        const headR = hh * 0.13;
        // голова
        ctx.beginPath();
        ctx.arc(foot.x, foot.y - hh + headR, headR, 0, Math.PI * 2);
        ctx.stroke();
        // тело
        ctx.beginPath();
        ctx.moveTo(foot.x, foot.y - hh + headR * 2.2);
        ctx.lineTo(foot.x, foot.y - hh * 0.38);
        ctx.stroke();
        // ноги
        ctx.beginPath();
        ctx.moveTo(foot.x, foot.y - hh * 0.38);
        ctx.lineTo(foot.x - hh * 0.14, foot.y);
        ctx.moveTo(foot.x, foot.y - hh * 0.38);
        ctx.lineTo(foot.x + hh * 0.14, foot.y);
        ctx.stroke();
        // руки
        ctx.beginPath();
        ctx.moveTo(foot.x - hh * 0.16, foot.y - hh * 0.56);
        ctx.lineTo(foot.x + hh * 0.16, foot.y - hh * 0.56);
        ctx.stroke();
      }

      // --- звук: источник, фронты волны, отражённые кольца (глава «акустика») ---
      if (sound > 0.01) {
        const em = { x: cx, y: cy - span * 0.92 };
        // источник
        ctx.strokeStyle = `rgba(255,255,255,${sound * 0.9})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(em.x, em.y, 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(em.x - 11, em.y);
        ctx.lineTo(em.x + 11, em.y);
        ctx.moveTo(em.x, em.y - 11);
        ctx.lineTo(em.x, em.y + 11);
        ctx.strokeStyle = `rgba(255,255,255,${sound * 0.35})`;
        ctx.stroke();

        // нисходящие фронты
        const maxR = span * 0.95;
        for (let k = 0; k < 4; k++) {
          const rr = ((time * 55 + k * (maxR / 4)) % maxR) + 8;
          const a = sound * 0.55 * (1 - rr / maxR);
          if (a <= 0.02) continue;
          ctx.strokeStyle = `rgba(255,255,255,${a})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(em.x, em.y, rr, Math.PI * 0.22, Math.PI * 0.78);
          ctx.stroke();
        }

        // отражённые кольца, обнимающие поверхность
        for (let m = 0; m < 3; m++) {
          const rho = ((time * 0.4 + m / 3) % 1) * 1.05 + 0.04;
          const a = sound * 0.55 * (1 - rho);
          if (a <= 0.02) continue;
          ctx.strokeStyle = `rgba(255,90,0,${a})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          for (let s = 0; s <= 48; s++) {
            const ph = (s / 48) * Math.PI * 2;
            const u = rho * Math.cos(ph);
            const v = rho * Math.sin(ph);
            const h = heightAt(u, v, curve, bowl, time);
            const pt = proj(u * span, v * span, h * hs + 6);
            if (s === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
    };

    const loop = (ms: number) => {
      draw(scrollYProgress.get(), ms / 1000);
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced, scrollYProgress]);

  // ---------- reduced motion: статичная версия без пина ----------
  if (reduced) {
    return (
      <section style={{ background: "var(--coal)" }}>
        <div className="container-x py-24">
          <span className="eyebrow text-orange">Раздел · STRUKTURA+</span>
          <h2 className="text-white mt-6" style={{ fontSize: "clamp(40px, 6.6vw, 96px)", lineHeight: 0.96 }}>
            Материалы
          </h2>
          <p
            className="text-white/85 mt-5 max-w-3xl"
            style={{
              fontFamily: '"CoFo Sans Mono", monospace',
              fontWeight: 500,
              textTransform: "uppercase",
              fontSize: "clamp(18px, 2.2vw, 32px)",
              lineHeight: 1.12,
            }}
          >
            Подбираем решения под проект, <span className="text-orange">а не под возможности производства</span>
          </p>
          <div className="grid md:grid-cols-2 gap-px mt-14" style={{ background: "var(--line-dark)" }}>
            {STAGES.map((s) => (
              <div key={s.n} className="p-8" style={{ background: "var(--coal)" }}>
                <div className="font-mono text-orange" style={{ fontSize: 13 }}>{s.n}</div>
                <h3 className="text-white mt-3" style={{ fontSize: 22 }}>{s.t}</h3>
                <p className="font-body text-white/60 mt-3" style={{ fontSize: 15, lineHeight: 1.55 }}>{s.d}</p>
              </div>
            ))}
          </div>
          <Link href="/materials" className="btn btn-orange mt-12">
            Смотреть все материалы
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section style={{ background: "var(--coal)" }}>
      {/* Заголовок блока */}
      <div className="container-x pt-24 md:pt-36 pb-6 md:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow text-orange">Раздел · STRUKTURA+</span>
          <h2 className="text-white mt-6" style={{ fontSize: "clamp(44px, 7.4vw, 118px)", lineHeight: 0.96 }}>
            Материалы
          </h2>
          <p
            className="text-white/85 mt-6 max-w-4xl"
            style={{
              fontFamily: '"CoFo Sans Mono", monospace',
              fontWeight: 500,
              textTransform: "uppercase",
              fontSize: "clamp(20px, 2.6vw, 40px)",
              lineHeight: 1.12,
            }}
          >
            Подбираем решения под&nbsp;проект,{" "}
            <span className="text-orange">а&nbsp;не&nbsp;под возможности производства</span>
          </p>
        </motion.div>
      </div>

      {/* Pinned scroll-story: 4 главы превращений */}
      <div ref={wrapRef} style={{ height: "520vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

          {/* Подпись главы — слева снизу */}
          <div className="absolute left-0 bottom-0 w-full pointer-events-none">
            <div className="container-x pb-14 md:pb-20">
              <div className="max-w-md min-h-[150px]">
                <AnimatePresence mode="wait">
                  {idx === -1 ? (
                    <motion.p
                      key="intro"
                      className="font-mono text-white/40 uppercase"
                      style={{ fontSize: 12, letterSpacing: "0.16em" }}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      Лист материала · исходная форма
                    </motion.p>
                  ) : (
                    <motion.div
                      key={STAGES[idx].n}
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="flex items-baseline gap-4">
                        <span className="font-mono text-orange" style={{ fontSize: 14 }}>
                          {STAGES[idx].n}
                        </span>
                        <span
                          className="font-mono text-white/30 uppercase"
                          style={{ fontSize: 11, letterSpacing: "0.16em" }}
                        >
                          / 04
                        </span>
                      </div>
                      <h3 className="text-white mt-3" style={{ fontSize: "clamp(24px, 3vw, 40px)" }}>
                        {STAGES[idx].t}
                      </h3>
                      <p
                        className="font-body text-white/60 mt-4"
                        style={{ fontSize: "clamp(14px, 1.2vw, 17px)", lineHeight: 1.55 }}
                      >
                        {STAGES[idx].d}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Индикатор глав — справа */}
          <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center gap-3">
            {STAGES.map((s, i) => (
              <div key={s.n} className="flex items-center gap-3">
                <div
                  className="transition-all duration-500"
                  style={{
                    width: i === idx ? 22 : 10,
                    height: 1,
                    background: i === idx ? "var(--orange)" : "rgba(255,255,255,0.25)",
                  }}
                />
                <span
                  className="font-mono transition-colors duration-500"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    color: i === idx ? "var(--orange)" : "rgba(255,255,255,0.25)",
                  }}
                >
                  {s.n}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Финал: CTA в раздел */}
      <div className="container-x py-24 md:py-36">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="font-mono text-white/40 uppercase"
            style={{ fontSize: 11, letterSpacing: "0.18em" }}
          >
            Форма · Масштаб · Кинетика · Акустика — и&nbsp;это только четыре из&nbsp;девяти возможностей
          </p>
          <h3
            className="text-white mt-6"
            style={{ fontSize: "clamp(28px, 3.8vw, 56px)", lineHeight: 1.04 }}
          >
            Безграничные возможности. <span className="text-orange">Доказано проектами.</span>
          </h3>
          <p
            className="font-body text-white/60 mt-6 max-w-xl"
            style={{ fontSize: "clamp(15px, 1.3vw, 18px)", lineHeight: 1.55 }}
          >
            Металл, стекло, камень, композиты — карта инженерных возможностей
            с&nbsp;реальными кейсами: от&nbsp;Cloud Gate до&nbsp;Лахта Центра.
          </p>
          <div className="mt-10">
            <Link href="/materials" className="btn btn-orange">
              Смотреть все возможности
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
