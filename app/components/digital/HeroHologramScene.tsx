"use client";

import { Component, useEffect, useMemo, useRef, type ErrorInfo, type MutableRefObject, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  EdgesGeometry,
  Group,
  HalfFloatType,
  IcosahedronGeometry,
  Line,
  LineDashedMaterial,
  InstancedBufferAttribute,
  InstancedMesh,
  LineBasicMaterial,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  Raycaster,
  SRGBColorSpace,
  RingGeometry,
  ShaderMaterial,
  Sphere,
  CanvasTexture,
  Sprite,
  SpriteMaterial,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  type Ray,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import DigitalHeroGrid from "../DigitalHeroGrid";
import { makeRadialGlow } from "./textures";

export type PointerState = {
  /** Координаты курсора в NDC относительно героблока. */
  x: number;
  y: number;
  inside: boolean;
  /** Скорость движения курсора, px/ms (ограничена). */
  speed: number;
  /** Счётчик кликов внутри блока — сцена реагирует на его изменение. */
  clicks: number;
  fine: boolean;
};

export type HologramLayout = "hero" | "section";

type SceneProps = {
  pointer: MutableRefObject<PointerState>;
  reduced: boolean;
  active: boolean;
  /** hero — текст внизу, сфера выше; section — текст сверху, сфера ниже. */
  layout: HologramLayout;
};

const ORANGE = new Color("#ff5a00");
const GOLD = new Color("#ffa63a");
const HOT = new Color("#ffcf96");
const WARM = new Color("#ffe6d6");

const TAU = Math.PI * 2;
const SR = 2.05; // внешний радиус сферы
const HOLO_Y = 0;

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const hash01 = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function sph(lat: number, lon: number, r: number, out = new Vector3()) {
  return out.set(r * Math.cos(lat) * Math.cos(lon), r * Math.sin(lat), r * Math.cos(lat) * Math.sin(lon));
}

// ── сфера: оболочки из трасс, осколков и искр ──
type ShellSpec = {
  r: number;
  traces: number;
  shards: number;
  points: number;
  spikes: number;
  speed: number;
  tilt: [number, number, number];
  opacity: number;
};
const SHELLS: ShellSpec[] = [
  { r: 0.95, traces: 38, shards: 110, points: 220, spikes: 0, speed: -0.24, tilt: [0.55, 0, 0.25], opacity: 0.42 },
  { r: 1.38, traces: 70, shards: 200, points: 380, spikes: 0, speed: 0.15, tilt: [-0.35, 0, 0.45], opacity: 0.5 },
  { r: 1.74, traces: 95, shards: 260, points: 460, spikes: 0, speed: -0.1, tilt: [0.2, 0, -0.35], opacity: 0.58 },
  { r: SR, traces: 125, shards: 340, points: 560, spikes: 230, speed: 0.065, tilt: [0, 0, 0.12], opacity: 0.62 },
];

type ShellGeo = { traces: BufferGeometry; shardSeeds: Float32Array; shardMats: Matrix4[]; points: BufferGeometry };

function buildShell(spec: ShellSpec, si: number, scale: number): ShellGeo {
  let k = si * 100003 + 7;
  const rnd = () => hash01(++k * 1.731);
  const pos: number[] = [];
  const aT: number[] = [];
  const P = new Vector3();
  const Q = new Vector3();

  // трассы: ломаные по широтам и долготам — как дорожки на плате, свёрнутые в сферу
  const nTraces = Math.round(spec.traces * scale);
  for (let i = 0; i < nTraces; i++) {
    const seed = rnd();
    const r = spec.r * (0.97 + rnd() * 0.06);
    let lat = Math.asin(rnd() * 2 - 1) * 0.92;
    let lon = rnd() * TAU;
    const pts: [number, number][] = [[lat, lon]];
    const steps = 2 + Math.floor(rnd() * 5);
    for (let s = 0; s < steps; s++) {
      const d = (0.06 + rnd() * 0.32) * (rnd() < 0.5 ? -1 : 1);
      const n = Math.max(2, Math.ceil(Math.abs(d) / 0.04));
      const alongLon = rnd() < 0.6;
      const lat0 = lat;
      const lon0 = lon;
      for (let j = 1; j <= n; j++) {
        const f = j / n;
        if (alongLon) pts.push([lat0, lon0 + (d * f) / Math.max(0.3, Math.cos(lat0))]);
        else pts.push([Math.max(-1.35, Math.min(1.35, lat0 + d * f)), lon0]);
      }
      [lat, lon] = pts[pts.length - 1];
    }
    let total = 0;
    const lens = [0];
    for (let j = 1; j < pts.length; j++) {
      sph(pts[j - 1][0], pts[j - 1][1], 1, P);
      sph(pts[j][0], pts[j][1], 1, Q);
      total += P.distanceTo(Q);
      lens.push(total);
    }
    for (let j = 1; j < pts.length; j++) {
      sph(pts[j - 1][0], pts[j - 1][1], r, P);
      sph(pts[j][0], pts[j][1], r, Q);
      pos.push(P.x, P.y, P.z, Q.x, Q.y, Q.z);
      aT.push(lens[j - 1] / total, seed, lens[j] / total, seed);
    }
  }

  // шипы по внешней границе — рваный край голограммы
  const nSpikes = Math.round(spec.spikes * scale);
  for (let i = 0; i < nSpikes; i++) {
    const seed = rnd();
    const lat = Math.asin(rnd() * 2 - 1);
    const lon = rnd() * TAU;
    const len = 0.06 + Math.pow(rnd(), 2.2) * 0.42;
    sph(lat, lon, spec.r * 0.99, P);
    sph(lat, lon, spec.r + len, Q);
    pos.push(P.x, P.y, P.z, Q.x, Q.y, Q.z);
    aT.push(0, seed, 1, seed);
    if (rnd() < 0.35) {
      // излом на конце шипа
      const lon2 = lon + (rnd() - 0.5) * 0.18;
      sph(lat + (rnd() - 0.5) * 0.12, lon2, spec.r + len, P);
      pos.push(Q.x, Q.y, Q.z, P.x, P.y, P.z);
      aT.push(1, seed, 1, seed);
    }
  }
  const traces = new BufferGeometry();
  traces.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
  traces.setAttribute("aT", new BufferAttribute(new Float32Array(aT), 2));

  // осколки-чипы, касательные к оболочке
  const nShards = Math.round(spec.shards * scale);
  const shardMats: Matrix4[] = [];
  const shardSeeds = new Float32Array(nShards);
  const east = new Vector3();
  const north = new Vector3();
  const nrm = new Vector3();
  const sz = spec.r / SR;
  for (let i = 0; i < nShards; i++) {
    const lat = Math.asin(rnd() * 2 - 1) * 0.97;
    const lon = rnd() * TAU;
    const r = spec.r * (0.96 + rnd() * 0.08);
    sph(lat, lon, r, P);
    nrm.copy(P).normalize();
    east.set(-Math.sin(lon), 0, Math.cos(lon));
    north.crossVectors(nrm, east);
    const bar = rnd() < 0.14;
    const w = (bar ? 0.22 + rnd() * 0.3 : 0.03 + Math.pow(rnd(), 2) * 0.19) * (0.6 + sz * 0.4);
    const h = (bar ? 0.014 + rnd() * 0.01 : 0.02 + Math.pow(rnd(), 2) * 0.09) * (0.6 + sz * 0.4);
    const m = new Matrix4().makeBasis(rnd() < 0.5 ? east : north, rnd() < 0.5 ? north : east.clone().negate(), nrm);
    m.scale(Q.set(w, h, 1)).setPosition(P);
    shardMats.push(m);
    shardSeeds[i] = rnd();
  }

  // искры
  const nPts = Math.round(spec.points * scale);
  const pp = new Float32Array(nPts * 3);
  const ps = new Float32Array(nPts);
  for (let i = 0; i < nPts; i++) {
    sph(Math.asin(rnd() * 2 - 1), rnd() * TAU, spec.r * (0.94 + rnd() * 0.12), P);
    pp.set([P.x, P.y, P.z], i * 3);
    ps[i] = rnd();
  }
  const points = new BufferGeometry();
  points.setAttribute("position", new BufferAttribute(pp, 3));
  points.setAttribute("aSeed", new BufferAttribute(ps, 1));

  return { traces, shardSeeds, shardMats, points };
}

// ── шейдеры ──
const heatChunk = /* glsl */ `
  uniform vec3 uHit;
  uniform float uHitAmt;
  uniform vec3 uWavePos;
  uniform float uWaveR;
  uniform float uWaveAmt;
  float heatAt(vec3 p, float radius) {
    float h = uHitAmt * (1.0 - smoothstep(0.0, radius, distance(p, uHit)));
    float wd = distance(p, uWavePos) - uWaveR;
    return h + uWaveAmt * exp(-wd * wd / 0.05);
  }
`;

const traceVert = /* glsl */ `
  attribute vec2 aT;
  varying vec2 vT;
  varying float vHeat;
  ${heatChunk}
  void main() {
    vT = aT;
    float h = heatAt(position, 1.25);
    vHeat = h;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position * (1.0 + h * 0.05), 1.0);
  }
`;
const traceFrag = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform float uOpacity;
  uniform vec3 uColor;
  uniform vec3 uGold;
  uniform vec3 uHot;
  varying vec2 vT;
  varying float vHeat;
  void main() {
    float seed = vT.y;
    float on = clamp(uIntro * 1.6 - seed * 0.6, 0.0, 1.0);
    float p = fract(uTime * (0.12 + seed * 0.3) + seed * 7.0);
    float pulse = exp(-pow((vT.x - p) * 9.0, 2.0));
    float flick = 0.7 + 0.3 * step(0.3, fract(sin(floor(uTime * 7.0) + seed * 50.0) * 4375.85));
    float base = 0.12 + 0.4 * pow(fract(seed * 13.7), 1.6);
    float heat = clamp(vHeat, 0.0, 1.5);
    vec3 col = mix(mix(uColor, uGold, fract(seed * 5.3) * 0.75), uHot, clamp(pulse * 0.6 + heat * 0.6, 0.0, 1.0));
    float a = (base + pulse * 1.1 + heat * 0.8) * flick * on * uOpacity;
    gl_FragColor = vec4(col * (1.0 + pulse * 0.8 + heat * 0.6), a);
  }
`;

const shardVert = /* glsl */ `
  attribute float aSeed;
  varying vec2 vUv;
  varying float vSeed;
  varying float vHeat;
  ${heatChunk}
  void main() {
    vUv = uv;
    vSeed = aSeed;
    vec3 c = instanceMatrix[3].xyz;
    float h = heatAt(c, 1.15);
    vHeat = h;
    vec4 lp = instanceMatrix * vec4(position, 1.0);
    lp.xyz += normalize(c) * h * 0.22;
    gl_Position = projectionMatrix * modelViewMatrix * lp;
  }
`;
const shardFrag = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform float uOpacity;
  uniform vec3 uColor;
  uniform vec3 uGold;
  uniform vec3 uHot;
  varying vec2 vUv;
  varying float vSeed;
  varying float vHeat;
  void main() {
    float on = clamp(uIntro * 1.6 - fract(vSeed * 3.1) * 0.6, 0.0, 1.0);
    float e = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
    float border = 1.0 - smoothstep(0.0, 0.14, e);
    float tw = 0.55 + 0.45 * sin(uTime * (1.5 + vSeed * 4.0) + vSeed * 40.0);
    float bright = 0.25 + 0.75 * pow(fract(vSeed * 17.3), 3.0);
    float heat = clamp(vHeat, 0.0, 1.5);
    vec3 col = mix(mix(uColor, uGold, fract(vSeed * 5.7)), uHot, clamp(heat * 0.7, 0.0, 1.0));
    float a = ((0.16 + border * 0.6) * bright * tw * uOpacity + heat * 0.55) * on;
    gl_FragColor = vec4(col * (1.0 + heat * 0.8), a);
  }
`;

const sparkVert = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uPR;
  uniform float uIntro;
  varying float vA;
  varying float vHeat;
  ${heatChunk}
  void main() {
    float h = heatAt(position, 1.1);
    vHeat = h;
    vec4 mv = modelViewMatrix * vec4(position * (1.0 + h * 0.07), 1.0);
    gl_PointSize = (1.2 + pow(aSeed, 4.0) * 4.0 + h * 2.0) * uPR * (17.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
    float tw = 0.5 + 0.5 * sin(uTime * (1.0 + aSeed * 3.0) + aSeed * 50.0);
    vA = (0.3 + 0.7 * tw) * clamp(uIntro * 1.6 - fract(aSeed * 7.0) * 0.6, 0.0, 1.0);
  }
`;
const sparkFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHot;
  uniform float uOpacity;
  varying float vA;
  varying float vHeat;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = 1.0 - smoothstep(0.0, 0.5, d);
    gl_FragColor = vec4(mix(uColor, uHot, clamp(vHeat, 0.0, 1.0)), a * a * (vA * uOpacity + vHeat));
  }
`;

const ringVert = /* glsl */ `
  varying vec2 vPos;
  void main() {
    vPos = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const ringFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uCount;
  uniform float uDuty;
  uniform float uFlow;
  uniform float uComet;
  uniform float uInner;
  uniform float uOuter;
  uniform float uMode;
  varying vec2 vPos;
  void main() {
    float a = atan(vPos.y, vPos.x) / 6.2831853 + 0.5;
    float rn = clamp((length(vPos) - uInner) / (uOuter - uInner), 0.0, 1.0);
    float seg = 1.0;
    if (uCount > 0.5) {
      seg = step(fract(a * uCount + uTime * uFlow), uDuty);
      if (uMode > 0.5) {
        float major = step(fract(a * uCount / 5.0), uDuty / 5.0);
        seg *= step(rn, mix(0.45, 1.0, major));
      }
    }
    float comet = step(0.0001, abs(uComet)) * pow(fract(a - uTime * uComet), 10.0);
    float edge = uMode > 0.5 ? 1.0 : smoothstep(0.0, 0.25, rn) * smoothstep(1.0, 0.75, rn);
    float alpha = (seg * 0.6 + comet * 1.4) * edge * uOpacity;
    gl_FragColor = vec4(uColor * (1.0 + comet * 1.5), alpha);
  }
`;
const arcFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uStart;
  uniform float uLen;
  uniform float uInner;
  uniform float uOuter;
  varying vec2 vPos;
  void main() {
    float ang = atan(vPos.y, vPos.x);
    float t = mod(ang - uStart, 6.2831853) / uLen;
    if (t > 1.0) discard;
    float rn = clamp((length(vPos) - uInner) / (uOuter - uInner), 0.0, 1.0);
    float edge = smoothstep(0.0, 0.3, rn) * smoothstep(1.0, 0.7, rn);
    float g = pow(t, 2.2);
    gl_FragColor = vec4(uColor * (1.0 + g * 1.4), g * edge * uOpacity);
  }
`;

const dustVert = /* glsl */ `
  attribute float aRnd;
  uniform float uTime;
  uniform float uPR;
  uniform float uIntro;
  varying float vA;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.2 + aRnd * 40.0) * 0.15;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (1.0 + aRnd * 1.8) * uPR * (17.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
    vA = (0.25 + 0.75 * (0.5 + 0.5 * sin(uTime * (0.6 + aRnd * 1.8) + aRnd * 60.0))) * 0.45 * uIntro;
  }
`;
const pointFrag = /* glsl */ `
  uniform vec3 uColor;
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = 1.0 - smoothstep(0.0, 0.5, d);
    gl_FragColor = vec4(uColor, a * a * vA);
  }
`;

function additive(mat: ShaderMaterial) {
  mat.transparent = true;
  mat.depthWrite = false;
  mat.blending = AdditiveBlending;
  return mat;
}
const heatUniforms = () => ({
  uHit: { value: new Vector3(0, 0, 99) },
  uHitAmt: { value: 0 },
  uWavePos: { value: new Vector3(0, 0, 99) },
  uWaveR: { value: 0 },
  uWaveAmt: { value: 0 },
});

// ── HUD-кольца вокруг сферы и проектора ──
type RingSpec = {
  inner: number;
  outer: number;
  count?: number;
  duty?: number;
  flow?: number;
  comet?: number;
  ticks?: boolean;
  opacity: number;
  white?: boolean;
  y: number;
  tilt: [number, number, number];
  spin: number;
  gyro?: boolean;
};
const FLAT = -Math.PI / 2;
const RINGS: RingSpec[] = [
  // орбиты вокруг сферы
  { inner: 3.05, outer: 3.22, count: 180, duty: 0.2, ticks: true, opacity: 0.5, y: HOLO_Y, tilt: [FLAT + 0.16, 0, 0.05], spin: 0.04 },
  { inner: 3.42, outer: 3.5, count: 6, duty: 0.7, comet: 0.08, opacity: 0.6, y: HOLO_Y, tilt: [FLAT + 0.16, 0, 0.05], spin: -0.07 },
  { inner: 2.72, outer: 2.74, comet: 0.18, opacity: 0.3, white: true, y: HOLO_Y, tilt: [FLAT + 0.55, 0.3, -0.35], spin: 0.05 },
  // гироскоп
  { inner: 2.55, outer: 2.58, comet: 0.22, opacity: 0.2, white: true, y: 0, tilt: [0.12, 0, 0], spin: 0, gyro: true },
  { inner: 2.4, outer: 2.43, count: 24, duty: 0.45, flow: 0.03, opacity: 0.25, y: 0, tilt: [0.12, Math.PI / 2, 0], spin: 0, gyro: true },
];

function ringMaterial(s: RingSpec) {
  return additive(
    new ShaderMaterial({
      uniforms: {
        uColor: { value: (s.white ? WARM : ORANGE).clone() },
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uCount: { value: s.count ?? 0 },
        uDuty: { value: s.duty ?? 1 },
        uFlow: { value: s.flow ?? 0 },
        uComet: { value: s.comet ?? 0 },
        uInner: { value: s.inner },
        uOuter: { value: s.outer },
        uMode: { value: s.ticks ? 1 : 0 },
      },
      vertexShader: ringVert,
      fragmentShader: ringFrag,
      side: DoubleSide,
    }),
  );
}

// вихревые дуги внутри сферы: яркая голова, затухающий хвост
const ARCS: { r: number; w: number; len: number; tilt: [number, number, number]; speed: number; opacity: number; gold?: boolean }[] = [
  { r: 0.62, w: 0.06, len: 3.0, tilt: [0.9, 0.4, 1.1], speed: 1.3, opacity: 0.9, gold: true },
  { r: 0.98, w: 0.1, len: 2.7, tilt: [0.3, 0.2, 0], speed: 0.9, opacity: 0.8 },
  { r: 1.22, w: 0.05, len: 3.6, tilt: [-0.6, 0.9, 0], speed: -0.6, opacity: 0.8, gold: true },
  { r: 1.5, w: 0.13, len: 2.3, tilt: [1.2, -0.3, 0.4], speed: 0.5, opacity: 0.85 },
  { r: 1.86, w: 0.04, len: 4.2, tilt: [0.1, 1.6, 0.3], speed: -0.35, opacity: 0.6, gold: true },
  { r: 2.22, w: 0.03, len: 2.1, tilt: [-1.1, 0.2, 0.6], speed: 0.3, opacity: 0.5 },
];

// ── отсылки к схемам: слои мастер-модели, участники вокруг, путь детали ──
const MONO = '"CoFo Sans Mono", monospace';
const ORBIT_TILT: [number, number, number] = [FLAT + 0.16, 0, 0.05];
const NODE_R = 3.32;
const NODES = ["Архитектор", "R&D · Mockup", "Проектировщики", "Производства", "Логистика", "Площадка"];
const nodeAngle = (i: number) => -Math.PI / 2 - 1.1 + (i * TAU) / NODES.length;
const LAYER_TEXT =
  "01 ГЕОМЕТРИЯ  ◆  02 ПОДСИСТЕМА  ◆  03 РАСЧЁТЫ / MOCKUP  ◆  04 РД / ВЕДОМОСТИ  ◆  05 CAM / QR / ПОСТАВКИ  ◆  06 ППР / МОНТАЖ  ◆  ";
const TEXT_RING = { inner: 2.76, outer: 2.96, tilt: [FLAT + 1.0, 0, -0.18] as [number, number, number] };

function drawLayerText(c: HTMLCanvasElement) {
  const g = c.getContext("2d")!;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, c.width, c.height);
  g.fillStyle = "rgba(255,255,255,0.45)";
  g.fillRect(0, 2, c.width, 2);
  g.fillRect(0, c.height - 4, c.width, 2);
  g.font = `400 30px ${MONO}`;
  const w = g.measureText(LAYER_TEXT).width;
  g.fillStyle = "#fff";
  g.textBaseline = "middle";
  // строка повторяется дважды по окружности
  g.setTransform(c.width / 2 / w, 0, 0, 1, 0, 0);
  g.fillText(LAYER_TEXT, 0, c.height / 2 + 1);
  g.fillText(LAYER_TEXT, w, c.height / 2 + 1);
  g.setTransform(1, 0, 0, 1, 0, 0);
}

/** Кольцо с UV по окружности: u — угол, v — от внешнего края (0) к внутреннему (1). */
function textRingGeometry(inner: number, outer: number, segs = 256) {
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= segs; i++) {
    const a = (i / segs) * TAU;
    const c = Math.cos(a);
    const sn = Math.sin(a);
    pos.push(c * inner, sn * inner, 0, c * outer, sn * outer, 0);
    uv.push(i / segs, 1, i / segs, 0);
    if (i < segs) {
      const k = i * 2;
      idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
  g.setAttribute("uv", new BufferAttribute(new Float32Array(uv), 2));
  g.setIndex(idx);
  return g;
}

function makeDiamond() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  g.strokeStyle = "#fff";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(32, 6);
  g.lineTo(58, 32);
  g.lineTo(32, 58);
  g.lineTo(6, 32);
  g.closePath();
  g.stroke();
  g.fillStyle = "#fff";
  g.beginPath();
  g.arc(32, 32, 7, 0, TAU);
  g.fill();
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

const textVert = /* glsl */ `
  varying vec2 vUv;
  varying float vZ;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vZ = wp.z;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const textFrag = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  varying float vZ;
  void main() {
    float a = texture2D(uMap, vUv).a;
    float front = smoothstep(-1.4, 1.2, vZ);
    gl_FragColor = vec4(uColor, a * front * uOpacity);
  }
`;

// связь «модель ↔ участник»: оранжевые импульсы наружу, светлые — обратно в модель
const linkVert = /* glsl */ `
  attribute vec2 aT;
  varying vec2 vT;
  void main() {
    vT = aT;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const linkFrag = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;
  uniform vec3 uWarm;
  varying vec2 vT;
  void main() {
    float t = vT.x;
    float s = vT.y;
    float po = exp(-pow((t - fract(uTime * 0.35 + s)) * 14.0, 2.0));
    float pi = exp(-pow((t - (1.0 - fract(uTime * 0.28 + s * 1.7 + 0.5))) * 14.0, 2.0));
    float dash = step(fract(t * 16.0), 0.5);
    vec3 col = mix(uColor, uWarm, pi / (po + pi + 0.001));
    gl_FragColor = vec4(col, (0.16 * dash + po + pi * 0.9) * uOpacity);
  }
`;

// ── пост-обработка: свечение ──
function Effects() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  const composer = useMemo(() => {
    const rt = new WebGLRenderTarget(1, 1, { type: HalfFloatType, samples: 4 });
    const c = new EffectComposer(gl, rt);
    c.addPass(new RenderPass(scene, camera));
    c.addPass(new UnrealBloomPass(new Vector2(256, 256), 0.62, 0.45, 0.14));
    c.addPass(new OutputPass());
    return c;
  }, [gl, scene, camera]);

  useEffect(() => {
    composer.setPixelRatio(gl.getPixelRatio());
    composer.setSize(size.width, size.height);
  }, [composer, gl, size]);
  useEffect(() => () => composer.dispose(), [composer]);

  useFrame((_, dt) => composer.render(dt), 1);
  return null;
}

function Hologram({ pointer, reduced, layout }: Omit<SceneProps, "active">) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);

  const lite = typeof window !== "undefined" && window.innerWidth < 768;

  const res = useMemo(() => {
    const disposables: { dispose: () => void }[] = [];
    const keep = <T extends { dispose: () => void }>(x: T) => {
      disposables.push(x);
      return x;
    };
    const pr = Math.min(gl.getPixelRatio(), 2);
    const scale = lite ? 0.55 : 1;

    // оболочки сферы
    const shardGeo = keep(new PlaneGeometry(1, 1));
    const shells = SHELLS.map((spec, si) => {
      const geo = buildShell(spec, si, scale);
      keep(geo.traces);
      keep(geo.points);
      const traceMat = keep(
        additive(
          new ShaderMaterial({
            uniforms: {
              ...heatUniforms(),
              uTime: { value: 0 },
              uIntro: { value: 0 },
              uOpacity: { value: spec.opacity },
              uColor: { value: ORANGE.clone() },
              uGold: { value: GOLD.clone() },
              uHot: { value: HOT.clone() },
            },
            vertexShader: traceVert,
            fragmentShader: traceFrag,
          }),
        ),
      );
      const shardMat = keep(
        additive(
          new ShaderMaterial({
            uniforms: {
              ...heatUniforms(),
              uTime: { value: 0 },
              uIntro: { value: 0 },
              uOpacity: { value: spec.opacity },
              uColor: { value: ORANGE.clone() },
              uGold: { value: GOLD.clone() },
              uHot: { value: HOT.clone() },
            },
            vertexShader: shardVert,
            fragmentShader: shardFrag,
            side: DoubleSide,
          }),
        ),
      );
      const sparkMat = keep(
        additive(
          new ShaderMaterial({
            uniforms: {
              ...heatUniforms(),
              uTime: { value: 0 },
              uIntro: { value: 0 },
              uPR: { value: pr },
              uOpacity: { value: spec.opacity },
              uColor: { value: GOLD.clone() },
              uHot: { value: HOT.clone() },
            },
            vertexShader: sparkVert,
            fragmentShader: sparkFrag,
          }),
        ),
      );
      return { spec, geo, traceMat, shardMat, sparkMat };
    });

    // ядро
    const coreTex = keep(makeRadialGlow("255,120,30"));
    const coreHotTex = keep(makeRadialGlow("255,226,190"));
    const coreMat = keep(new SpriteMaterial({ map: coreTex, blending: AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false }));
    const coreHotMat = keep(new SpriteMaterial({ map: coreHotTex, blending: AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false }));
    const icoGeo = keep(new EdgesGeometry(new IcosahedronGeometry(0.5, 1)));
    const octGeo = keep(new EdgesGeometry(new OctahedronGeometry(0.78, 0)));
    const coreLineMat = keep(new LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false }));
    const coreLineMat2 = keep(new LineBasicMaterial({ color: ORANGE, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false }));

    const arcs = ARCS.map((a) => {
      const start = hash01(a.r * 13) * TAU;
      const inner = a.r - a.w / 2;
      const outer = a.r + a.w / 2;
      return {
        spec: a,
        geo: keep(new RingGeometry(inner, outer, 160, 1, start, a.len)),
        mat: keep(
          additive(
            new ShaderMaterial({
              uniforms: {
                uColor: { value: (a.gold ? GOLD : ORANGE).clone() },
                uOpacity: { value: 0 },
                uStart: { value: start },
                uLen: { value: a.len },
                uInner: { value: inner },
                uOuter: { value: outer },
              },
              vertexShader: ringVert,
              fragmentShader: arcFrag,
              side: DoubleSide,
            }),
          ),
        ),
      };
    });

    // HUD-кольца
    const rings = RINGS.map((s) => ({ spec: s, geo: keep(new RingGeometry(s.inner, s.outer, 256, 1)), mat: keep(ringMaterial(s)) }));

    // частицы
    const N_DUST = lite ? 220 : 520;
    const dustPos = new Float32Array(N_DUST * 3);
    for (let i = 0; i < N_DUST; i++) {
      dustPos[i * 3] = (hash01(i * 2.1) - 0.5) * 26;
      dustPos[i * 3 + 1] = -3 + hash01(i * 3.3) * 10;
      dustPos[i * 3 + 2] = -9 + hash01(i * 5.7) * 13;
    }
    const dustGeo = keep(new BufferGeometry());
    dustGeo.setAttribute("position", new BufferAttribute(dustPos, 3));
    dustGeo.setAttribute("aRnd", new BufferAttribute(new Float32Array(Array.from({ length: N_DUST }, (_, i) => hash01(i * 9.1))), 1));
    const dustMat = keep(
      additive(
        new ShaderMaterial({
          uniforms: { uTime: { value: 0 }, uPR: { value: pr }, uIntro: { value: 0 }, uColor: { value: ORANGE.clone() } },
          vertexShader: dustVert,
          fragmentShader: pointFrag,
        }),
      ),
    );

    // отсылки к схемам
    const layerCanvas = document.createElement("canvas");
    layerCanvas.width = 4096;
    layerCanvas.height = 64;
    drawLayerText(layerCanvas);
    const layerTex = keep(new CanvasTexture(layerCanvas));
    layerTex.anisotropy = 8;
    const textRingGeo = keep(textRingGeometry(TEXT_RING.inner, TEXT_RING.outer));
    const textRingMat = keep(
      additive(
        new ShaderMaterial({
          uniforms: { uMap: { value: layerTex }, uColor: { value: GOLD.clone() }, uOpacity: { value: 0 } },
          vertexShader: textVert,
          fragmentShader: textFrag,
          side: DoubleSide,
        }),
      ),
    );
    const diamondTex = keep(makeDiamond());
    const nodeMats = NODES.map(() =>
      keep(
        new SpriteMaterial({
          map: diamondTex,
          color: ORANGE,
          blending: AdditiveBlending,
          transparent: true,
          depthWrite: false,
          toneMapped: false,
          opacity: 0,
        }),
      ),
    );
    const nodePos = NODES.map((_, i) => new Vector3(Math.cos(nodeAngle(i)), Math.sin(nodeAngle(i)), 0).multiplyScalar(NODE_R));
    const linkPts: number[] = [];
    const linkT: number[] = [];
    nodePos.forEach((p, i) => {
      const a = p.clone().setLength(SR * 1.04);
      const b = p.clone().multiplyScalar(0.95);
      linkPts.push(a.x, a.y, a.z, b.x, b.y, b.z);
      const seed = hash01(i * 4.3 + 1);
      linkT.push(0, seed, 1, seed);
    });
    const linkGeo = keep(new BufferGeometry());
    linkGeo.setAttribute("position", new BufferAttribute(new Float32Array(linkPts), 3));
    linkGeo.setAttribute("aT", new BufferAttribute(new Float32Array(linkT), 2));
    const linkMat = keep(
      additive(
        new ShaderMaterial({
          uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uColor: { value: ORANGE.clone() }, uWarm: { value: WARM.clone() } },
          vertexShader: linkVert,
          fragmentShader: linkFrag,
        }),
      ),
    );
    // путь детали: производства → логистика → площадка
    const pathPts: Vector3[] = [];
    for (let i = 0; i <= 60; i++) {
      const a = nodeAngle(3) + ((nodeAngle(5) - nodeAngle(3)) * i) / 60;
      pathPts.push(new Vector3(Math.cos(a) * NODE_R, Math.sin(a) * NODE_R, 0));
    }
    const pathGeo = keep(new BufferGeometry().setFromPoints(pathPts));
    const pathMat = keep(
      new LineDashedMaterial({
        color: ORANGE,
        dashSize: 0.12,
        gapSize: 0.08,
        transparent: true,
        opacity: 0,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    );
    const pathLine = new Line(pathGeo, pathMat);
    pathLine.computeLineDistances();
    const packetMat = keep(
      new SpriteMaterial({ color: HOT, blending: AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false, opacity: 0 }),
    );

    // прицел и кольца-волны клика
    const retRings = [
      { inner: 0.3, outer: 0.335, count: 4, duty: 0.66, opacity: 1, y: 0, tilt: [0, 0, 0], spin: 1.1 } as RingSpec,
      { inner: 0.46, outer: 0.47, comet: 0.6, opacity: 0.8, white: true, y: 0, tilt: [0, 0, 0], spin: 0 } as RingSpec,
      { inner: 0.62, outer: 0.7, count: 72, duty: 0.25, ticks: true, opacity: 0.55, y: 0, tilt: [0, 0, 0], spin: -0.4 } as RingSpec,
    ].map((spec) => ({ spec, geo: keep(new RingGeometry(spec.inner, spec.outer, 128, 1)), mat: keep(ringMaterial(spec)) }));
    const crossPts: number[] = [];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) crossPts.push(dx * 0.08, dy * 0.08, 0, dx * 0.22, dy * 0.22, 0);
    for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
      crossPts.push(sx * 0.82, sy * 0.82, 0, sx * 0.62, sy * 0.82, 0, sx * 0.82, sy * 0.82, 0, sx * 0.82, sy * 0.62, 0);
    }
    const crossGeo = keep(new BufferGeometry());
    crossGeo.setAttribute("position", new BufferAttribute(new Float32Array(crossPts), 3));
    const crossMat = keep(new LineBasicMaterial({ color: WARM, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false }));
    const pulses = [0, 1, 2].map(() => {
      const spec: RingSpec = { inner: 0.94, outer: 1, opacity: 0, white: true, y: 0, tilt: [0, 0, 0], spin: 0 };
      return { geo: keep(new RingGeometry(0.94, 1, 128, 1)), mat: keep(ringMaterial(spec)), age: 9, pos: new Vector3() };
    });

    return {
      disposables,
      shardGeo,
      shells,
      coreMat,
      coreHotMat,
      icoGeo,
      octGeo,
      coreLineMat,
      coreLineMat2,
      arcs,
      rings,
      dustGeo,
      dustMat,
      retRings,
      crossGeo,
      crossMat,
      pulses,
      layerCanvas,
      layerTex,
      textRingGeo,
      textRingMat,
      nodeMats,
      nodePos,
      linkGeo,
      linkMat,
      pathLine,
      pathMat,
      packetMat,
    };
  }, [gl, lite]);

  useEffect(() => () => res.disposables.forEach((d) => d.dispose()), [res]);

  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let cancelled = false;
    document.fonts
      ?.load(`400 30px ${MONO}`)
      .then(() => {
        if (cancelled) return;
        drawLayerText(res.layerCanvas);
        res.layerTex.needsUpdate = true;
        invalidate();
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [res, invalidate]);

  const rigRef = useRef<Group>(null);
  const orbitRef = useRef<Group>(null);
  const textRingRef = useRef<Mesh>(null);
  const packetRef = useRef<Sprite>(null);
  const nodeLabelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const holoRef = useRef<Group>(null);
  const spinRef = useRef<Group>(null);
  const gyroRef = useRef<Group>(null);
  const shellRefs = useRef<(Group | null)[]>([]);
  const shardRefs = useRef<(InstancedMesh | null)[]>([]);
  const arcRefs = useRef<(Mesh | null)[]>([]);
  const icoRef = useRef<Group>(null);
  const octRef = useRef<Group>(null);
  const coreRef = useRef<Sprite>(null);
  const coreHotRef = useRef<Sprite>(null);
  const ringRefs = useRef<(Mesh | null)[]>([]);
  const reticleRef = useRef<Group>(null);
  const retRingRefs = useRef<(Mesh | null)[]>([]);
  const pulseRefs = useRef<(Mesh | null)[]>([]);
  const readoutRef = useRef<HTMLDivElement>(null);

  // осколки: матрицы и сиды задаём один раз
  useEffect(() => {
    res.shells.forEach((sh, i) => {
      const mesh = shardRefs.current[i];
      if (!mesh) return;
      sh.geo.shardMats.forEach((m, j) => mesh.setMatrixAt(j, m));
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    });
  }, [res]);
  const shardGeos = useMemo(
    () =>
      res.shells.map((sh) => {
        const g = res.shardGeo.clone();
        g.setAttribute("aSeed", new InstancedBufferAttribute(sh.geo.shardSeeds, 1));
        return g;
      }),
    [res],
  );
  useEffect(() => () => shardGeos.forEach((g) => g.dispose()), [shardGeos]);

  const st = useRef({
    t: 0,
    ringT: 0,
    boost: 0,
    camX: 0,
    camY: 0,
    retVis: 0,
    hitDir: new Vector3(0, 0, 1),
    retPos: new Vector3(0, 0, SR),
    clicks: pointer.current.clicks,
    pulseIdx: 0,
    wave: { dir: new Vector3(0, 0, 1), age: 9 },
    readout: "",
    spins: RINGS.map(() => 0),
    retSpins: [0, 0, 0],
    shellSpins: SHELLS.map(() => 0),
    arcSpins: ARCS.map(() => 0),
    orbitSpin: 0,
    textSpin: 0,
  });
  const tmp = useMemo(
    () => ({
      ray: new Raycaster(),
      ndc: new Vector2(),
      plane: new Plane(new Vector3(0, 0, 1), 0),
      sphere: new Sphere(new Vector3(), SR + 0.05),
      inv: new Matrix4(),
      p: new Vector3(),
      a: new Vector3(),
      b: new Vector3(),
    }),
    [],
  );

  useFrame((_, rawDt) => {
    const s = st.current;
    const dt = reduced ? 0 : Math.min(rawDt, 0.1);
    s.t += dt;
    const T = reduced ? 9 : s.t;
    const intro = reduced ? 1 : clamp01((s.t - 0.15) / 2.8);
    const k = 1 - Math.exp(-dt * 3);
    const ptr = pointer.current;
    const inside = !reduced && ptr.fine && ptr.inside;
    const px = inside ? ptr.x : 0;
    const py = inside ? ptr.y : 0;

    // ── камера и композиция ──
    const aspect = size.width / size.height;
    const narrow = size.width < 768 || aspect < 0.95;
    const fit = narrow ? Math.max(1, 0.8 / aspect) : Math.max(1, 1.55 / aspect);
    s.camX += (px * 0.7 - s.camX) * k;
    s.camY += (py * 0.4 - s.camY) * k;
    camera.position.set(s.camX, 1.6 + s.camY, 17.5 * fit);
    camera.lookAt(0, 0, 0);
    const oy = layout === "hero" ? (narrow ? 0.25 : 0.13) : narrow ? -0.2 : -0.06;
    camera.setViewOffset(size.width, size.height, narrow ? 0 : -size.width * 0.17, size.height * oy, size.width, size.height);
    camera.updateMatrixWorld();

    const rig = rigRef.current;
    const holo = holoRef.current;
    const spin = spinRef.current;
    if (!rig || !holo || !spin) return;
    const sway = reduced ? 0 : Math.sin(T * 0.15) * 0.1;
    const kr = reduced ? 1 : 1 - Math.exp(-dt * 2.5);
    rig.rotation.y += (-0.16 + sway + px * 0.3 - rig.rotation.y) * kr;
    rig.rotation.x += (-py * 0.1 - rig.rotation.x) * kr;
    holo.position.y = HOLO_Y + Math.sin(T * 0.8) * 0.06;

    s.boost += ((inside ? Math.min(1, ptr.speed * 0.7) : 0) - s.boost) * (1 - Math.exp(-dt * (inside && ptr.speed > s.boost ? 6 : 1.5)));
    s.ringT += dt * (1 + s.boost * 2.5);
    const spinBoost = 1 + s.boost * 3;

    // ── сфера: оболочки вращаются в разные стороны ──
    spin.rotation.y += dt * 0.07 * spinBoost;
    const sIntro = (i: number) => clamp01(intro * 1.7 - i * 0.18);
    res.shells.forEach((sh, i) => {
      s.shellSpins[i] += sh.spec.speed * dt * spinBoost;
      const g = shellRefs.current[i];
      if (g) {
        g.rotation.y = s.shellSpins[i];
        const e = easeOut(sIntro(i));
        g.scale.setScalar(0.7 + 0.3 * e);
      }
      for (const m of [sh.traceMat, sh.shardMat, sh.sparkMat]) {
        m.uniforms.uTime.value = T;
        m.uniforms.uIntro.value = sIntro(i);
      }
    });
    res.arcs.forEach((a, i) => {
      s.arcSpins[i] += a.spec.speed * dt * spinBoost;
      const m = arcRefs.current[i];
      if (m) m.rotation.z = s.arcSpins[i];
      a.mat.uniforms.uOpacity.value = a.spec.opacity * smooth(0.25 + i * 0.05, 0.7 + i * 0.05, intro);
    });
    if (icoRef.current) icoRef.current.rotation.set(T * 0.4, T * 0.55, 0);
    if (octRef.current) octRef.current.rotation.set(-T * 0.25, -T * 0.3, T * 0.1);
    res.coreLineMat.opacity = 0.75 * smooth(0, 0.4, intro);
    res.coreLineMat2.opacity = 0.45 * smooth(0.1, 0.5, intro);
    const corePulse = 0.85 + 0.15 * Math.sin(T * 2.4) + s.boost * 0.25;
    if (coreRef.current) coreRef.current.scale.setScalar(2.1 * corePulse * easeOut(intro * 2));
    if (coreHotRef.current) coreHotRef.current.scale.setScalar(0.62 * corePulse * easeOut(intro * 2.5));
    res.coreMat.opacity = 0.42;
    res.coreHotMat.opacity = 0.7;

    // ── HUD-кольца ──
    res.rings.forEach((r, i) => {
      s.spins[i] += r.spec.spin * dt * (1 + s.boost * 4);
      const m = ringRefs.current[i];
      if (m) m.rotation.z = s.spins[i];
      const appear = easeOut(intro * 2.4 - i * 0.12);
      r.mat.uniforms.uTime.value = s.ringT;
      r.mat.uniforms.uOpacity.value = r.spec.opacity * appear;
      if (m) m.scale.setScalar(0.82 + 0.18 * appear);
    });
    if (gyroRef.current) gyroRef.current.rotation.y = s.ringT * 0.14;

    res.dustMat.uniforms.uTime.value = T;
    res.dustMat.uniforms.uIntro.value = intro;

    // ── отсылки к схемам ──
    s.orbitSpin += dt * 0.035 * spinBoost;
    s.textSpin -= dt * 0.025 * spinBoost;
    if (orbitRef.current) orbitRef.current.rotation.z = s.orbitSpin;
    if (textRingRef.current) textRingRef.current.rotation.z = s.textSpin;
    const schemaIn = smooth(0.55, 1, intro);
    res.textRingMat.uniforms.uOpacity.value = 0.75 * schemaIn;
    res.linkMat.uniforms.uTime.value = T;
    res.linkMat.uniforms.uOpacity.value = 0.8 * schemaIn;
    res.pathMat.opacity = 0.55 * schemaIn;
    const orbit = orbitRef.current;
    if (orbit) {
      orbit.updateMatrixWorld();
      res.nodePos.forEach((p, i) => {
        tmp.a.copy(p).applyMatrix4(orbit.matrixWorld);
        const front = smooth(-2.6, 0.8, tmp.a.z);
        res.nodeMats[i].opacity = schemaIn * (0.35 + 0.65 * front);
        const el = nodeLabelRefs.current[i];
        if (el) el.style.opacity = String(schemaIn * front);
      });
    }
    // пакет-деталь едет по своему маршруту, отдельно от потоков данных
    const ph = (T / 6.5) % 1;
    const run = clamp01(ph / 0.8);
    const eRun = run < 0.5 ? 4 * run * run * run : 1 - Math.pow(-2 * run + 2, 3) / 2;
    const pAng = nodeAngle(3) + (nodeAngle(5) - nodeAngle(3)) * eRun;
    if (packetRef.current) packetRef.current.position.set(Math.cos(pAng) * NODE_R, Math.sin(pAng) * NODE_R, 0);
    res.packetMat.opacity = schemaIn * smooth(0, 0.06, ph) * (1 - smooth(0.74, 0.8, ph));

    // ── прицел: луч курсора → сфера (или плоскость рядом с ней) ──
    rig.updateMatrixWorld(true);
    let target = 0;
    if (inside) {
      tmp.ray.setFromCamera(tmp.ndc.set(ptr.x, ptr.y), camera);
      tmp.inv.copy(holo.matrixWorld).invert();
      const ray: Ray = tmp.ray.ray.clone().applyMatrix4(tmp.inv);
      if (ray.intersectSphere(tmp.sphere, tmp.p)) {
        target = 1;
      } else if (ray.intersectPlane(tmp.plane, tmp.p)) {
        const out = tmp.p.length() - SR;
        target = clamp01(1 - out / 0.9);
        tmp.p.setLength(SR);
      }
      if (target > 0) {
        tmp.a.copy(tmp.p).normalize();
        s.hitDir.lerp(tmp.a, s.retVis < 0.05 ? 1 : 1 - Math.exp(-dt * 14)).normalize();
      }
    }
    s.retVis += (target * intro - s.retVis) * (1 - Math.exp(-dt * 6));
    s.retPos.copy(s.hitDir).multiplyScalar(SR + 0.08);

    const ret = reticleRef.current;
    if (ret) {
      ret.position.copy(s.retPos);
      ret.lookAt(tmp.a.copy(s.retPos).multiplyScalar(2).applyMatrix4(holo.matrixWorld));
      ret.visible = s.retVis > 0.01;
      ret.scale.setScalar(0.85 + 0.15 * s.retVis);
    }
    res.retRings.forEach((r, i) => {
      s.retSpins[i] += r.spec.spin * dt * (1 + s.boost * 3);
      const m = retRingRefs.current[i];
      if (m) m.rotation.z = s.retSpins[i];
      r.mat.uniforms.uTime.value = s.ringT;
      r.mat.uniforms.uOpacity.value = r.spec.opacity * s.retVis;
    });
    res.crossMat.opacity = 0.85 * s.retVis;

    // клик — волна по оболочкам и кольцо у прицела
    if (ptr.clicks !== s.clicks) {
      s.clicks = ptr.clicks;
      if (s.retVis > 0.3) {
        s.wave.dir.copy(s.hitDir);
        s.wave.age = 0;
        const pl = res.pulses[s.pulseIdx];
        pl.age = 0;
        pl.pos.copy(s.retPos);
        s.pulseIdx = (s.pulseIdx + 1) % res.pulses.length;
      }
    }
    s.wave.age += dt;
    const waveLife = clamp01(1 - s.wave.age / 1.4);
    res.pulses.forEach((pl, i) => {
      pl.age += dt;
      const life = clamp01(1 - pl.age / 1.1);
      const m = pulseRefs.current[i];
      if (m) {
        m.visible = life > 0;
        m.position.copy(pl.pos);
        m.lookAt(tmp.a.copy(pl.pos).multiplyScalar(2).applyMatrix4(holo.matrixWorld));
        m.scale.setScalar(0.15 + pl.age * 1.6);
      }
      pl.mat.uniforms.uOpacity.value = life * 0.6;
    });

    // курсор «прожигает» сферу насквозь: точка подсветки на каждой оболочке вдоль одного луча
    res.shells.forEach((sh, i) => {
      const g = shellRefs.current[i];
      if (!g) return;
      g.updateMatrixWorld();
      tmp.inv.copy(g.matrixWorld).invert();
      tmp.b.copy(s.hitDir).multiplyScalar(sh.spec.r).applyMatrix4(holo.matrixWorld).applyMatrix4(tmp.inv);
      tmp.p.copy(s.wave.dir).multiplyScalar(sh.spec.r).applyMatrix4(holo.matrixWorld).applyMatrix4(tmp.inv);
      const amt = s.retVis * (1 - i * 0.12);
      for (const m of [sh.traceMat, sh.shardMat, sh.sparkMat]) {
        m.uniforms.uHit.value.copy(tmp.b);
        m.uniforms.uHitAmt.value = amt;
        m.uniforms.uWavePos.value.copy(tmp.p);
        m.uniforms.uWaveR.value = (0.1 + s.wave.age * 2.6) * (sh.spec.r / SR);
        m.uniforms.uWaveAmt.value = waveLife * 1.1;
      }
    });

    // показания прицела: координаты на вращающейся сфере
    if (readoutRef.current) {
      readoutRef.current.style.opacity = String(s.retVis);
      const g = shellRefs.current[SHELLS.length - 1];
      if (g && s.retVis > 0.02) {
        tmp.inv.copy(g.matrixWorld).invert();
        tmp.a.copy(s.hitDir).multiplyScalar(SR).applyMatrix4(holo.matrixWorld).applyMatrix4(tmp.inv).normalize();
        const lat = (Math.asin(tmp.a.y) * 180) / Math.PI;
        const lon = (((Math.atan2(tmp.a.z, tmp.a.x) * 180) / Math.PI) + 360) % 360;
        const label = `φ ${lat.toFixed(1)}° · λ ${lon.toFixed(1)}°`;
        if (label !== s.readout) {
          s.readout = label;
          readoutRef.current.textContent = label;
        }
      }
    }

  });

  return (
    <>
      <group ref={rigRef}>
        {res.rings.map((r, i) =>
          r.spec.gyro ? null : (
            <group key={i} position={[0, r.spec.y, 0]} rotation={r.spec.tilt}>
              <mesh ref={(m) => void (ringRefs.current[i] = m)} geometry={r.geo} material={r.mat} />
            </group>
          ),
        )}
        <group ref={gyroRef} position={[0, HOLO_Y, 0]}>
          {res.rings.map((r, i) =>
            r.spec.gyro ? (
              <group key={i} rotation={r.spec.tilt}>
                <mesh ref={(m) => void (ringRefs.current[i] = m)} geometry={r.geo} material={r.mat} />
              </group>
            ) : null,
          )}
        </group>

        {/* слои мастер-модели — надпись по кольцу */}
        <group position={[0, HOLO_Y, 0]} rotation={TEXT_RING.tilt}>
          <mesh ref={textRingRef} geometry={res.textRingGeo} material={res.textRingMat} />
        </group>

        {/* участники среды на орбите и путь детали */}
        <group position={[0, HOLO_Y, 0]} rotation={ORBIT_TILT}>
          <group ref={orbitRef}>
            <lineSegments geometry={res.linkGeo} material={res.linkMat} frustumCulled={false} />
            <primitive object={res.pathLine} />
            <sprite ref={packetRef} material={res.packetMat} scale={0.11} />
            {res.nodePos.map((p, i) => (
              <group key={i} position={p}>
                <sprite material={res.nodeMats[i]} scale={0.26} />
                <Html zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
                  <div ref={(el) => void (nodeLabelRefs.current[i] = el)} className="hh-node">
                    {NODES[i]}
                  </div>
                </Html>
              </group>
            ))}
          </group>
        </group>

        {/* абстрактная сфера */}
        <group ref={holoRef} position={[0, HOLO_Y, 0]}>
          <group ref={spinRef}>
            {res.shells.map((sh, i) => (
              <group key={i} rotation={sh.spec.tilt}>
                <group ref={(g) => void (shellRefs.current[i] = g)}>
                  <lineSegments geometry={sh.geo.traces} material={sh.traceMat} frustumCulled={false} />
                  <instancedMesh
                    ref={(m) => void (shardRefs.current[i] = m)}
                    args={[shardGeos[i], sh.shardMat, sh.geo.shardMats.length]}
                    frustumCulled={false}
                  />
                  <points geometry={sh.geo.points} material={sh.sparkMat} frustumCulled={false} />
                </group>
              </group>
            ))}
          </group>

          {res.arcs.map((a, i) => (
            <group key={i} rotation={a.spec.tilt}>
              <mesh ref={(m) => void (arcRefs.current[i] = m)} geometry={a.geo} material={a.mat} />
            </group>
          ))}
          <sprite ref={coreRef} material={res.coreMat} />
          <sprite ref={coreHotRef} material={res.coreHotMat} />
          <group ref={icoRef}>
            <lineSegments geometry={res.icoGeo} material={res.coreLineMat} />
          </group>
          <group ref={octRef}>
            <lineSegments geometry={res.octGeo} material={res.coreLineMat2} />
          </group>

          <group ref={reticleRef} visible={false}>
            {res.retRings.map((r, i) => (
              <mesh key={i} ref={(m) => void (retRingRefs.current[i] = m)} geometry={r.geo} material={r.mat} />
            ))}
            <lineSegments geometry={res.crossGeo} material={res.crossMat} />
            <Html position={[0.88, 0.5, 0]} zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
              <div ref={readoutRef} className="hh-read" />
            </Html>
          </group>
          {res.pulses.map((pl, i) => (
            <mesh key={i} ref={(m) => void (pulseRefs.current[i] = m)} geometry={pl.geo} material={pl.mat} visible={false} />
          ))}
        </group>

      </group>

      <points geometry={res.dustGeo} material={res.dustMat} frustumCulled={false} />
    </>
  );
}

/** При возврате в кадр цикл рендера сам не стартует — подталкиваем его. */
function Wake({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!active) return;
    // frameloop переключается в том же коммите — дёргаем рендер в следующих кадрах
    let n = 0;
    let id = 0;
    const tick = () => {
      invalidate();
      if (++n < 4) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [active, invalidate]);
  return null;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Hero hologram failed", error, info);
  }
  render() {
    return this.state.failed ? <DigitalHeroGrid /> : this.props.children;
  }
}

export default function HeroHologramScene({ active, reduced, pointer, layout }: SceneProps) {
  return (
    <SceneBoundary>
      <Canvas
        flat
        frameloop={active ? (reduced ? "demand" : "always") : "never"}
        dpr={[1, 1.5]}
        camera={{ fov: 30, near: 0.1, far: 120, position: [0, 1.6, 17.5] }}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <color attach="background" args={["#181818"]} />
        <Hologram pointer={pointer} reduced={reduced} layout={layout} />
        <Effects />
        <Wake active={active} />
      </Canvas>
    </SceneBoundary>
  );
}
