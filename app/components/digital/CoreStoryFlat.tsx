"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import {
  CORE_CONCEPTS,
  CORE_KEYFRAMES,
  CORE_LAYERS,
  CORE_STATIONS,
  arrayAmount,
  chapterReset,
  coreStepAt,
  conceptAmount,
  feedbackAmount,
  finaleAmount,
  layerAmount,
  layerFill,
  layerPop,
  scanAmount,
  sm,
  stationAmount,
  subFocus,
} from "./coreStoryData";

/**
 * Плоская схема «Цифрового ядра» в стиле блока «Формула» на главной:
 * без свечения и 3D — шар из квадратных точек, тонкие линии, рамки-подписи моно-шрифтом.
 * Сюжет и тайминг сцен — те же, что в 3D-версии (coreStoryData), координаты — эскиз 1000 × 530.
 */

type Props = {
  progress: MotionValue<number>;
  reduced: boolean;
  active: boolean;
  selected: number | null;
};

const ORANGE = "255,90,0";
const WHITE = "255,255,255";
const SCAN = "108,196,234";
const GREEN = "64,207,174";
const MONO = "'CoFo Sans Mono', monospace";
const BODY = "'Onest', sans-serif";

const CX = 500;
const CY = 246;
const RS = 150; // радиус ядра в координатах эскиза
const RING_Y = CORE_LAYERS.map((_, i) => 184 + 24 * i);
const ringRx = (i: number) => Math.sqrt(Math.max(0, RS * RS - (RING_Y[i] - CY) ** 2)) * 1.06;
const RING_K = 0.17; // сплющенность колец

const N = 640;
const NODE_SHARE = 0.06;
const TILT = 0.32;

const hexRgb = (hex: string) => {
  const v = parseInt(hex.slice(1), 16);
  return `${(v >> 16) & 255},${(v >> 8) & 255},${v & 255}`;
};
const LAYER_RGB = CORE_LAYERS.map((l) => hexRgb(l.color));
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const frac = (v: number) => v - Math.floor(v);
const easeOut = (t: number) => 1 - (1 - clamp01(t)) ** 3;

type Dot = { x: number; y: number; z: number; node: boolean };
function fibonacci(n: number): Dot[] {
  const out: Dot[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    const h = Math.sin(i * 12.9898) * 43758.5453;
    out.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r, node: h - Math.floor(h) < NODE_SHARE });
  }
  return out;
}

export default function CoreStoryFlat({ progress, reduced, active, selected }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const live = useRef({ reduced, active, selected });
  live.current = { reduced, active, selected };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dots = fibonacci(N);
    const c = ctx as CanvasRenderingContext2D & { letterSpacing?: string };

    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();
    let time = 0;
    let angle = 0.8;
    let p = progress.get();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { reduced: red } = live.current;
      const raw = progress.get();
      const goal = red ? CORE_KEYFRAMES[coreStepAt(raw)] : raw;
      // плавно догоняем прокрутку — без скачков и мерцаний
      p += (goal - p) * (red ? 1 : 1 - Math.exp(-dt * 5));
      if (!red) {
        time += dt * (1 - 0.8 * finaleAmount(p));
        angle += dt * 0.16 * (1 - 0.8 * finaleAmount(p));
      }
      draw();
      raf = requestAnimationFrame(frame);
    };

    // ── отрисовка ──
    const draw = () => {
      const sel = live.current.selected;
      ctx.clearRect(0, 0, w, h);
      if (!w || !h) return;

      // область схемы: справа от подписи на десктопе, сверху на мобильном
      const narrow = w < 768;
      const rx0 = narrow ? 8 : Math.max(w * 0.36, 420);
      const rx1 = narrow ? w - 8 : w - 24;
      const ry0 = narrow ? h * 0.15 : h * 0.17;
      const ry1 = narrow ? h * 0.56 : h - 64;
      const s = Math.min((rx1 - rx0) / 1000, (ry1 - ry0) / 560);
      const ox = (rx0 + rx1) / 2 - 500 * s;
      const oy = (ry0 + ry1) / 2 - 270 * s;
      const X = (x: number) => ox + x * s;
      const Y = (y: number) => oy + y * s;

      const finale = finaleAmount(p);
      const gather = easeOut(finale);
      const keep = 1 - 0.95 * finale;
      const reset = chapterReset(p);
      const ch2 = p >= 0.38;
      const focus = subFocus(p);
      const algo = arrayAmount(p);
      const scan = scanAmount(p);
      const fb = feedbackAmount(p);
      const fontK = narrow ? 0.85 : 1;

      // сетка-подложка, как на карточке IPD
      const step = 40;
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${WHITE},0.035)`;
      ctx.beginPath();
      for (let x = (X(CX) % step) - step; x < w; x += step) {
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, h);
      }
      for (let y = (Y(CY) % step) - step; y < h; y += step) {
        ctx.moveTo(0, Math.round(y) + 0.5);
        ctx.lineTo(w, Math.round(y) + 0.5);
      }
      ctx.stroke();
      const fade = ctx.createRadialGradient(X(CX), Y(CY), RS * s * 1.2, X(CX), Y(CY), Math.max(w, h) * 0.75);
      fade.addColorStop(0, "rgba(16,16,16,0)");
      fade.addColorStop(1, "rgba(16,16,16,1)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, w, h);

      const text = (str: string, x: number, y: number, size: number, color: string, font = MONO, align: CanvasTextAlign = "left", spacing = 0.12) => {
        ctx.font = `${size * fontK}px ${font}`;
        if ("letterSpacing" in c) c.letterSpacing = `${spacing * size * fontK}px`;
        ctx.textAlign = align;
        ctx.textBaseline = "middle";
        ctx.fillStyle = color;
        ctx.fillText(str, x, y);
        if ("letterSpacing" in c) c.letterSpacing = "0px";
      };
      const textW = (str: string, size: number, font = MONO, spacing = 0.12) => {
        ctx.font = `${size * fontK}px ${font}`;
        if ("letterSpacing" in c) c.letterSpacing = `${spacing * size * fontK}px`;
        const m = ctx.measureText(str).width;
        if ("letterSpacing" in c) c.letterSpacing = "0px";
        return m;
      };
      const square = (x: number, y: number, size: number, fill: string, stroke?: string) => {
        ctx.fillStyle = fill;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
        if (stroke) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = 1;
          ctx.strokeRect(Math.round(x - size / 2) + 0.5, Math.round(y - size / 2) + 0.5, Math.round(size) - 1, Math.round(size) - 1);
        }
      };
      const quad = (ax: number, ay: number, bx: number, by: number, cxp: number, cyp: number, t: number) => {
        const u = 1 - t;
        return [u * u * ax + 2 * u * t * cxp + t * t * bx, u * u * ay + 2 * u * t * cyp + t * t * by];
      };

      // орбиты — тонкий пунктир
      ctx.setLineDash([3, 6]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${WHITE},${0.14 * keep})`;
      ctx.beginPath();
      ctx.ellipse(X(CX), Y(CY + 14), RS * 2.55 * s, RS * 1.05 * s, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = `rgba(${WHITE},${0.08 * keep})`;
      ctx.beginPath();
      ctx.ellipse(X(CX), Y(CY + 14), RS * 1.85 * s, RS * 0.72 * s, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // «одна цифровая среда» — общий контур в конце первой главы
      const env = sm(0.26, 0.3, p) * (1 - sm(0.36, 0.38, p));
      if (env > 0.01) {
        ctx.setLineDash([6, 5]);
        ctx.strokeStyle = `rgba(${ORANGE},${0.55 * env})`;
        ctx.beginPath();
        ctx.ellipse(X(CX), Y(CY + 30), 410 * s, 228 * s, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        text("ОДНА ЦИФРОВАЯ СРЕДА", X(CX), Y(CY + 30 + 228) + 14, 10, `rgba(${ORANGE},${env})`, MONO, "center", 0.18);
      }

      // ── кольца-слои: задняя половина (за точками) ──
      const ringAlpha = (i: number) => {
        const base = (0.18 + 0.62 * layerFill(i, p)) * layerAmount(i, p) * keep;
        return sel === null ? base : sel === i ? Math.min(1, base * 1.6 + 0.2) : base * 0.25;
      };
      const ringColor = (i: number) => (ch2 ? LAYER_RGB[i] : WHITE);
      const drawRing = (i: number, front: boolean) => {
        const amt = layerAmount(i, p);
        if (amt < 0.01) return;
        const rx = ringRx(i) * s;
        const ry = rx * RING_K;
        // кольцо «дорисовывается» по мере появления слоя
        const a0 = front ? 0 : Math.PI;
        const span = Math.PI * amt;
        ctx.strokeStyle = `rgba(${ringColor(i)},${ringAlpha(i) * (front ? 1 : 0.55)})`;
        ctx.lineWidth = sel === i ? 2 : 1;
        ctx.beginPath();
        ctx.ellipse(X(CX), Y(RING_Y[i]), rx, ry, 0, a0, a0 + span);
        ctx.stroke();
      };
      CORE_LAYERS.forEach((_, i) => drawRing(i, false));

      // ── ядро: шар из квадратных точек ──
      const ca = Math.cos(angle);
      const sa = Math.sin(angle);
      const ct = Math.cos(TILT);
      const st = Math.sin(TILT);
      const R = RS * s;
      const dotK = (1 - 0.7 * focus) * (1 - 0.75 * finale);
      const bandY = Math.sin(time * 0.5) * 0.8; // правило пробегает по форме мягкой полосой
      const proj = dots.map((d) => {
        const x1 = d.x * ca + d.z * sa;
        const z1 = -d.x * sa + d.z * ca;
        const y2 = d.y * ct - z1 * st;
        const z2 = d.y * st + z1 * ct;
        return { x: X(CX) + x1 * R, y: Y(CY) + y2 * R, z: z2, node: d.node, ly: d.y };
      });
      proj.sort((a, b) => a.z - b.z);
      for (const q of proj) {
        const depth = (q.z + 1) / 2;
        const a = (0.1 + 0.8 * depth * depth) * dotK;
        if (a < 0.01) continue;
        const size = (q.node ? 2.6 : 1.6) * (0.6 + 0.6 * depth) * Math.max(0.7, s * 1.4);
        const inBand = algo > 0.01 && Math.abs(q.ly - bandY) < 0.08 ? algo : 0;
        if (q.node || inBand > 0.3) ctx.fillStyle = `rgba(${ORANGE},${Math.min(1, a + 0.1)})`;
        else ctx.fillStyle = `rgba(${WHITE},${a * 0.85})`;
        ctx.fillRect(q.x - size / 2, q.y - size / 2, size, size);
      }
      // контур ядра — тонкая окружность
      ctx.strokeStyle = `rgba(${WHITE},${0.16 * keep})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(X(CX), Y(CY), R + 6 * s, 0, Math.PI * 2);
      ctx.stroke();

      // ── подсистема: инженерный хребет внутри ядра ──
      const spine = Math.max(focus, ch2 ? 0.22 * sm(0.49, 0.53, p) : 0) * keep;
      if (spine > 0.01) {
        ctx.strokeStyle = `rgba(${ORANGE},${0.9 * spine})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(X(CX), Y(RING_Y[0] - 22));
        ctx.lineTo(X(CX), Y(RING_Y[5] + 22));
        ctx.stroke();
        ctx.lineWidth = 1;
        RING_Y.forEach((ry, i) => {
          const half = ringRx(i) * 0.72;
          ctx.strokeStyle = `rgba(${ORANGE},${0.75 * spine})`;
          ctx.beginPath();
          ctx.moveTo(X(CX - half), Y(ry));
          ctx.lineTo(X(CX + half), Y(ry));
          if (i < RING_Y.length - 1) {
            const nh = ringRx(i + 1) * 0.72;
            ctx.moveTo(X(CX - half), Y(ry));
            ctx.lineTo(X(CX - nh * 0.5), Y(RING_Y[i + 1]));
            ctx.moveTo(X(CX + half), Y(ry));
            ctx.lineTo(X(CX + nh * 0.5), Y(RING_Y[i + 1]));
          }
          ctx.stroke();
          for (const sx of [-half, half]) square(X(CX + sx), Y(ry), 5, `rgba(16,16,16,${spine})`, `rgba(${ORANGE},${spine})`);
        });
        if (focus > 0.05) text("ПОДСИСТЕМА · ИНЖЕНЕРНЫЙ ХРЕБЕТ", X(CX), Y(RING_Y[0] - 36), 10, `rgba(${ORANGE},${focus})`, MONO, "center", 0.16);
      }

      // ── обмеры: плоскость сканирования проходит ядро ──
      if (scan > 0.01) {
        const sy = CY + Math.sin(time * 0.9) * RS * 0.75;
        const half = Math.sqrt(Math.max(0, RS * RS - (sy - CY) ** 2)) * 1.1;
        ctx.strokeStyle = `rgba(${SCAN},${0.85 * scan})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(X(CX - half), Y(sy));
        ctx.lineTo(X(CX + half), Y(sy));
        ctx.stroke();
        square(X(CX - half), Y(sy), 5, `rgba(${SCAN},${scan})`);
        square(X(CX + half), Y(sy), 5, `rgba(${SCAN},${scan})`);
        text("ОБМЕРЫ → ОСНОВАНИЕ", X(CX + half) + 10, Y(sy), 10, `rgba(${SCAN},${scan})`);
      }

      // ── кольца: передняя половина ──
      CORE_LAYERS.forEach((_, i) => drawRing(i, true));
      // метки «+ слой», когда слой наполняется данными объекта
      CORE_LAYERS.forEach((l, i) => {
        const pop = Math.max(layerPop(i, p), sel === i ? 1 : 0) * keep;
        if (pop < 0.02) return;
        const x = X(CX + ringRx(i)) + 10;
        text(`+ ${l.name.toUpperCase()}`, x, Y(RING_Y[i]), 9.5, `rgba(${LAYER_RGB[i]},${pop})`);
      });

      // ── участники: узел, рамка с подписью, тонкая связь с ядром и бегущие метки ──
      const drawNode = (opts: {
        x: number;
        y: number;
        name: string;
        sub: string;
        layer: number;
        amt: number;
        dim: number;
        flowOut: number;
        flowBack: number;
        input?: boolean;
        seed: number;
      }) => {
        const { name, sub, layer, seed } = opts;
        const amt = opts.amt * opts.dim;
        if (amt < 0.01) return;
        // в финале участники собираются к ядру
        const x = opts.x + (CX - opts.x) * gather;
        const y = opts.y + (CY - opts.y) * gather;
        const left = x < CX - 40;
        const right = x > CX + 40;
        const tx = left ? CX - ringRx(layer) : right ? CX + ringRx(layer) : CX;
        const ty = left || right ? RING_Y[layer] : RING_Y[5] + ringRx(5) * RING_K;
        const cxp = (x + tx) / 2;
        const cyp = Math.min(y, ty) - 40;
        const col = ch2 ? LAYER_RGB[layer] : WHITE;

        // связь
        ctx.strokeStyle = `rgba(${WHITE},${0.32 * amt})`;
        ctx.lineWidth = 1;
        const draw = easeOut(opts.amt * 1.2);
        ctx.beginPath();
        for (let k = 0; k <= 32; k++) {
          const [px, py] = quad(x, y, tx, ty, cxp, cyp, (k / 32) * draw);
          if (k === 0) ctx.moveTo(X(px), Y(py));
          else ctx.lineTo(X(px), Y(py));
        }
        ctx.stroke();
        // бегущие метки: данные уходят в ядро и возвращаются
        if (opts.amt > 0.9 && !live.current.reduced) {
          for (let k = 0; k < 2; k++) {
            const u = frac(time * 0.22 + k * 0.5 + seed * 0.17);
            if (opts.flowOut > 0.02) {
              const [px, py] = quad(x, y, tx, ty, cxp, cyp, 1 - u);
              square(X(px), Y(py), 4, `rgba(${col},${0.95 * opts.flowOut * amt})`);
            }
            if (opts.flowBack > 0.02 && k === 0) {
              const [px, py] = quad(x, y, tx, ty, cxp, cyp, u);
              square(X(px), Y(py), 3.5, `rgba(${WHITE},${0.9 * opts.flowBack * amt})`);
            }
          }
        }
        // точка входа на кольце
        square(X(tx), Y(ty), 5, `rgba(16,16,16,${amt})`, `rgba(${col},${amt})`);
        // узел участника
        square(X(x), Y(y), 9, `rgba(${col},${amt})`);

        // на телефоне — только короткая подпись над узлом, без рамки
        if (narrow) {
          const below = !left && !right;
          text(name.toUpperCase(), X(x), below ? Y(y) + 14 : Y(y) - 12, 8.5, `rgba(${WHITE},${0.85 * amt})`, MONO, "center", 0.08);
          return;
        }

        // рамка с подписью
        const nameSize = 10.5;
        const subSize = 11.5;
        const pad = 10;
        const bw = Math.max(textW(name.toUpperCase(), nameSize), textW(sub, subSize, BODY, 0)) + pad * 2 + 12;
        const bh = 44 * fontK;
        // рамка над узлом (у площадки — под ним), не выходит за край экрана
        const below = !left && !right;
        let bx = X(x) - bw / 2;
        const by = below ? Y(y) + 14 : Y(y) - bh - 12;
        bx = Math.max(4, Math.min(w - bw - 8, bx));
        ctx.fillStyle = `rgba(16,16,16,${0.92 * amt})`;
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = `rgba(${WHITE},${0.28 * amt})`;
        ctx.strokeRect(Math.round(bx) + 0.5, Math.round(by) + 0.5, Math.round(bw) - 1, Math.round(bh) - 1);
        ctx.fillStyle = `rgba(${col},${amt})`;
        ctx.fillRect(bx, by, bw, 2);
        square(bx + pad + 3, by + bh * 0.34, 6, `rgba(${col},${amt})`);
        text(name.toUpperCase(), bx + pad + 12, by + bh * 0.34, nameSize, `rgba(${WHITE},${amt})`);
        text(sub, bx + pad + 12, by + bh * 0.7, subSize, `rgba(${WHITE},${0.55 * amt})`, BODY, "left", 0);
        // исходные данные: стрелка «в ядро»
        if (opts.input && opts.flowOut < 0.98) {
          const a = amt * (1 - opts.flowOut);
          const dir = left ? 1 : -1;
          text(dir > 0 ? "→ В ЯДРО" : "В ЯДРО ←", X(x) + dir * 12, Y(y) + 20, 9, `rgba(${ORANGE},${a})`, MONO, dir > 0 ? "left" : "right");
        }
      };

      // первая глава: возможности среды
      CORE_CONCEPTS.forEach((cpt, i) => {
        drawNode({
          x: cpt.x,
          y: cpt.y,
          name: cpt.name,
          sub: cpt.sub,
          layer: cpt.layer,
          amt: conceptAmount(cpt, p) * (1 - reset),
          dim: 1,
          flowOut: 1,
          flowBack: 0.6,
          seed: i,
        });
      });

      // алгоритмы: поле элементов, подчинённых правилу
      if (algo > 0.01) {
        text("ПРАВИЛА → МНОЖЕСТВО ЭЛЕМЕНТОВ", X(76), Y(172), 9.5, `rgba(${WHITE},${0.55 * algo})`);
        for (let col = 0; col < 7; col++)
          for (let r = 0; r < 4; r++) {
            const local = easeOut(algo * 1.8 - (col + r) * 0.07);
            if (local < 0.01) continue;
            const size = (12 + 6 * (0.5 + 0.5 * Math.sin(col * 0.9 + r * 1.4))) * local;
            const x = X(76 + col * 26 + 9.5);
            const y = Y(190 + r * 26 + 9.5);
            const lit = Math.max(0, Math.sin(col * 0.8 + r * 0.5 - time * 0.9)) ** 6;
            ctx.strokeStyle = `rgba(${WHITE},${0.45 * algo})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(Math.round(x - (size * s) / 2) + 0.5, Math.round(y - (size * s) / 2) + 0.5, Math.round(size * s), Math.round(size * s));
            if (lit > 0.4) square(x, y, size * s * 0.5, `rgba(${ORANGE},${algo * lit})`);
          }
        // связь поля с ядром
        ctx.strokeStyle = `rgba(${ORANGE},${0.6 * algo})`;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(X(262), Y(240));
        ctx.quadraticCurveTo(X(300), Y(205), X(CX - ringRx(3)), Y(RING_Y[3]));
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // вторая глава: участники объекта
      CORE_STATIONS.forEach((stn, i) => {
        const dim = sel === null ? 1 : stn.links.includes(sel) ? 1 : 0.22;
        drawNode({
          x: stn.x,
          y: stn.y,
          name: stn.name,
          sub: stn.role,
          layer: stn.layer,
          amt: stationAmount(stn, p) * (1 - 0.9 * gather),
          dim,
          flowOut: stn.input ? sm(0.47, 0.5, p) : 1,
          flowBack: stn.key === "site" ? 0.4 + fb : 0.5,
          input: stn.input,
          seed: i + 3,
        });
      });

      // факт с площадки возвращается в ядро
      if (fb > 0.01) {
        const sx = X(CX);
        const y0 = Y(475) - 6;
        const y1 = Y(CY + RS) + 4;
        ctx.strokeStyle = `rgba(${GREEN},${0.8 * fb})`;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(sx + 26 * s, y0);
        ctx.lineTo(sx + 26 * s, y1);
        ctx.stroke();
        ctx.setLineDash([]);
        for (let k = 0; k < 3; k++) {
          const u = frac(time * 0.3 + k / 3);
          square(sx + 26 * s, y0 + (y1 - y0) * u, 4, `rgba(${GREEN},${fb})`);
        }
        text("ФАКТ → МОДЕЛЬ", sx + 26 * s + 10, (y0 + y1) / 2, 9.5, `rgba(${GREEN},${fb})`);
        [
          [-0.45, -0.2],
          [0.3, 0.15],
          [-0.1, 0.45],
        ].forEach(([mx, my]) => square(X(CX + mx * RS), Y(CY + my * RS), 6, `rgba(16,16,16,${fb})`, `rgba(${GREEN},${fb})`));
      }

      // ── финал: светлое цельное ядро и название ──
      if (finale > 0.01) {
        ctx.fillStyle = `rgba(241,239,233,${0.96 * finale})`;
        ctx.beginPath();
        ctx.arc(X(CX), Y(CY), R * (0.9 + 0.1 * gather), 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(${ORANGE},${0.8 * finale})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(X(CX), Y(CY), R * 1.18, 0, Math.PI * 2);
        ctx.stroke();
        const mark = sm(0.93, 0.985, p);
        if (mark > 0.01) {
          const size = Math.max(18, 40 * s);
          ctx.font = `500 ${size}px ${MONO}`;
          if ("letterSpacing" in c) c.letterSpacing = `${size * 0.14}px`;
          const tw = ctx.measureText("STRUKTURA").width;
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillStyle = `rgba(26,26,26,${mark})`;
          ctx.fillText("STRUKTURA", X(CX) - tw / 2, Y(CY) - 6);
          ctx.fillStyle = `rgba(${ORANGE},${mark})`;
          ctx.font = `500 ${size * 0.62}px ${MONO}`;
          if ("letterSpacing" in c) c.letterSpacing = "0px";
          ctx.fillText("+", X(CX) + tw / 2 - size * 0.02, Y(CY) - 6 - size * 0.32);
          if ("letterSpacing" in c) c.letterSpacing = "0px";
          text("ЦИФРОВОЕ ЯДРО", X(CX), Y(CY) + size * 0.75, 10, `rgba(26,26,26,${0.6 * mark})`, MONO, "center", 0.3);
        }
      }
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    document.fonts?.ready.then(() => draw());

    const start = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const check = () => (live.current.active ? start() : stop());
    check();
    const id = window.setInterval(check, 300);
    return () => {
      stop();
      window.clearInterval(id);
      ro.disconnect();
    };
  }, [progress]);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}
