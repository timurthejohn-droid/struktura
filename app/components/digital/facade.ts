import { Matrix4, Quaternion, Vector3, Euler } from "three";

// Условная криволинейная облицовка: цилиндрическая дуга с параметрическим выпором.
// Единица — метр. Всё строится процедурно, без загрузки моделей.

export const COLS = 14;
export const ROWS = 9;
export const FACADE_H = 7;
export const GROUND_Y = -FACADE_H / 2 - 0.55;
export const PANEL_T = 0.03;

/** P-042: нумерация по осям (колонка за колонкой), 4 * 9 + 5 = 41. */
export const HERO_INDEX = 41;

/** Глубины относительно лицевой поверхности (по нормали). */
export const DEPTH = { rail: -0.17, mullion: -0.3, base: -1 };

const RADIUS = 9;
const ARC = 1.25;
const GAP = 0.045;
const EPS = 1e-3;

export function hash01(n: number) {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function surface(u: number, v: number, out = new Vector3()) {
  const th = (u - 0.5) * ARC;
  const bulge =
    0.62 * Math.sin(Math.PI * v) * Math.cos(th * 1.7) + 0.24 * Math.sin(u * Math.PI * 2.2 + v * 2.6);
  return out.set(RADIUS * Math.sin(th), (v - 0.5) * FACADE_H, RADIUS * (Math.cos(th) - 1) + bulge);
}

export function surfaceFrame(u: number, v: number) {
  const p = surface(u, v);
  const tu = surface(u + EPS, v).sub(surface(u - EPS, v)).normalize();
  const tvRaw = surface(u, v + EPS).sub(surface(u, v - EPS)).normalize();
  const n = new Vector3().crossVectors(tu, tvRaw).normalize();
  const tv = new Vector3().crossVectors(n, tu).normalize();
  return { p, tu, tv, n };
}

export function pointAt(u: number, v: number, depth: number) {
  const f = surfaceFrame(u, v);
  return f.p.addScaledVector(f.n, depth);
}

export type PanelInfo = {
  index: number;
  id: string;
  col: number;
  row: number;
  zone: number;
  center: Vector3;
  normal: Vector3;
  quat: Quaternion;
  w: number;
  h: number;
  /** Смещение и поворот в разнесённом виде (сцена «Масштаб»). */
  scatter: Vector3;
  spin: Quaternion;
};

export const zoneLabel = (zone: number) => `K-${String(zone + 1).padStart(2, "0")}`;

export function buildPanels(): PanelInfo[] {
  const panels: PanelInfo[] = [];
  const basis = new Matrix4();

  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      const index = col * ROWS + row;
      const u0 = col / COLS;
      const u1 = (col + 1) / COLS;
      const v0 = row / ROWS;
      const v1 = (row + 1) / ROWS;
      const um = (u0 + u1) / 2;
      const vm = (v0 + v1) / 2;
      const f = surfaceFrame(um, vm);

      const w = surface(u0, vm).distanceTo(surface(u1, vm)) - GAP;
      const h = surface(um, v0).distanceTo(surface(um, v1)) - GAP;
      const quat = new Quaternion().setFromRotationMatrix(basis.makeBasis(f.tu, f.tv, f.n));

      const r1 = hash01(index + 1);
      const r2 = hash01(index + 31);
      const r3 = hash01(index + 77);
      const scatter = f.n
        .clone()
        .multiplyScalar(1.3 + r1 * 2.6)
        .addScaledVector(f.tu, (r2 - 0.5) * 0.7)
        .addScaledVector(f.tv, (r3 - 0.5) * 0.7);
      const spin = new Quaternion().setFromEuler(
        new Euler((r2 - 0.5) * 0.55, (r3 - 0.5) * 0.7, (r1 - 0.5) * 0.3),
      );

      panels.push({
        index,
        id: `P-${String(index + 1).padStart(3, "0")}`,
        col,
        row,
        zone: Math.floor(col / 2),
        center: f.p,
        normal: f.n,
        quat,
        w,
        h,
        scatter,
        spin,
      });
    }
  }
  return panels;
}

const _x = new Vector3();
const _y = new Vector3();
const _z = new Vector3();
const _mid = new Vector3();

/** Брус от a до b; сечение t1 × t2, ось t2 смотрит по ref. */
function segment(a: Vector3, b: Vector3, ref: Vector3, t1: number, t2: number) {
  _x.subVectors(b, a);
  const len = _x.length();
  _x.divideScalar(len);
  _z.copy(ref).addScaledVector(_x, -ref.dot(_x)).normalize();
  _y.crossVectors(_z, _x);
  _mid.addVectors(a, b).multiplyScalar(0.5);
  return new Matrix4().makeBasis(_x, _y, _z).scale(new Vector3(len, t1, t2)).setPosition(_mid);
}

/** Подсистема (стойки, ригели, кронштейны) и условное основание — перекрытия здания. */
export function buildSubsystem() {
  const members: Matrix4[] = [];
  const base: Matrix4[] = [];
  const SEG_V = 18;
  const SEG_U = COLS * 2;
  const slabRows = [0, 3, 6, 9];

  // стойки
  for (let k = 0; k <= COLS; k++) {
    const u = k / COLS;
    for (let s = 0; s < SEG_V; s++) {
      const va = s / SEG_V;
      const vb = (s + 1) / SEG_V;
      const n = surfaceFrame(u, (va + vb) / 2).n;
      members.push(segment(pointAt(u, va, DEPTH.mullion), pointAt(u, vb, DEPTH.mullion), n, 0.06, 0.13));
    }
  }

  // ригели — на границах рядов панелей
  for (let j = 0; j <= ROWS; j++) {
    const v = j / ROWS;
    for (let s = 0; s < SEG_U; s++) {
      const ua = s / SEG_U;
      const ub = (s + 1) / SEG_U;
      const n = surfaceFrame((ua + ub) / 2, v).n;
      members.push(segment(pointAt(ua, v, DEPTH.rail), pointAt(ub, v, DEPTH.rail), n, 0.045, 0.06));
    }
  }

  // кронштейны к перекрытиям и сами перекрытия
  for (const j of slabRows) {
    const v = j / ROWS;
    for (let k = 0; k <= COLS; k++) {
      const u = k / COLS;
      const f = surfaceFrame(u, v);
      members.push(segment(pointAt(u, v, DEPTH.mullion), pointAt(u, v, DEPTH.base + 0.12), f.tv, 0.08, 0.08));
    }
    for (let s = 0; s < SEG_U; s++) {
      const ua = -0.02 + (s / SEG_U) * 1.04;
      const ub = -0.02 + ((s + 1) / SEG_U) * 1.04;
      const n = surfaceFrame((ua + ub) / 2, v).n;
      base.push(segment(pointAt(ua, v, DEPTH.base), pointAt(ub, v, DEPTH.base), n, 0.24, 0.5));
    }
  }

  return { members, base };
}
