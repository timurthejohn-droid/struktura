"use client";

import { Component, useEffect, useLayoutEffect, useMemo, useRef, type ErrorInfo, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Grid, Html, Lightformer } from "@react-three/drei";
import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderGeometry,
  EdgesGeometry,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  LineSegments,
  Matrix4,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  QuadraticBezierCurve3,
  Quaternion,
  ShaderMaterial,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from "three";
import type { MotionValue } from "framer-motion";
import {
  ENV_KEYFRAMES,
  ENV_LAYERS,
  ENV_STARTS,
  ENV_STATIONS,
  envStepAt,
  layerAmount,
  layerFill,
  stationAmount,
  type EnvStation,
} from "./environmentData";
import { makePerforation, makeRadialGlow } from "./textures";

type SceneProps = {
  progress: MotionValue<number>;
  reduced: boolean;
  active: boolean;
  selected: number | null;
};

const ORANGE = "#ff5a00";
const SC = new Vector3(0, 2.45, 0); // центр сферы-модели
const SR = 2.15;
const ST_R = 5.8; // кольцо участников
const PATH_R = 4.35; // маршрут деталей
const ENV_R = 7.7; // граница общей цифровой среды
const RING_GAP = 0.6;
const NODES = 30;
const LINKS_PER_RING = 8;
const CURVE_PTS = 40;

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const frac = (x: number) => x - Math.floor(x);
const hash01 = (n: number) => frac(Math.sin(n * 12.9898 + 78.233) * 43758.5453);

const stationPos = (angle: number, r = ST_R) => new Vector3(Math.sin(angle) * r, 0, Math.cos(angle) * r);

// ── фрагмент облицовки внутри модели ──
const FC = 7;
const FR = 6;
const F_ARC = 0.9;
const F_RAD = 3.2;
const F_H = 2.3;
const HERO = { c: 4, r: 3 };

function fragPoint(u: number, v: number, depth = 0) {
  const th = (u - 0.5) * F_ARC;
  const bulge = 0.22 * Math.sin(Math.PI * v);
  return new Vector3(
    (F_RAD + depth) * Math.sin(th),
    (v - 0.5) * F_H,
    F_RAD * (Math.cos(th) - 1) + depth * Math.cos(th) + bulge + 0.3,
  );
}
const fragNormal = (u: number) => {
  const th = (u - 0.5) * F_ARC;
  return new Vector3(Math.sin(th), 0, Math.cos(th));
};

const _x = new Vector3();
const _y = new Vector3();
const _z = new Vector3();
const _mid = new Vector3();
const _s = new Vector3();
function segMatrix(a: Vector3, b: Vector3, ref: Vector3, t1: number, t2: number, out = new Matrix4()) {
  _x.subVectors(b, a);
  const len = Math.max(_x.length(), 1e-4);
  _x.divideScalar(len);
  _z.copy(ref).addScaledVector(_x, -ref.dot(_x));
  if (_z.lengthSq() < 1e-6) _z.set(0, 0, 1);
  _z.normalize();
  _y.crossVectors(_z, _x);
  _mid.addVectors(a, b).multiplyScalar(0.5);
  return out.makeBasis(_x, _y, _z).scale(_s.set(len, t1, t2)).setPosition(_mid);
}

type FragPanel = { pos: Vector3; quat: Quaternion; w: number; h: number; order: number; hero: boolean; n: Vector3 };
type FragMember = { a: Vector3; b: Vector3; ref: Vector3; t1: number; t2: number; order: number };

function buildFragment() {
  const panels: FragPanel[] = [];
  const members: FragMember[] = [];
  const gap = 0.035;
  for (let c = 0; c < FC; c++) {
    for (let r = 0; r < FR; r++) {
      const um = (c + 0.5) / FC;
      const vm = (r + 0.5) / FR;
      const th = (um - 0.5) * F_ARC;
      const w = fragPoint(c / FC, vm).distanceTo(fragPoint((c + 1) / FC, vm)) - gap;
      const h = F_H / FR - gap;
      panels.push({
        pos: fragPoint(um, vm),
        quat: new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), th),
        w,
        h,
        order: (c + r) / (FC + FR),
        hero: c === HERO.c && r === HERO.r,
        n: fragNormal(um),
      });
    }
  }
  const up = new Vector3(0, 1, 0);
  // стойки
  for (let k = 0; k <= FC; k++) {
    const u = k / FC;
    for (let s = 0; s < FR; s++) {
      members.push({
        a: fragPoint(u, s / FR - (s === 0 ? 0.04 : 0), -0.12),
        b: fragPoint(u, (s + 1) / FR + (s === FR - 1 ? 0.04 : 0), -0.12),
        ref: fragNormal(u),
        t1: 0.035,
        t2: 0.07,
        order: s / FR,
      });
    }
  }
  // ригели
  for (let j = 0; j <= FR; j++) {
    const v = j / FR;
    for (let s = 0; s < FC * 2; s++) {
      const ua = s / (FC * 2);
      const ub = (s + 1) / (FC * 2);
      members.push({
        a: fragPoint(ua, v, -0.06),
        b: fragPoint(ub, v, -0.06),
        ref: fragNormal((ua + ub) / 2),
        t1: 0.025,
        t2: 0.035,
        order: v,
      });
    }
  }
  // кронштейны к условному основанию
  for (let k = 0; k <= FC; k += 1) {
    for (const v of [0.08, 0.5, 0.92]) {
      const u = k / FC;
      members.push({
        a: fragPoint(u, v, -0.12),
        b: fragPoint(u, v, -0.34),
        ref: up,
        t1: 0.04,
        t2: 0.04,
        order: v,
      });
    }
  }
  const heroPanel = panels.find((p) => p.hero)!;
  return { panels, members, heroPanel };
}

// ── станции участников: простые макеты из брусков ──
type PartMat = "light" | "dark" | "glass" | "orange" | "screen";
type Part = { k: "box" | "cyl" | "prism"; p: [number, number, number]; s: [number, number, number]; m: PartMat; r?: [number, number, number] };

const HALF_PI = Math.PI / 2;
const STATION_PARTS: Record<string, Part[]> = {
  arch: [
    { k: "box", p: [0, 0.62, 0.08], s: [1.3, 0.05, 0.7], m: "light" },
    ...([-0.58, 0.58] as const).flatMap((x) =>
      ([-0.22, 0.38] as const).map((z) => ({ k: "box" as const, p: [x, 0.37, z] as [number, number, number], s: [0.05, 0.5, 0.05] as [number, number, number], m: "dark" as const })),
    ),
    { k: "box", p: [-0.34, 0.82, 0.1], s: [0.22, 0.36, 0.22], m: "light" },
    { k: "box", p: [-0.02, 0.93, 0.14], s: [0.18, 0.58, 0.18], m: "light" },
    { k: "box", p: [0.32, 0.76, 0.02], s: [0.32, 0.24, 0.28], m: "light" },
    { k: "box", p: [0, 0.62, -0.62], s: [0.06, 0.62, 0.06], m: "dark" },
    { k: "box", p: [0, 1.18, -0.62], s: [1.3, 0.74, 0.05], m: "dark" },
    { k: "box", p: [0, 1.18, -0.592], s: [1.2, 0.64, 0.01], m: "screen" },
  ],
  gc: [
    { k: "box", p: [-0.18, 0.43, 0], s: [1.45, 0.6, 0.64], m: "light" },
    { k: "box", p: [-0.18, 1.04, 0], s: [1.45, 0.6, 0.64], m: "light" },
    ...[-0.64, -0.22, 0.2].flatMap((x) =>
      [0.48, 1.09].map((y) => ({ k: "box" as const, p: [x, y, 0.325] as [number, number, number], s: [0.28, 0.2, 0.01] as [number, number, number], m: "glass" as const })),
    ),
    { k: "box", p: [0.82, 0.95, -0.22], s: [0.04, 1.65, 0.04], m: "dark" },
    { k: "box", p: [0.96, 1.62, -0.22], s: [0.28, 0.17, 0.01], m: "orange" },
  ],
  rnd: [
    { k: "box", p: [0, 0.17, -0.1], s: [1.35, 0.08, 0.32], m: "dark" },
    { k: "box", p: [-0.52, 0.88, -0.1], s: [0.07, 1.5, 0.07], m: "orange" },
    { k: "box", p: [0.52, 0.88, -0.1], s: [0.07, 1.5, 0.07], m: "orange" },
    { k: "box", p: [0, 0.56, -0.1], s: [1.12, 0.06, 0.06], m: "orange" },
    { k: "box", p: [0, 1.28, -0.1], s: [1.12, 0.06, 0.06], m: "orange" },
    { k: "box", p: [-0.25, 0.92, -0.04], s: [0.47, 0.66, 0.03], m: "light" },
    { k: "box", p: [0.26, 0.94, -0.01], s: [0.47, 0.66, 0.03], m: "light", r: [0, 0.14, 0] },
    { k: "box", p: [0.84, 0.31, 0.38], s: [0.36, 0.38, 0.36], m: "dark" },
    { k: "box", p: [0.84, 0.36, 0.565], s: [0.24, 0.14, 0.01], m: "screen" },
  ],
  design: [
    ...[-0.5, 0.5].flatMap((x) => [
      { k: "box" as const, p: [x, 0.5, 0.15] as [number, number, number], s: [0.78, 0.05, 0.46] as [number, number, number], m: "light" as const },
      { k: "box" as const, p: [x - 0.35, 0.3, 0.15] as [number, number, number], s: [0.04, 0.4, 0.42] as [number, number, number], m: "dark" as const },
      { k: "box" as const, p: [x + 0.35, 0.3, 0.15] as [number, number, number], s: [0.04, 0.4, 0.42] as [number, number, number], m: "dark" as const },
      { k: "box" as const, p: [x, 0.76, 0.02] as [number, number, number], s: [0.52, 0.32, 0.03] as [number, number, number], m: "dark" as const },
      { k: "box" as const, p: [x, 0.76, 0.037] as [number, number, number], s: [0.47, 0.27, 0.01] as [number, number, number], m: "screen" as const },
    ]),
    { k: "box", p: [0, 0.6, -0.62], s: [0.05, 0.9, 0.05], m: "dark" },
    { k: "box", p: [0, 1.08, -0.56], s: [1.05, 0.72, 0.03], m: "light", r: [-0.35, 0, 0] },
    { k: "box", p: [-0.12, 1.12, -0.53], s: [0.56, 0.014, 0.01], m: "orange", r: [-0.35, 0, 0] },
    { k: "box", p: [0.18, 0.98, -0.49], s: [0.014, 0.36, 0.01], m: "orange", r: [-0.35, 0, 0] },
  ],
  prod: [
    { k: "box", p: [0, 0.45, -0.15], s: [1.95, 0.66, 1.05], m: "light" },
    ...[-0.64, 0, 0.64].map((x) => ({ k: "prism" as const, p: [x, 0.9, -0.15] as [number, number, number], s: [0.37, 1.05, 0.37] as [number, number, number], m: "light" as const, r: [-HALF_PI, 0, 0] as [number, number, number] })),
    { k: "box", p: [0, 0.52, 0.38], s: [1.7, 0.14, 0.01], m: "glass" },
    { k: "box", p: [0.68, 0.22, 0.62], s: [0.5, 0.18, 0.3], m: "light" },
    { k: "box", p: [-0.55, 0.17, 0.6], s: [0.62, 0.08, 0.08], m: "orange" },
    { k: "box", p: [-0.55, 0.27, 0.6], s: [0.62, 0.08, 0.08], m: "orange" },
  ],
  log: [
    { k: "box", p: [0.1, 0.18, 0.15], s: [1.62, 0.08, 0.36], m: "dark" },
    { k: "box", p: [-0.1, 0.44, 0.15], s: [1.15, 0.42, 0.46], m: "light" },
    { k: "box", p: [0.7, 0.39, 0.15], s: [0.36, 0.38, 0.44], m: "light" },
    { k: "box", p: [0.885, 0.47, 0.15], s: [0.01, 0.15, 0.36], m: "glass" },
    ...[-0.5, 0.2, 0.7].flatMap((x) =>
      [0.37, -0.07].map((z) => ({ k: "cyl" as const, p: [x, 0.12, z] as [number, number, number], s: [0.19, 0.08, 0.19] as [number, number, number], m: "dark" as const, r: [HALF_PI, 0, 0] as [number, number, number] })),
    ),
    { k: "box", p: [-0.55, 0.3, -0.52], s: [0.36, 0.36, 0.36], m: "light" },
    { k: "box", p: [-0.55, 0.3, -0.52], s: [0.37, 0.04, 0.37], m: "orange" },
    { k: "box", p: [-0.13, 0.27, -0.52], s: [0.32, 0.3, 0.32], m: "light" },
  ],
  site: [
    ...[-0.78, -0.06].flatMap((x) =>
      [-0.46, 0.16].map((z) => ({ k: "box" as const, p: [x, 0.86, z] as [number, number, number], s: [0.06, 1.5, 0.06] as [number, number, number], m: "light" as const })),
    ),
    ...[0.56, 1.06, 1.56].map((y) => ({ k: "box" as const, p: [-0.42, y, -0.15] as [number, number, number], s: [0.86, 0.05, 0.76] as [number, number, number], m: "light" as const })),
    { k: "box", p: [-0.61, 0.81, 0.2], s: [0.33, 0.46, 0.02], m: "light" },
    { k: "box", p: [-0.25, 0.81, 0.2], s: [0.33, 0.46, 0.02], m: "light" },
    { k: "box", p: [-0.61, 1.31, 0.2], s: [0.33, 0.46, 0.02], m: "light" },
    { k: "box", p: [0.66, 1.27, -0.2], s: [0.08, 2.34, 0.08], m: "orange" },
    { k: "box", p: [0.28, 2.4, -0.2], s: [1.78, 0.06, 0.06], m: "orange" },
    { k: "box", p: [1.02, 2.32, -0.2], s: [0.2, 0.14, 0.13], m: "dark" },
    { k: "box", p: [-0.42, 2.07, -0.2], s: [0.012, 0.6, 0.012], m: "dark" },
    { k: "box", p: [-0.42, 1.64, -0.2], s: [0.36, 0.27, 0.02], m: "light" },
  ],
};
const LABEL_Y: Record<string, number> = { site: 2.9, gc: 1.75, rnd: 1.9, arch: 1.8, design: 1.75, prod: 1.5, log: 1.15 };

// ── сфера-модель: стекло с френелевским контуром ──
const glassVertex = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const glassFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.4);
    gl_FragColor = vec4(uColor, (0.03 + f * 0.62) * uOpacity);
  }
`;

function globeLines() {
  const pts: number[] = [];
  const seg = 72;
  for (const lat of [-0.75, -0.4, 0, 0.4, 0.75]) {
    const y = Math.sin(lat) * SR;
    const r = Math.cos(lat) * SR;
    for (let i = 0; i < seg; i++) {
      const a0 = (i / seg) * Math.PI * 2;
      const a1 = ((i + 1) / seg) * Math.PI * 2;
      pts.push(Math.cos(a0) * r, y, Math.sin(a0) * r, Math.cos(a1) * r, y, Math.sin(a1) * r);
    }
  }
  for (let m = 0; m < 10; m++) {
    const lon = (m / 10) * Math.PI * 2;
    for (let i = 0; i < seg / 2; i++) {
      const b0 = -HALF_PI + (i / (seg / 2)) * Math.PI;
      const b1 = -HALF_PI + ((i + 1) / (seg / 2)) * Math.PI;
      pts.push(
        Math.cos(b0) * Math.cos(lon) * SR, Math.sin(b0) * SR, Math.cos(b0) * Math.sin(lon) * SR,
        Math.cos(b1) * Math.cos(lon) * SR, Math.sin(b1) * SR, Math.cos(b1) * Math.sin(lon) * SR,
      );
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array(pts), 3));
  return g;
}

function circlePoints(r: number, y: number, a0 = 0, a1 = Math.PI * 2, n = 160) {
  const pts: Vector3[] = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    pts.push(new Vector3(Math.sin(a) * r, y, Math.cos(a) * r));
  }
  return pts;
}

// ── камера: план по сценам ──
type Cam = { t: [number, number, number]; az: number; el: number; d: number };
const CAMS: Cam[] = [
  { t: [0.5, 1.5, 0.6], az: 0.5, el: 0.46, d: 19 },
  { t: [0.6, 1.5, 0.2], az: 0.9, el: 0.48, d: 19.5 },
  { t: [1, 1.6, -0.4], az: 1.0, el: 0.46, d: 17.5 },
  { t: [0, 1.5, 0], az: 0.2, el: 0.5, d: 21.5 },
  { t: [-0.6, 1.4, 0.6], az: -0.35, el: 0.52, d: 23 },
  { t: [-0.3, 1.3, 0.6], az: -0.2, el: 0.55, d: 24 },
  { t: [0, 1.2, 0.3], az: 0.05, el: 0.6, d: 25.5 },
  { t: [0, 1.2, 0.3], az: -0.05, el: 0.62, d: 26 },
];
const CAM_AT = [...ENV_STARTS, 1];

function cameraAt(p: number) {
  let i = 0;
  while (i < CAM_AT.length - 2 && p >= CAM_AT[i + 1]) i++;
  const k = smooth(CAM_AT[i], CAM_AT[i + 1], p);
  const a = CAMS[i];
  const b = CAMS[i + 1];
  const m = (x: number, y: number) => x + (y - x) * k;
  return {
    t: [m(a.t[0], b.t[0]), m(a.t[1], b.t[1]), m(a.t[2], b.t[2])] as const,
    az: m(a.az, b.az),
    el: m(a.el, b.el),
    d: m(a.d, b.d),
  };
}

function Station({
  st,
  groupRef,
  labelRef,
  mats,
  geos,
}: {
  st: EnvStation;
  groupRef: (g: Group | null) => void;
  labelRef: (el: HTMLDivElement | null) => void;
  mats: Record<PartMat, MeshStandardMaterial | MeshBasicMaterial>;
  geos: { box: BoxGeometry; cyl: CylinderGeometry; prism: CylinderGeometry; edges: EdgesGeometry };
}) {
  const color = ENV_LAYERS[st.layer].color;
  const screen = useMemo(() => new MeshBasicMaterial({ color: new Color(color).multiplyScalar(0.55), toneMapped: false }), [color]);
  const edge = useMemo(() => new LineBasicMaterial({ color, transparent: true, opacity: 0.85 }), [color]);
  useEffect(() => () => { screen.dispose(); edge.dispose(); }, [screen, edge]);
  const pos = stationPos(st.angle);

  return (
    <group ref={groupRef} position={pos} rotation={[0, st.angle, 0]}>
      <mesh geometry={geos.box} material={mats.dark} position={[0, 0.06, 0]} scale={[2.35, 0.12, 1.75]} castShadow receiveShadow>
        <lineSegments geometry={geos.edges} material={edge} />
      </mesh>
      {STATION_PARTS[st.key].map((part, i) => (
        <mesh
          key={i}
          geometry={geos[part.k]}
          material={part.m === "screen" ? screen : mats[part.m]}
          position={part.p}
          scale={part.s}
          rotation={part.r ?? [0, 0, 0]}
          castShadow
          receiveShadow
        />
      ))}
      <Html position={[0, LABEL_Y[st.key], 0]} zIndexRange={[6, 0]} style={{ pointerEvents: "none" }}>
        <div ref={labelRef} className="en-st" style={{ ["--c" as string]: color }}>
          <i aria-hidden />
          <b>{st.name}</b>
          <span>{st.role}</span>
        </div>
      </Html>
    </group>
  );
}

function World({ progress, reduced, selected }: Omit<SceneProps, "active">) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const narrow = size.width < 640 || size.width / size.height < 0.9;

  const frag = useMemo(buildFragment, []);

  const res = useMemo(() => {
    const tex = makePerforation();
    const glow = makeRadialGlow();
    return {
      tex,
      glow,
      box: new BoxGeometry(1, 1, 1),
      cyl: new CylinderGeometry(0.5, 0.5, 1, 18),
      prism: new CylinderGeometry(0.5, 0.5, 1, 3),
      edges: new EdgesGeometry(new BoxGeometry(1, 1, 1)),
      ico: new IcosahedronGeometry(1, 1),
      sphere: new SphereGeometry(SR, 64, 48),
      torus: new TorusGeometry(1, 0.006, 6, 180),
      halo: new TorusGeometry(1, 0.028, 8, 180),
      plane: new PlaneGeometry(1, 1),
      globe: globeLines(),
      panel: new MeshStandardMaterial({ map: tex, metalness: 0.3, roughness: 0.45 }),
      orange: new MeshStandardMaterial({ color: ORANGE, metalness: 0.4, roughness: 0.45, emissive: new Color("#3a1200"), emissiveIntensity: 0.25 }),
      light: new MeshStandardMaterial({ color: "#e7e3da", metalness: 0.05, roughness: 0.68 }),
      dark: new MeshStandardMaterial({ color: "#1c1c1c", metalness: 0.2, roughness: 0.75 }),
      glass: new MeshStandardMaterial({ color: "#36404a", metalness: 0.4, roughness: 0.2 }),
      basic: new MeshBasicMaterial({ toneMapped: false }),
      glassShell: new ShaderMaterial({
        uniforms: { uColor: { value: new Color("#dfe9ff") }, uOpacity: { value: 1 } },
        vertexShader: glassVertex,
        fragmentShader: glassFragment,
        transparent: true,
        depthWrite: false,
      }),
      globeMat: new LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.06, depthWrite: false }),
      glowMat: new MeshBasicMaterial({ map: glow, transparent: true, depthWrite: false, blending: AdditiveBlending, opacity: 0.55 }),
      ringMats: ENV_LAYERS.map((l) => new MeshBasicMaterial({ color: l.color, transparent: true, toneMapped: false, depthWrite: false })),
      haloMats: ENV_LAYERS.map(
        (l) => new MeshBasicMaterial({ color: l.color, transparent: true, toneMapped: false, depthWrite: false, blending: AdditiveBlending }),
      ),
      fragLinkMat: new LineBasicMaterial({ vertexColors: true, transparent: true, blending: AdditiveBlending, depthWrite: false }),
      stLinkMats: ENV_STATIONS.map(
        (s) => new LineBasicMaterial({ color: ENV_LAYERS[s.layer].color, transparent: true, opacity: 0, depthWrite: false }),
      ),
      pathMat: new LineDashedMaterial({ color: ORANGE, dashSize: 0.2, gapSize: 0.13, transparent: true, opacity: 0 }),
      envMat: new LineDashedMaterial({ color: "#ffffff", dashSize: 0.12, gapSize: 0.22, transparent: true, opacity: 0.18 }),
      pedestalMat: new LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.25 }),
      glyphEdge: new LineBasicMaterial({ color: ORANGE }),
    };
  }, []);

  // линии, геометрия которых пересчитывается каждый кадр
  const lines = useMemo(() => {
    const fragLinks = new BufferGeometry();
    const n = ENV_LAYERS.length * LINKS_PER_RING * 2;
    fragLinks.setAttribute("position", new BufferAttribute(new Float32Array(n * 3), 3));
    fragLinks.setAttribute("color", new BufferAttribute(new Float32Array(n * 3), 3));
    const fragLinkObj = new LineSegments(fragLinks, res.fragLinkMat);
    fragLinkObj.frustumCulled = false;

    const stLinks = ENV_STATIONS.map((_, i) => {
      const g = new BufferGeometry();
      g.setAttribute("position", new BufferAttribute(new Float32Array(CURVE_PTS * 3), 3));
      const l = new Line(g, res.stLinkMats[i]);
      l.frustumCulled = false;
      return l;
    });

    // маршрут деталей: дуга производство → логистика → площадка + отводы к станциям
    const prod = ENV_STATIONS.find((s) => s.key === "prod")!;
    const site = ENV_STATIONS.find((s) => s.key === "site")!;
    const arc = circlePoints(PATH_R, 0.03, prod.angle, site.angle, 80);
    const spurs: Vector3[] = [];
    for (const key of ["prod", "log", "site"]) {
      const a = ENV_STATIONS.find((s) => s.key === key)!.angle;
      spurs.push(stationPos(a, PATH_R).setY(0.03), stationPos(a, ST_R - 1.05).setY(0.03));
    }
    const pathLine = new Line(new BufferGeometry().setFromPoints(arc), res.pathMat);
    pathLine.computeLineDistances();
    const spurLine = new LineSegments(new BufferGeometry().setFromPoints(spurs), res.pathMat);
    spurLine.computeLineDistances();

    const envLine = new Line(new BufferGeometry().setFromPoints(circlePoints(ENV_R, 0.02, 0, Math.PI * 2, 220)), res.envMat);
    envLine.computeLineDistances();
    const pedestal = new Line(new BufferGeometry().setFromPoints(circlePoints(SR + 0.25, 0.02)), res.pedestalMat);
    const globe = new LineSegments(res.globe, res.globeMat);

    return { fragLinks, fragLinkObj, stLinks, pathLine, spurLine, arc, envLine, pedestal, globe };
  }, [res]);

  useEffect(
    () => () => {
      Object.values(res).forEach((v) => {
        if (Array.isArray(v)) v.forEach((m) => m.dispose());
        else if (v && typeof (v as { dispose?: () => void }).dispose === "function") (v as { dispose: () => void }).dispose();
      });
      lines.fragLinks.dispose();
      lines.stLinks.forEach((l) => l.geometry.dispose());
      [lines.pathLine, lines.spurLine, lines.envLine, lines.pedestal].forEach((l) => l.geometry.dispose());
    },
    [res, lines],
  );

  const fragRef = useRef<Group>(null);
  const panelsRef = useRef<InstancedMesh>(null);
  const membersRef = useRef<InstancedMesh>(null);
  const ringRefs = useRef<(Group | null)[]>([]);
  const nodesRef = useRef<InstancedMesh>(null);
  const particlesRef = useRef<InstancedMesh>(null);
  const stationRefs = useRef<(Group | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glyphRefs = useRef<(Group | null)[]>([]);
  const heroTagRef = useRef<HTMLDivElement>(null);
  const glyphTagRef = useRef<HTMLDivElement>(null);
  const envTagRef = useRef<HTMLDivElement>(null);

  // опорные точки связей «слой → фрагмент»
  const fragAnchors = useMemo(
    () =>
      ENV_LAYERS.map((_, i) =>
        Array.from({ length: LINKS_PER_RING }, (_, k) => fragPoint(0.1 + hash01(i * 17 + k) * 0.8, 0.1 + hash01(i * 31 + k * 7) * 0.8, 0.02)),
      ),
    [],
  );

  useLayoutEffect(() => {
    const nodes = nodesRef.current;
    if (nodes) for (let i = 0; i < nodes.count; i++) nodes.setColorAt(i, new Color(0, 0, 0));
    const parts = particlesRef.current;
    if (parts) for (let i = 0; i < parts.count; i++) parts.setColorAt(i, new Color(0, 0, 0));
    const panels = panelsRef.current;
    if (panels) for (let i = 0; i < panels.count; i++) panels.setColorAt(i, new Color("#ffffff"));
  }, []);

  const pRef = useRef(reduced ? ENV_KEYFRAMES[envStepAt(progress.get())] : progress.get());
  const tmp = useMemo(
    () => ({
      m: new Matrix4(),
      q: new Quaternion(),
      v: new Vector3(),
      v2: new Vector3(),
      s: new Vector3(),
      col: new Color(),
      white: new Color("#ffffff"),
      heroCol: new Color("#ffb38a"),
      target: new Vector3(),
      curve: new QuadraticBezierCurve3(new Vector3(), new Vector3(), new Vector3()),
      ringY: ENV_LAYERS.map(() => 0),
      ringR: ENV_LAYERS.map(() => SR),
      layerCols: ENV_LAYERS.map((l) => new Color(l.color)),
      stPos: ENV_STATIONS.map((s) => stationPos(s.angle)),
    }),
    [],
  );

  useFrame((state, dt) => {
    const raw = progress.get();
    const goal = reduced ? ENV_KEYFRAMES[envStepAt(raw)] : raw;
    pRef.current += (goal - pRef.current) * (reduced ? 1 : 1 - Math.exp(-Math.min(dt, 0.1) * 4.5));
    const p = pRef.current;
    const time = reduced ? 0 : state.clock.elapsedTime;

    // ── камера ──
    const cam = cameraAt(p);
    const aspect = size.width / size.height;
    const fit = narrow ? Math.max(1, 1 / aspect) : Math.max(1, 1.6 / aspect);
    const az = cam.az + (reduced ? 0 : Math.sin(time * 0.15) * 0.025);
    const d = cam.d * fit;
    tmp.target.set(cam.t[0], cam.t[1], cam.t[2]);
    camera.position.set(
      tmp.target.x + Math.sin(az) * Math.cos(cam.el) * d,
      tmp.target.y + Math.sin(cam.el) * d,
      tmp.target.z + Math.cos(az) * Math.cos(cam.el) * d,
    );
    camera.lookAt(tmp.target);
    if (narrow) camera.setViewOffset(size.width, size.height, 0, size.height * 0.13, size.width, size.height);
    else camera.setViewOffset(size.width, size.height, -size.width * 0.17, 0, size.width, size.height);

    const selOf = (layers: number[] | number) =>
      selected === null ? 1 : (Array.isArray(layers) ? layers.includes(selected) : layers === selected) ? 1 : 0.14;

    // ── фрагмент: панели собираются, за ними проявляется подсистема ──
    const fg = fragRef.current;
    if (fg) {
      fg.position.copy(SC);
      fg.rotation.y = -0.5 + p * 1.15 + (reduced ? 0 : Math.sin(time * 0.2) * 0.04);
      fg.updateMatrixWorld();
    }
    const geoBuild = smooth(-0.01, 0.1, p);
    const subBuild = smooth(0.13, 0.24, p);
    const heroOn = smooth(0.28, 0.34, p);
    const panels = panelsRef.current;
    if (panels) {
      frag.panels.forEach((pn, i) => {
        const local = easeOut(geoBuild * 1.7 - pn.order * 0.9);
        tmp.v.copy(pn.pos).addScaledVector(pn.n, (1 - local) * 0.5);
        tmp.s.set(pn.w * Math.max(local, 0.001), pn.h * Math.max(local, 0.001), 0.022);
        tmp.m.compose(tmp.v, pn.quat, tmp.s);
        panels.setMatrixAt(i, tmp.m);
        if (pn.hero) panels.setColorAt(i, tmp.col.copy(tmp.white).lerp(tmp.heroCol, heroOn));
      });
      panels.instanceMatrix.needsUpdate = true;
      if (panels.instanceColor) panels.instanceColor.needsUpdate = true;
    }
    const members = membersRef.current;
    if (members) {
      frag.members.forEach((mb, i) => {
        const local = easeOut(subBuild * 1.6 - mb.order * 0.6);
        tmp.v2.copy(mb.b).sub(mb.a).multiplyScalar(Math.max(local, 0.002)).add(mb.a);
        members.setMatrixAt(i, segMatrix(mb.a, tmp.v2, mb.ref, mb.t1 * Math.min(1, local * 3), mb.t2 * Math.min(1, local * 3), tmp.m));
      });
      members.instanceMatrix.needsUpdate = true;
    }
    if (heroTagRef.current) {
      heroTagRef.current.style.opacity = String(heroOn);
      heroTagRef.current.style.visibility = heroOn > 0.01 ? "visible" : "hidden";
    }

    // ── слои: проявляются, раздвигаются, наполняются данными ──
    const amounts = ENV_LAYERS.map((_, i) => layerAmount(i, p));
    const total = amounts.reduce((a, b) => a + b, 0);
    let cum = 0;
    const nodes = nodesRef.current;
    const fragPos = lines.fragLinks.attributes.position as BufferAttribute;
    const fragCol = lines.fragLinks.attributes.color as BufferAttribute;
    ENV_LAYERS.forEach((layer, i) => {
      const a = amounts[i];
      const y = -((cum + a / 2 - total / 2) * RING_GAP);
      cum += a;
      const ry = reduced ? y : tmp.ringY[i] + (y - tmp.ringY[i]) * (1 - Math.exp(-Math.min(dt, 0.1) * 6));
      tmp.ringY[i] = ry;
      const r = (Math.sqrt(Math.max(SR * SR - ry * ry, 0.4)) + 0.2) * (0.35 + 0.65 * a);
      tmp.ringR[i] = r;
      const sel = selOf(i);
      const focus = selected === i ? 1.6 : 1;

      const g = ringRefs.current[i];
      if (g) {
        g.position.set(SC.x, SC.y + ry, SC.z);
        g.scale.setScalar(Math.max(r, 0.001));
        g.visible = a > 0.005;
      }
      res.ringMats[i].opacity = a * sel;
      res.haloMats[i].opacity = a * 0.2 * sel * focus;

      const fill = layerFill(i, p) * a;
      const shown = Math.round(fill * NODES);
      const rot = (i % 2 ? 1 : -1) * p * 2.4 + time * 0.03 * (i % 2 ? 1 : -1) + i;
      for (let j = 0; j < NODES; j++) {
        const ang = rot + (j / NODES) * Math.PI * 2;
        tmp.v.set(SC.x + Math.cos(ang) * r, SC.y + ry + Math.sin(j * 1.7) * 0.03, SC.z + Math.sin(ang) * r);
        const sc = j < shown ? 0.05 * (selected === i ? 1.35 : 1) : 0;
        tmp.m.compose(tmp.v, tmp.q.identity(), tmp.s.setScalar(Math.max(sc, 1e-4)));
        nodes?.setMatrixAt(i * NODES + j, tmp.m);
        nodes?.setColorAt(i * NODES + j, tmp.col.copy(tmp.layerCols[i]).multiplyScalar(sel));

        if (j % Math.floor(NODES / LINKS_PER_RING) === 0) {
          const k = j / Math.floor(NODES / LINKS_PER_RING);
          if (k < LINKS_PER_RING) {
            const idx = (i * LINKS_PER_RING + k) * 2;
            const to = tmp.v2.copy(fragAnchors[i][k]);
            if (fg) to.applyMatrix4(fg.matrixWorld);
            const on = j < shown ? fill * 0.55 * sel * (selected === i ? 1.6 : 1) : 0;
            fragPos.setXYZ(idx, tmp.v.x, tmp.v.y, tmp.v.z);
            fragPos.setXYZ(idx + 1, to.x, to.y, to.z);
            tmp.col.copy(tmp.layerCols[i]).multiplyScalar(on);
            fragCol.setXYZ(idx, tmp.col.r, tmp.col.g, tmp.col.b);
            fragCol.setXYZ(idx + 1, tmp.col.r * 0.25, tmp.col.g * 0.25, tmp.col.b * 0.25);
          }
        }
      }
    });
    if (nodes) {
      nodes.instanceMatrix.needsUpdate = true;
      if (nodes.instanceColor) nodes.instanceColor.needsUpdate = true;
    }
    fragPos.needsUpdate = true;
    fragCol.needsUpdate = true;

    // ── участники и связи с моделью ──
    const parts = particlesRef.current;
    ENV_STATIONS.forEach((st, si) => {
      const amt = stationAmount(st, p);
      const g = stationRefs.current[si];
      if (g) {
        const e = easeOut(amt);
        g.scale.setScalar(Math.max(e, 0.001));
        g.position.copy(tmp.stPos[si]).setY((1 - e) * -0.6);
        g.visible = amt > 0.005;
      }
      const sel = selOf(st.links);
      const label = labelRefs.current[si];
      if (label) {
        label.style.opacity = String(amt * (selected === null ? 1 : sel > 0.5 ? 1 : 0.28));
        label.style.visibility = amt > 0.01 ? "visible" : "hidden";
        label.dataset.on = selected !== null && sel > 0.5 ? "1" : "0";
      }

      // кривая от кольца основного слоя к станции
      const li = st.layer;
      const dir = tmp.v.set(tmp.stPos[si].x, 0, tmp.stPos[si].z).normalize();
      const start = tmp.curve.v0.set(SC.x + dir.x * tmp.ringR[li], SC.y + tmp.ringY[li], SC.z + dir.z * tmp.ringR[li]);
      const end = tmp.curve.v2.copy(tmp.stPos[si]).setY(1.15);
      tmp.curve.v1.addVectors(start, end).multiplyScalar(0.5).setY(Math.max(start.y, end.y) + 1.4);
      const draw = st.at === 0 ? smooth(0.01, 0.08, p) : smooth(st.at + 0.03, st.at + 0.1, p);
      const line = lines.stLinks[si];
      const pos = line.geometry.attributes.position as BufferAttribute;
      for (let k = 0; k < CURVE_PTS; k++) {
        tmp.curve.getPoint(k / (CURVE_PTS - 1), tmp.v2);
        pos.setXYZ(k, tmp.v2.x, tmp.v2.y, tmp.v2.z);
      }
      pos.needsUpdate = true;
      line.geometry.setDrawRange(0, Math.max(0, Math.ceil(draw * CURVE_PTS)));
      res.stLinkMats[si].opacity = (0.25 + 0.5 * draw) * sel * (p > 0.84 ? 1.25 : 1);

      // данные по связи в обе стороны: цвет слоя — к участнику, белые — обратно в модель
      if (parts) {
        for (let k = 0; k < 4; k++) {
          const back = k >= 2;
          const u = frac(p * 6 + (k % 2) * 0.5 + si * 0.13 + (back ? 0.25 : 0));
          tmp.curve.getPoint(back ? 1 - u : u, tmp.v2);
          const sc = draw > 0.97 ? 0.065 : 0;
          tmp.m.compose(tmp.v2, tmp.q.identity(), tmp.s.setScalar(Math.max(sc, 1e-4)));
          parts.setMatrixAt(si * 4 + k, tmp.m);
          tmp.col.copy(back ? tmp.white : tmp.layerCols[li]).multiplyScalar(sel);
          parts.setColorAt(si * 4 + k, tmp.col);
        }
      }
    });
    if (parts) {
      parts.instanceMatrix.needsUpdate = true;
      if (parts.instanceColor) parts.instanceColor.needsUpdate = true;
    }

    // ── маршрут деталей: производство → логистика → площадка ──
    const pathAmt = smooth(0.57, 0.63, p);
    res.pathMat.opacity = pathAmt * (selected === null || selected === 4 ? 0.9 : 0.2);
    const arc = lines.arc;
    glyphRefs.current.forEach((g, k) => {
      if (!g) return;
      const local = clamp01((p - 0.6) / 0.2 - k * 0.22);
      const vis = local > 0 && local < 1;
      g.visible = vis && pathAmt > 0.5;
      if (!vis) return;
      const f = local * (arc.length - 1);
      const i0 = Math.floor(f);
      const i1 = Math.min(arc.length - 1, i0 + 1);
      g.position.lerpVectors(arc[i0], arc[i1], f - i0).setY(0.22);
      g.lookAt(arc[i1].x, 0.22, arc[i1].z);
    });
    if (glyphTagRef.current) {
      const local = clamp01((p - 0.6) / 0.2);
      const o = local > 0.02 && local < 0.98 ? 1 : 0;
      glyphTagRef.current.style.opacity = String(o);
      glyphTagRef.current.style.visibility = o ? "visible" : "hidden";
    }

    // ── общая цифровая среда шире сферы ──
    const finale = smooth(0.84, 0.93, p);
    res.envMat.opacity = 0.14 + finale * 0.36;
    res.glassShell.uniforms.uOpacity.value = 0.85 + finale * 0.3;
    if (envTagRef.current) {
      envTagRef.current.style.opacity = String(finale);
      envTagRef.current.style.visibility = finale > 0.01 ? "visible" : "hidden";
    }
  });

  const geos = useMemo(() => ({ box: res.box, cyl: res.cyl, prism: res.prism, edges: res.edges }), [res]);
  const mats = useMemo(
    () => ({ light: res.light, dark: res.dark, glass: res.glass, orange: res.orange, screen: res.basic }),
    [res],
  );
  const heroLocal = frag.heroPanel.pos.clone().addScaledVector(frag.heroPanel.n, 0.04);

  return (
    <>
      {/* сфера-модель */}
      <mesh geometry={res.sphere} material={res.glassShell} position={SC} renderOrder={10} />
      <primitive object={lines.globe} position={SC} />
      <primitive object={lines.pedestal} />
      <mesh geometry={res.plane} material={res.glowMat} rotation={[-HALF_PI, 0, 0]} position={[0, 0.015, 0]} scale={[7, 7, 1]} />

      <group ref={fragRef}>
        <instancedMesh ref={panelsRef} args={[res.box, res.panel, frag.panels.length]} castShadow frustumCulled={false} />
        <instancedMesh ref={membersRef} args={[res.box, res.orange, frag.members.length]} castShadow frustumCulled={false} />
        <Html position={heroLocal} zIndexRange={[6, 0]} style={{ pointerEvents: "none" }}>
          <div ref={heroTagRef} className="en-tag">P-042</div>
        </Html>
      </group>

      {ENV_LAYERS.map((_, i) => (
        <group key={i} ref={(g) => void (ringRefs.current[i] = g)}>
          <mesh geometry={res.torus} material={res.ringMats[i]} rotation={[HALF_PI, 0, 0]} />
          <mesh geometry={res.halo} material={res.haloMats[i]} rotation={[HALF_PI, 0, 0]} />
        </group>
      ))}
      <instancedMesh ref={nodesRef} args={[res.box, res.basic, ENV_LAYERS.length * NODES]} frustumCulled={false} />
      <primitive object={lines.fragLinkObj} />

      {ENV_STATIONS.map((st, i) => (
        <Station
          key={st.key}
          st={st}
          groupRef={(g) => void (stationRefs.current[i] = g)}
          labelRef={(el) => void (labelRefs.current[i] = el)}
          mats={mats}
          geos={geos}
        />
      ))}
      {lines.stLinks.map((l, i) => (
        <primitive key={i} object={l} />
      ))}
      <instancedMesh ref={particlesRef} args={[res.ico, res.basic, ENV_STATIONS.length * 4]} frustumCulled={false} />

      <primitive object={lines.pathLine} />
      <primitive object={lines.spurLine} />
      {[0, 1, 2].map((k) => (
        <group key={k} ref={(g) => void (glyphRefs.current[k] = g)} visible={false}>
          <mesh geometry={res.box} material={res.light} scale={[0.42, 0.28, 0.05]} castShadow>
            <lineSegments geometry={res.edges} material={res.glyphEdge} />
          </mesh>
          {k === 0 && (
            <Html position={[0, 0.32, 0]} zIndexRange={[6, 0]} style={{ pointerEvents: "none" }}>
              <div ref={glyphTagRef} className="en-tag en-tag--move">P-042 · K-03</div>
            </Html>
          )}
        </group>
      ))}

      <primitive object={lines.envLine} />
      <Html position={[Math.sin(-1.27) * ENV_R, 0.05, Math.cos(-1.27) * ENV_R]} zIndexRange={[6, 0]} style={{ pointerEvents: "none" }}>
        <div ref={envTagRef} className="en-env">Общая цифровая среда</div>
      </Html>

      <mesh rotation={[-HALF_PI, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <shadowMaterial transparent opacity={0.4} />
      </mesh>
    </>
  );
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Environment scene failed", error, info);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function EnvironmentScene({ active, ...props }: SceneProps) {
  return (
    <SceneBoundary>
      <Canvas
        frameloop={active ? "always" : "never"}
        shadows
        dpr={[1, 1.75]}
        camera={{ fov: 34, near: 0.1, far: 160, position: [0, 8, 18] }}
        gl={{ antialias: true, alpha: true }}
        style={{ touchAction: "pan-y" }}
      >
        <fog attach="fog" args={["#101010", 28, 70]} />
        <ambientLight intensity={0.35} />
        <hemisphereLight args={["#ffffff", "#141414", 0.35]} />
        <directionalLight
          position={[7, 13, 9]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-camera-near={1}
          shadow-camera-far={40}
          shadow-bias={-0.0004}
        />
        <directionalLight position={[-9, 5, -7]} intensity={0.55} color="#ff8a4c" />
        <Environment resolution={128}>
          <Lightformer form="rect" position={[0, 7, 9]} scale={[16, 5, 1]} intensity={1.8} />
          <Lightformer form="rect" position={[-10, 3, 2]} scale={[4, 10, 1]} intensity={0.9} />
          <Lightformer form="rect" position={[9, 2, -4]} scale={[3, 8, 1]} intensity={1.1} color="#ff7a33" />
        </Environment>

        <World {...props} />

        <Grid
          position={[0, 0, 0]}
          args={[90, 90]}
          cellSize={0.5}
          cellThickness={0.6}
          cellColor="#212121"
          sectionSize={3}
          sectionThickness={1}
          sectionColor="#333333"
          fadeDistance={55}
          fadeStrength={1.6}
          infiniteGrid
        />
      </Canvas>
    </SceneBoundary>
  );
}
