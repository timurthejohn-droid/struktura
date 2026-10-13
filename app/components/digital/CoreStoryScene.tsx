"use client";

import { Component, useEffect, useLayoutEffect, useMemo, useRef, type ErrorInfo, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  ConeGeometry,
  HalfFloatType,
  Color,
  DoubleSide,
  IcosahedronGeometry,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  QuadraticBezierCurve3,
  Quaternion,
  ShaderMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderTarget,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import type { MotionValue } from "framer-motion";
import {
  CORE_CONCEPTS,
  CORE_KEYFRAMES,
  CORE_LAYERS,
  CORE_STARTS,
  CORE_STATIONS,
  arrayAmount,
  chapterReset,
  conceptAmount,
  coreStepAt,
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
import { makeRadialGlow } from "./textures";

type SceneProps = {
  progress: MotionValue<number>;
  reduced: boolean;
  active: boolean;
  selected: number | null;
  /**
   * Упрощённая схема для классической страницы: камера без дрейфа, форма и кольца не вращаются,
   * без пост-обработки свечения (мерцала на тонких линиях), без мелких точек и второстепенных деталей.
   */
  still?: boolean;
};
/** Общие параметры кадра для пост-обработки (сила свечения меняется по истории). */
type Fx = { bloom: number };

/*
 * Схема эскиза STRUKTURA_Digital_Core в объёме.
 * Плоская SVG-раскладка (1000 × 530, ядро в точке 500, 246) ложится на наклонную плоскость
 * через центр ядра: участники «выше» в эскизе уходят вглубь, «ниже» — выходят к зрителю.
 */
const ORANGE = "#ff5a00";
const SCAN_BLUE = "#6cc4ea";
const GREEN = "#40cfae";
const R = 2.15; // ядро
const K = R / 174; // 174 px — радиус ядра в эскизе
const toScheme = (x: number, y: number, out = new Vector3()) => out.set((x - 500) * K, (246 - y) * K * 0.5, (y - 246) * K * 1.5);
const toUpright = (x: number, y: number, z: number) => new Vector3((x - 500) * K, (246 - y) * K, z);

// Слои — стопка колец внутри ядра (как в эскизе: шесть эллипсов от y=184 до y=304)
const RING_Y = CORE_LAYERS.map((_, i) => (246 - (184 + 24 * i)) * K);
const RING_R = 130 * K * 1.08;
const NODES = 24;
const CURVE_PTS = 40;

// Геометрия — абстрактная диагональная сетка формы (не панели)
const FU = 18;
const FV = 11;
const FORM_H = 2.5;

// Подсистема — инженерный хребет: стойка через все слои, рёбра к форме, раскосы
const RIBS = 4;
const SPINE_H = 3.7;

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const frac = (x: number) => x - Math.floor(x);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Точка формы: u — по кругу, v — по высоте; twist и bulge отличают «модель компании» от модели объекта. */
function formPoint(u: number, v: number, twist: number, bulge: number, out: Vector3) {
  const th = u * Math.PI * 2 + twist * (v - 0.5);
  const r = 0.92 + bulge * Math.sin(v * Math.PI) + 0.06 * Math.sin(u * Math.PI * 6 + v * 3);
  return out.set(Math.cos(th) * r, (v - 0.5) * FORM_H, Math.sin(th) * r);
}

const _x = new Vector3();
const _y = new Vector3();
const _z = new Vector3();
const _mid = new Vector3();
const _s = new Vector3();
const UP = new Vector3(0, 1, 0);
function segMatrix(a: Vector3, b: Vector3, t: number, out: Matrix4) {
  _x.subVectors(b, a);
  const len = Math.max(_x.length(), 1e-4);
  _x.divideScalar(len);
  _z.copy(UP).addScaledVector(_x, -UP.dot(_x));
  if (_z.lengthSq() < 1e-6) _z.set(0, 0, 1);
  _z.normalize();
  _y.crossVectors(_z, _x);
  _mid.addVectors(a, b).multiplyScalar(0.5);
  return out.makeBasis(_x, _y, _z).scale(_s.set(len, t, t)).setPosition(_mid);
}

// ── ядро: стекло с френелевским контуром ──
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
    const y = Math.sin(lat) * R;
    const r = Math.cos(lat) * R;
    for (let i = 0; i < seg; i++) {
      const a0 = (i / seg) * Math.PI * 2;
      const a1 = ((i + 1) / seg) * Math.PI * 2;
      pts.push(Math.cos(a0) * r, y, Math.sin(a0) * r, Math.cos(a1) * r, y, Math.sin(a1) * r);
    }
  }
  for (let m = 0; m < 10; m++) {
    const lon = (m / 10) * Math.PI * 2;
    for (let i = 0; i < seg / 2; i++) {
      const b0 = -Math.PI / 2 + (i / (seg / 2)) * Math.PI;
      const b1 = -Math.PI / 2 + ((i + 1) / (seg / 2)) * Math.PI;
      pts.push(
        Math.cos(b0) * Math.cos(lon) * R, Math.sin(b0) * R, Math.cos(b0) * Math.sin(lon) * R,
        Math.cos(b1) * Math.cos(lon) * R, Math.sin(b1) * R, Math.cos(b1) * Math.sin(lon) * R,
      );
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array(pts), 3));
  return g;
}

/** Путь эскиза из квадратичных кривых SVG → точки на схеме. */
function schemePath(segs: [number, number, number, number, number, number][], lift = 0) {
  const pts: Vector3[] = [];
  segs.forEach(([x0, y0, cx, cy, x1, y1], si) => {
    const c = new QuadraticBezierCurve3(toScheme(x0, y0), toScheme(cx, cy), toScheme(x1, y1));
    c.getPoints(30).forEach((p, i) => {
      if (si > 0 && i === 0) return;
      pts.push(p.setY(p.y + lift));
    });
  });
  return pts;
}

// ── камера: ключевые кадры в серединах сцен ──
type Cam = { az: number; el: number; d: number; ty: number };
const CAMS: Cam[] = [
  { az: 0, el: 0.3, d: 15.5, ty: 0 }, // 3D-геометрия
  { az: -0.12, el: 0.32, d: 16.5, ty: 0 }, // алгоритмы
  { az: 0.08, el: 0.34, d: 17.5, ty: -0.2 }, // исполнение
  { az: 0, el: 0.36, d: 18, ty: -0.1 }, // исходные данные
  { az: 0.28, el: 0.22, d: 12.5, ty: 0.1 }, // подсистема крупнее
  { az: 0.12, el: 0.32, d: 16.5, ty: 0 }, // проект
  { az: -0.08, el: 0.36, d: 18, ty: -0.2 }, // производства
  { az: 0, el: 0.38, d: 18, ty: -0.35 }, // площадка
  { az: 0, el: 0.26, d: 12.5, ty: 0 }, // финал
];
const CAM_AT = CORE_STARTS.map((s, i) => (s + (CORE_STARTS[i + 1] ?? 1)) / 2);
function cameraAt(p: number): Cam {
  let i = 0;
  while (i < CAM_AT.length - 2 && p >= CAM_AT[i + 1]) i++;
  const k = sm(CAM_AT[i], CAM_AT[i + 1], p);
  const a = CAMS[i];
  const b = CAMS[i + 1];
  return { az: mix(a.az, b.az, k), el: mix(a.el, b.el, k), d: mix(a.d, b.d, k), ty: mix(a.ty, b.ty, k) };
}

// Что нарастает на подсистеме: [уровень кольца, ребро | -1 — стойка], момент появления
const SUB_NOTES = [
  { text: "Узлы крепления", level: 1, rib: 0, at: 0.5 },
  { text: "Расчёт нагрузок", level: -1, rib: -1, at: 0.515 },
  { text: "Решения для монтажа", level: 5, rib: 3, at: 0.548 },
];
// Деталировка — «лупа» на одном узле с выноской-чертежом
const DETAIL = { level: 3, rib: 2, at: 0.53 };
// Очерёдность сборки: снизу вверх
const ASSEMBLY = [
  { level: 5, rib: 1, at: 0.545 },
  { level: 3, rib: 1, at: 0.552 },
  { level: 1, rib: 1, at: 0.559 },
];
const SUB_OUT = (p: number) => 1 - sm(0.565, 0.585, p);
const MEASURE = [
  { u: 0.08, v: 0.32 },
  { u: 0.2, v: 0.62 },
  { u: 0.92, v: 0.45 },
];

type Node = {
  key: string;
  name: string;
  sub: string;
  layer: number;
  links: number[];
  home: Vector3;
  amount: (p: number) => number;
  input?: boolean;
  station: boolean;
};

const setTag = (el: HTMLElement | null, o: number) => {
  if (!el) return;
  el.style.opacity = String(o);
  el.style.visibility = o > 0.01 ? "visible" : "hidden";
};

// ── пост-обработка: свечение колец, потоков и хребта ──
function Effects({ fx }: { fx: Fx }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const { composer, bloom } = useMemo(() => {
    const rt = new WebGLRenderTarget(1, 1, { type: HalfFloatType, samples: 4 });
    const c = new EffectComposer(gl, rt);
    c.addPass(new RenderPass(scene, camera));
    const b = new UnrealBloomPass(new Vector2(256, 256), 0.45, 0.4, 0.55);
    c.addPass(b);
    c.addPass(new OutputPass());
    return { composer: c, bloom: b };
  }, [gl, scene, camera]);
  useEffect(() => {
    composer.setPixelRatio(gl.getPixelRatio());
    composer.setSize(size.width, size.height);
  }, [composer, gl, size]);
  useEffect(() => () => composer.dispose(), [composer]);
  useFrame((_, dt) => {
    bloom.strength = fx.bloom;
    composer.render(dt);
  }, 1);
  return null;
}

function World({ progress, reduced, selected, fx, still = false }: Omit<SceneProps, "active"> & { fx: Fx }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const narrow = size.width < 640 || size.width / size.height < 0.9;

  // все участники схемы: возможности первой главы и участники объекта
  const nodes = useMemo<Node[]>(
    () => [
      ...CORE_CONCEPTS.map((c, i) => ({
        key: `c${i}`,
        name: c.name,
        sub: c.sub,
        layer: c.layer,
        links: [c.layer],
        home: toScheme(c.x, c.y),
        amount: (p: number) => conceptAmount(c, p),
        station: false,
      })),
      ...CORE_STATIONS.map((s) => ({
        key: s.key,
        name: s.name,
        sub: s.role,
        layer: s.layer,
        links: s.links,
        home: toScheme(s.x, s.y),
        amount: (p: number) => stationAmount(s, p),
        input: s.input,
        station: true,
      })),
    ],
    [],
  );

  // сегменты формы: кольца по высоте и диагонали — по порядку снизу вверх
  const formSegs = useMemo(() => {
    const segs: [number, number, number, number][] = [];
    for (let v = 0; v <= FV; v++) for (let u = 0; u < FU; u++) segs.push([u, v, u + 1, v]);
    for (let v = 0; v < FV; v++)
      for (let u = 0; u < FU; u++) {
        segs.push([u, v, u + 1, v + 1]);
        segs.push([u + 1, v, u, v + 1]);
      }
    return segs.sort((a, b) => a[1] + a[3] - (b[1] + b[3]));
  }, []);

  const res = useMemo(() => {
    const glow = makeRadialGlow();
    const formGeo = new BufferGeometry();
    formGeo.setAttribute("position", new BufferAttribute(new Float32Array(formSegs.length * 6), 3));
    // оболочка формы — та же сетка вершин, треугольниками: даёт объём
    const skinGeo = new BufferGeometry();
    skinGeo.setAttribute("position", new BufferAttribute(new Float32Array((FU + 1) * (FV + 1) * 3), 3));
    const idx: number[] = [];
    for (let u = 0; u < FU; u++)
      for (let v = 0; v < FV; v++) {
        const a = u * (FV + 1) + v;
        const b = (u + 1) * (FV + 1) + v;
        idx.push(a, b, a + 1, b, b + 1, a + 1);
      }
    skinGeo.setIndex(idx);
    return {
      glow,
      formGeo,
      skinGeo,
      cone: new ConeGeometry(0.075, 0.24, 12),
      box: new BoxGeometry(1, 1, 1),
      ico: new IcosahedronGeometry(1, 1),
      diamond: new OctahedronGeometry(1, 0),
      sphere: new SphereGeometry(R, 64, 48),
      torus: new TorusGeometry(1, 0.006, 6, 180),
      halo: new TorusGeometry(1, 0.03, 8, 180),
      marker: new TorusGeometry(1, 0.07, 8, 48),
      disc: new CircleGeometry(1, 64),
      globe: globeLines(),
      formMat: new LineBasicMaterial({ color: "#ece6da", transparent: true, opacity: 0.4, depthWrite: false }),
      skinMat: new ShaderMaterial({
        uniforms: { uColor: { value: new Color("#f3d9c4") }, uOpacity: { value: 0 } },
        vertexShader: glassVertex,
        fragmentShader: glassFragment,
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
      }),
      arrowMat: new MeshBasicMaterial({ color: "#ffb340", toneMapped: false, transparent: true, opacity: 0 }),
      lensMat: new MeshBasicMaterial({ color: "#ffffff", toneMapped: false, transparent: true, opacity: 0 }),
      waveMat: new MeshBasicMaterial({ color: "#ffd2b8", toneMapped: false, transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending }),
      orbitMat: new LineDashedMaterial({ color: "#ffffff", dashSize: 0.08, gapSize: 0.22, transparent: true, opacity: 0.07 }),
      pointMat: new MeshBasicMaterial({ toneMapped: false, transparent: true }),
      basic: new MeshBasicMaterial({ toneMapped: false }),
      spine: new MeshStandardMaterial({ color: ORANGE, metalness: 0.4, roughness: 0.4, emissive: new Color(ORANGE), emissiveIntensity: 0.25, transparent: true }),
      joint: new MeshStandardMaterial({ color: "#ffd2b8", metalness: 0.5, roughness: 0.3, emissive: new Color("#ff7a33"), emissiveIntensity: 0.7, transparent: true }),
      tile: new MeshBasicMaterial({ toneMapped: false, transparent: true }),
      nodeMats: CORE_LAYERS.map((l) => new MeshBasicMaterial({ color: l.color, toneMapped: false, transparent: true })),
      linkMats: [] as LineBasicMaterial[],
      ringMats: CORE_LAYERS.map((l) => new MeshBasicMaterial({ color: l.color, transparent: true, toneMapped: false, depthWrite: false })),
      haloMats: CORE_LAYERS.map((l) => new MeshBasicMaterial({ color: l.color, transparent: true, toneMapped: false, depthWrite: false, blending: AdditiveBlending })),
      gridLinkMat: new LineBasicMaterial({ color: CORE_LAYERS[3].color, transparent: true, opacity: 0, depthWrite: false }),
      pathMat: new LineDashedMaterial({ color: ORANGE, dashSize: 0.2, gapSize: 0.12, transparent: true, opacity: 0 }),
      parcelMat: new MeshStandardMaterial({ color: "#e7e3da", emissive: new Color(ORANGE), emissiveIntensity: 0.35 }),
      feedbackMat: new LineBasicMaterial({ color: GREEN, transparent: true, opacity: 0, depthWrite: false }),
      markerMat: new MeshBasicMaterial({ color: GREEN, toneMapped: false, transparent: true, opacity: 0 }),
      scanMat: new MeshBasicMaterial({ color: SCAN_BLUE, transparent: true, opacity: 0, depthWrite: false, side: DoubleSide, blending: AdditiveBlending }),
      scanRimMat: new MeshBasicMaterial({ color: SCAN_BLUE, toneMapped: false, transparent: true, opacity: 0 }),
      envMat: new LineDashedMaterial({ color: "#ffffff", dashSize: 0.14, gapSize: 0.2, transparent: true, opacity: 0.16 }),
      globeMat: new LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.05, depthWrite: false }),
      glassShell: new ShaderMaterial({
        uniforms: { uColor: { value: new Color("#dfe9ff") }, uOpacity: { value: 1 } },
        vertexShader: glassVertex,
        fragmentShader: glassFragment,
        transparent: true,
        depthWrite: false,
      }),
      whiteCore: new MeshBasicMaterial({ color: "#f2efe8", transparent: true, opacity: 0, depthWrite: false, toneMapped: false }),
      coreGlow: new SpriteMaterial({ map: glow, color: "#ffb38a", transparent: true, depthWrite: false, blending: AdditiveBlending, opacity: 0.2 }),
      floorGlow: new MeshBasicMaterial({ map: glow, color: "#ff8a4c", transparent: true, depthWrite: false, blending: AdditiveBlending, opacity: 0.1 }),
    };
  }, [formSegs]);

  // линии, которые строятся один раз или пересчитываются каждый кадр
  const lines = useMemo(() => {
    const form = new LineSegments(res.formGeo, res.formMat);
    form.frustumCulled = false;

    const linkMats = nodes.map((n) => new LineBasicMaterial({ color: CORE_LAYERS[n.layer].color, transparent: true, opacity: 0, depthWrite: false }));
    res.linkMats.push(...linkMats);
    const links = nodes.map((_, i) => {
      const g = new BufferGeometry();
      g.setAttribute("position", new BufferAttribute(new Float32Array(CURVE_PTS * 3), 3));
      const l = new Line(g, linkMats[i]);
      l.frustumCulled = false;
      return l;
    });

    // алгоритмы: поле элементов слева и связь с ядром (как сетка квадратов в эскизе)
    const gridLinkCurve = new QuadraticBezierCurve3(toUpright(262, 240, 1.1), toUpright(300, 205, 1.1), new Vector3(-RING_R, RING_Y[3], 0.4));
    const gridLink = new Line(new BufferGeometry().setFromPoints(gridLinkCurve.getPoints(CURVE_PTS - 1)), res.gridLinkMat);

    // маршрут детали: производства → площадка (путь из эскиза)
    const route = schemePath([
      [856, 280, 940, 355, 874, 380],
      [874, 380, 754, 465, 621, 475],
    ], 0.05);
    const routeLine = new Line(new BufferGeometry().setFromPoints(route), res.pathMat);
    routeLine.computeLineDistances();

    // факт с площадки — обратно в ядро (путь из эскиза, продолжен до ядра)
    const fbPts = schemePath([[500, 445, 335, 445, 332, 300]], 0.05);
    const fbEnd = fbPts[fbPts.length - 1];
    const fbCurve2 = new QuadraticBezierCurve3(fbEnd.clone(), fbEnd.clone().add(new Vector3(0.2, 0.6, -0.3)), new Vector3(-0.9, RING_Y[5], 0.5));
    fbPts.push(...fbCurve2.getPoints(20).slice(1));
    const fbLine = new Line(new BufferGeometry().setFromPoints(fbPts), res.feedbackMat);
    fbLine.frustumCulled = false;

    // граница общей среды — эллипс эскиза (rx 460, ry 220)
    const env: Vector3[] = [];
    for (let i = 0; i <= 200; i++) {
      const a = (i / 200) * Math.PI * 2;
      env.push(toScheme(500 + 460 * Math.cos(a), 246 + 220 * Math.sin(a)));
    }
    const envLine = new Line(new BufferGeometry().setFromPoints(env), res.envMat);
    envLine.computeLineDistances();

    const globe = new LineSegments(res.globe, res.globeMat);
    const glowSprite = new Sprite(res.coreGlow);
    // концентрические контуры схемы внутри границы среды
    const orbits = [0.42, 0.7].map((k) => {
      const pts: Vector3[] = [];
      for (let i = 0; i <= 160; i++) {
        const a = (i / 160) * Math.PI * 2;
        pts.push(toScheme(500 + 460 * k * Math.cos(a), 246 + 220 * k * Math.sin(a)));
      }
      const l = new Line(new BufferGeometry().setFromPoints(pts), res.orbitMat);
      l.computeLineDistances();
      return l;
    });
    const skin = new Mesh(res.skinGeo, res.skinMat);
    skin.frustumCulled = false;
    skin.renderOrder = 2;

    return { form, skin, links, gridLink, gridLinkCurve, orbits, route, routeLine, fbPts, fbLine, envLine, globe, glowSprite };
  }, [res, nodes]);

  useEffect(
    () => () => {
      Object.values(res).forEach((v) => {
        if (Array.isArray(v)) v.forEach((m) => m.dispose());
        else if (v && typeof (v as { dispose?: () => void }).dispose === "function") (v as { dispose: () => void }).dispose();
      });
      lines.links.forEach((l) => l.geometry.dispose());
      [lines.gridLink, lines.routeLine, lines.fbLine, lines.envLine, ...lines.orbits].forEach((l) => l.geometry.dispose());
    },
    [res, lines],
  );

  const pointsRef = useRef<InstancedMesh>(null);
  const columnRef = useRef<Mesh>(null);
  const ribsRef = useRef<InstancedMesh>(null);
  const bracesRef = useRef<InstancedMesh>(null);
  const jointsRef = useRef<InstancedMesh>(null);
  const tilesRef = useRef<InstancedMesh>(null);
  const ringRefs = useRef<(Mesh | null)[]>([]);
  const haloRefs = useRef<(Mesh | null)[]>([]);
  const dotsRef = useRef<InstancedMesh>(null);
  const partsRef = useRef<InstancedMesh>(null);
  const fbPartsRef = useRef<InstancedMesh>(null);
  const anchorRefs = useRef<(Mesh | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardAnchorRefs = useRef<(Mesh | null)[]>([]);
  const noteAnchorRefs = useRef<(Mesh | null)[]>([]);
  const markerRefs = useRef<(Mesh | null)[]>([]);
  const scanRef = useRef<Mesh>(null);
  const scanRimRef = useRef<Mesh>(null);
  const parcelRef = useRef<Mesh>(null);
  const parcelTagRef = useRef<HTMLDivElement>(null);
  const scanTagRef = useRef<HTMLDivElement>(null);
  const fbTagRef = useRef<HTMLDivElement>(null);
  const gridTagRef = useRef<HTMLDivElement>(null);
  const envTagRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const noteRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lensTagRef = useRef<HTMLDivElement>(null);
  const arrowsRef = useRef<InstancedMesh>(null);
  const gridPartsRef = useRef<InstancedMesh>(null);
  const lensRef = useRef<Mesh>(null);
  const asmRefs = useRef<(Mesh | null)[]>([]);
  const asmTagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const popRefs = useRef<(HTMLDivElement | null)[]>([]);
  const waveRef = useRef<Mesh>(null);

  useLayoutEffect(() => {
    for (const mesh of [dotsRef.current, partsRef.current, fbPartsRef.current, pointsRef.current, tilesRef.current, gridPartsRef.current]) {
      if (mesh) for (let i = 0; i < mesh.count; i++) mesh.setColorAt(i, new Color(0, 0, 0));
    }
  }, []);

  // лёгкая реакция камеры на курсор
  const pointer = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const pRef = useRef(reduced ? CORE_KEYFRAMES[coreStepAt(progress.get())] : progress.get());
  const clock = useRef(0);
  const tmp = useMemo(
    () => ({
      m: new Matrix4(),
      q: new Quaternion(),
      v: new Vector3(),
      v2: new Vector3(),
      v3: new Vector3(),
      s: new Vector3(),
      col: new Color(),
      white: new Color("#ffffff"),
      sand: new Color("#ece6da"),
      orange: new Color(ORANGE),
      scan: new Color(SCAN_BLUE),
      green: new Color(GREEN),
      layerCols: CORE_LAYERS.map((l) => new Color(l.color)),
      curve: new QuadraticBezierCurve3(new Vector3(), new Vector3(), new Vector3()),
      nodePos: nodes.map((n) => n.home.clone()),
      ribEnds: Array.from({ length: CORE_LAYERS.length * RIBS }, () => new Vector3()),
      formVerts: Array.from({ length: (FU + 1) * (FV + 1) }, () => new Vector3()),
    }),
    [nodes],
  );

  useFrame((state, dt) => {
    const raw = progress.get();
    const goal = reduced ? CORE_KEYFRAMES[coreStepAt(raw)] : raw;
    // в спокойном режиме большой скачок (смена состояния) применяем сразу —
    // иначе схема пролетает через все промежуточные сцены и подписи мигают
    if (still && Math.abs(goal - pRef.current) > 0.12) pRef.current = goal;
    pRef.current += (goal - pRef.current) * (reduced ? 1 : 1 - Math.exp(-Math.min(dt, 0.1) * 4.5));
    // мелкие точки при вращении «мигают» на границе пикселя — в спокойном режиме делаем их крупнее
    const dot = still ? 1.45 : 1;
    const p = pRef.current;
    const finale = finaleAmount(p);
    // в финале движение замедляется
    clock.current += reduced ? 0 : Math.min(dt, 0.1) * (1 - 0.8 * finale);
    const time = clock.current;
    const reset = chapterReset(p);
    const keep = 1 - 0.95 * finale;
    const gather = easeOut(finale);

    // ── камера: медленный облёт вокруг схемы ──
    const cam = cameraAt(p);
    const aspect = size.width / size.height;
    const fit = narrow ? Math.min(3.2, Math.max(1, 1.4 / aspect)) : Math.max(1.12, 1.95 / aspect);
    const ptr = pointer.current;
    const ease = 1 - Math.exp(-Math.min(dt, 0.1) * 2.5);
    ptr.sx += ((reduced ? 0 : ptr.x) - ptr.sx) * ease;
    ptr.sy += ((reduced ? 0 : ptr.y) - ptr.sy) * ease;
    const drift = reduced || still ? 0 : Math.sin(time * 0.11) * 0.14;
    const az = cam.az + drift + ptr.sx * (still ? 0.05 : 0.07);
    cam.el += ptr.sy * 0.035;
    const d = cam.d * fit;
    camera.position.set(Math.sin(az) * Math.cos(cam.el) * d, cam.ty + Math.sin(cam.el) * d, Math.cos(az) * Math.cos(cam.el) * d);
    camera.lookAt(0, cam.ty, 0);
    if (narrow) camera.setViewOffset(size.width, size.height, 0, size.height * 0.04, size.width, size.height);
    else camera.setViewOffset(size.width, size.height, -size.width * 0.17, 0, size.width, size.height);

    const selOf = (layers: number[] | number) =>
      selected === null ? 1 : (Array.isArray(layers) ? layers.includes(selected) : layers === selected) ? 1 : 0.15;

    // ── геометрия в ядре: форма компании → форма объекта ──
    const formBuild = sm(0, 0.09, p) * (1 - reset) + sm(0.39, 0.47, p);
    const shape = sm(0.36, 0.4, p);
    const twist = mix(1.6, 0.7, shape);
    const bulge = mix(0.28, 0.14, shape);
    const focus = subFocus(p);
    const scan = scanAmount(p);
    const fb = feedbackAmount(p);
    const algo = arrayAmount(p);
    const detail = sm(0.13, 0.16, p) * (1 - reset) + sm(0.55, 0.6, p);
    const spin = still ? 0.9 : time * 0.05 + p * 0.8;

    for (let u = 0; u <= FU; u++)
      for (let v = 0; v <= FV; v++) {
        formPoint(u / FU + spin / (Math.PI * 2), v / FV, twist, bulge, tmp.formVerts[u * (FV + 1) + v]);
      }
    const fpos = res.formGeo.attributes.position as BufferAttribute;
    formSegs.forEach(([u0, v0, u1, v1], i) => {
      const a = tmp.formVerts[u0 * (FV + 1) + v0];
      const b = tmp.formVerts[u1 * (FV + 1) + v1];
      fpos.setXYZ(i * 2, a.x, a.y, a.z);
      fpos.setXYZ(i * 2 + 1, b.x, b.y, b.z);
    });
    fpos.needsUpdate = true;
    res.formGeo.setDrawRange(0, Math.ceil(clamp01(formBuild) * formSegs.length) * 2);
    res.formMat.opacity = (0.42 - 0.28 * focus) * keep;
    lines.form.visible = formBuild > 0.005 && keep > 0.08;
    // оболочка: проявляется вместе с формой, в фокусе подсистемы почти исчезает
    const spos = res.skinGeo.attributes.position as BufferAttribute;
    tmp.formVerts.forEach((fv, i) => spos.setXYZ(i, fv.x, fv.y, fv.z));
    spos.needsUpdate = true;
    res.skinGeo.computeVertexNormals();
    res.skinMat.uniforms.uOpacity.value = clamp01(formBuild) * 0.26 * (1 - 0.8 * focus) * (1 - 0.6 * finale);
    lines.skin.visible = formBuild > 0.01;

    // точки данных на геометрии: в первой главе — правила (волна), во второй — данные слоёв
    const pts = pointsRef.current;
    if (pts) {
      let i = 0;
      for (let u = 0; u < FU; u++)
        for (let v = 0; v <= FV; v++) {
          const vert = tmp.formVerts[u * (FV + 1) + v];
          const order = v / FV;
          const local = easeOut(formBuild * 1.5 - order * 0.5);
          // алгоритмы «делят» форму: сначала видна каждая вторая точка, потом все
          const shown = (u + v) % 2 === 0 || detail > 0.5 || algo > 0.3 ? 1 : 0;
          const sc = 0.045 * dot * local * shown * (1 - 0.5 * focus) * keep;
          tmp.m.compose(vert, tmp.q.identity(), tmp.s.setScalar(Math.max(sc, 1e-4)));
          pts.setMatrixAt(i, tmp.m);
          tmp.col.copy(tmp.sand);
          if (detail > 0.01) tmp.col.lerp(tmp.layerCols[(u + v) % CORE_LAYERS.length], detail * 0.85);
          const wave = algo * Math.max(0, Math.sin((order * 5 + u / FU * 2 - time * 1.5) * 1.4)) ** 6;
          tmp.col.lerp(tmp.orange, wave);
          if (scan > 0.01 && Math.abs(vert.y - scanY(time)) < 0.18) tmp.col.lerp(tmp.scan, scan);
          pts.setColorAt(i, tmp.col);
          i++;
        }
      pts.instanceMatrix.needsUpdate = true;
      if (pts.instanceColor) pts.instanceColor.needsUpdate = true;
      pts.visible = keep > 0.08;
    }

    // ── подсистема: инженерный хребет внутри ядра ──
    const spineBuild = sm(0.48, 0.55, p);
    const ribBuild = sm(0.495, 0.56, p);
    const braceBuild = sm(0.51, 0.57, p);
    const jointBuild = sm(0.5, 0.565, p);
    res.spine.emissiveIntensity = 0.25 + 0.6 * focus;
    res.spine.opacity = keep;
    res.joint.opacity = keep;
    const col = columnRef.current;
    if (col) {
      const len = Math.max(spineBuild * SPINE_H, 1e-3);
      col.scale.set(0.09 * (1 + focus * 0.3), len, 0.09 * (1 + focus * 0.3));
      col.position.set(0, -SPINE_H / 2 + len / 2, 0);
      col.visible = spineBuild > 0.005 && keep > 0.08;
    }
    const ribs = ribsRef.current;
    if (ribs) {
      let i = 0;
      CORE_LAYERS.forEach((_, lv) => {
        const y = RING_Y[lv] * 1.45;
        const v = clamp01(y / FORM_H + 0.5);
        const reach = 0.92 + mix(0.28, 0.14, shape) * Math.sin(v * Math.PI) - 0.04;
        for (let k = 0; k < RIBS; k++) {
          const a = (k / RIBS) * Math.PI * 2 + lv * 0.42 + spin;
          const local = easeOut(ribBuild * 1.6 - (1 - (lv + 0.5) / CORE_LAYERS.length) * 0.6);
          tmp.v.set(0, y, 0);
          const end = tmp.ribEnds[lv * RIBS + k].set(Math.cos(a) * reach, y, Math.sin(a) * reach);
          tmp.v2.lerpVectors(tmp.v, end, Math.max(local, 0.002));
          ribs.setMatrixAt(i++, segMatrix(tmp.v, tmp.v2, 0.045 * Math.min(1, local * 3) * (1 + focus * 0.3), tmp.m));
        }
      });
      ribs.instanceMatrix.needsUpdate = true;
      ribs.visible = ribBuild > 0.005 && keep > 0.08;
    }
    const braces = bracesRef.current;
    if (braces) {
      let i = 0;
      for (let lv = 0; lv < CORE_LAYERS.length - 1; lv++)
        for (let k = 0; k < RIBS; k++) {
          const a = tmp.ribEnds[lv * RIBS + k];
          const b = tmp.ribEnds[(lv + 1) * RIBS + k];
          const local = easeOut(braceBuild * 1.6 - (lv / CORE_LAYERS.length) * 0.6);
          tmp.v2.lerpVectors(a, b, Math.max(local, 0.002));
          braces.setMatrixAt(i++, segMatrix(a, tmp.v2, 0.028 * Math.min(1, local * 3), tmp.m));
        }
      braces.instanceMatrix.needsUpdate = true;
      braces.visible = braceBuild > 0.005 && keep > 0.08;
    }
    const jm = jointsRef.current;
    if (jm) {
      let i = 0;
      tmp.ribEnds.forEach((e, k) => {
        const local = easeOut(jointBuild * 1.6 - (k / tmp.ribEnds.length) * 0.6);
        const pulse = 1 + focus * 0.3 * Math.sin(time * 3 + k);
        tmp.m.compose(e, tmp.q.identity(), tmp.s.setScalar(Math.max(local * 0.1 * pulse, 1e-4)));
        jm.setMatrixAt(i++, tmp.m);
      });
      CORE_LAYERS.forEach((_, lv) => {
        tmp.v.set(0, RING_Y[lv] * 1.45, 0);
        const local = easeOut(jointBuild * 1.6 - (lv / CORE_LAYERS.length) * 0.6);
        tmp.m.compose(tmp.v, tmp.q.identity(), tmp.s.setScalar(Math.max(local * 0.15, 1e-4)));
        jm.setMatrixAt(i++, tmp.m);
      });
      jm.instanceMatrix.needsUpdate = true;
      jm.visible = jointBuild > 0.005 && keep > 0.08;
    }
    SUB_NOTES.forEach((n, i) => {
      const anchor = noteAnchorRefs.current[i];
      if (anchor) {
        if (n.level < 0) anchor.position.set(0, SPINE_H / 2 + 0.1, 0);
        else anchor.position.copy(tmp.ribEnds[n.level * RIBS + n.rib]);
      }
      setTag(noteRefs.current[i], sm(n.at, n.at + 0.012, p) * SUB_OUT(p));
    });
    // расчёты: нагрузки давят на верхний ярус
    const calc = sm(0.512, 0.528, p) * SUB_OUT(p);
    res.arrowMat.opacity = calc;
    const ar = arrowsRef.current;
    if (ar) {
      for (let k = 0; k < RIBS; k++) {
        const e = tmp.ribEnds[k];
        const bob = Math.sin(time * 3 + k) * 0.06;
        tmp.v.set(e.x, e.y + 0.42 + bob, e.z);
        tmp.q.setFromAxisAngle(tmp.v3.set(1, 0, 0), Math.PI);
        tmp.m.compose(tmp.v, tmp.q, tmp.s.setScalar(Math.max(calc, 1e-4)));
        ar.setMatrixAt(k, tmp.m);
      }
      ar.instanceMatrix.needsUpdate = true;
      ar.visible = calc > 0.01;
    }
    // деталировка: лупа на узле
    const lensAmt = sm(DETAIL.at, DETAIL.at + 0.012, p) * SUB_OUT(p);
    const lens = lensRef.current;
    if (lens) {
      lens.position.copy(tmp.ribEnds[DETAIL.level * RIBS + DETAIL.rib]);
      lens.lookAt(camera.position);
      lens.scale.setScalar(Math.max(lensAmt * (0.24 + 0.02 * Math.sin(time * 2)), 1e-4));
      lens.visible = lensAmt > 0.01;
    }
    res.lensMat.opacity = lensAmt;
    setTag(lensTagRef.current, lensAmt);
    // монтаж: очерёдность сборки снизу вверх
    ASSEMBLY.forEach((a, i) => {
      const mk = asmRefs.current[i];
      if (mk) mk.position.copy(tmp.ribEnds[a.level * RIBS + a.rib]);
      setTag(asmTagRefs.current[i], sm(a.at, a.at + 0.008, p) * SUB_OUT(p));
    });

    // ── обмеры: плоскость сканирования проходит по геометрии ──
    const sc = scanRef.current;
    if (sc) {
      const y = scanY(time);
      sc.position.set(0, y, 0);
      sc.scale.setScalar(1.35);
      sc.visible = scan > 0.01;
      res.scanMat.opacity = scan * 0.14;
      if (scanRimRef.current) {
        scanRimRef.current.position.set(0, y, 0);
        scanRimRef.current.scale.setScalar(1.36);
        scanRimRef.current.visible = scan > 0.01;
      }
      res.scanRimMat.opacity = scan * 0.9;
    }
    setTag(scanTagRef.current, scan);

    // ── слои: кольца внутри ядра наполняются данными ──
    const dots = dotsRef.current;
    const ringsGap = 1 - 0.35 * finale;
    CORE_LAYERS.forEach((_, i) => {
      const a = layerAmount(i, p);
      const fill = layerFill(i, p) * a;
      const sel = selOf(i);
      const y = RING_Y[i] * ringsGap;
      const r = RING_R * (0.4 + 0.6 * a) * (1 + 0.08 * finale);
      const ring = ringRefs.current[i];
      const halo = haloRefs.current[i];
      for (const m of [ring, halo]) {
        if (!m) continue;
        m.position.set(0, y, 0);
        m.scale.setScalar(Math.max(r, 1e-3));
        m.visible = a > 0.005;
      }
      res.ringMats[i].opacity = a * sel * (0.35 + 0.65 * Math.min(1, fill * 1.4)) * (1 - 0.6 * finale);
      res.haloMats[i].opacity = a * 0.22 * sel * (selected === i ? 1.7 : 1) * (0.4 + 0.6 * fill) * (1 + finale);
      const shown = Math.round(fill * NODES);
      const rot = (i % 2 ? 1 : -1) * (p * 2 + (still ? 0 : time * 0.08)) + i;
      for (let j = 0; j < NODES; j++) {
        const ang = rot + (j / NODES) * Math.PI * 2;
        tmp.v.set(Math.cos(ang) * r, y, Math.sin(ang) * r);
        const s = j < shown ? 0.05 * dot * (selected === i ? 1.35 : 1) * (1 - 0.7 * finale) : 0;
        tmp.m.compose(tmp.v, tmp.q.identity(), tmp.s.setScalar(Math.max(s, 1e-4)));
        dots?.setMatrixAt(i * NODES + j, tmp.m);
        dots?.setColorAt(i * NODES + j, tmp.col.copy(tmp.layerCols[i]).multiplyScalar(sel));
      }
    });
    if (dots) {
      dots.instanceMatrix.needsUpdate = true;
      if (dots.instanceColor) dots.instanceColor.needsUpdate = true;
    }

    // ядро обрастает информацией: короткая метка в момент, когда слой наполняется
    CORE_LAYERS.forEach((_, i) => setTag(popRefs.current[i], layerPop(i, p) * (1 - finale)));

    // ── алгоритмы: поле элементов по правилу (слева, как в эскизе) ──
    const tiles = tilesRef.current;
    if (tiles) {
      let i = 0;
      for (let c = 0; c < 7; c++)
        for (let r = 0; r < 4; r++) {
          const local = easeOut(algo * 1.8 - (c + r) * 0.07);
          tmp.v.copy(toUpright(76 + c * 26 + 9.5, 190 + r * 26 + 9.5, 1.1));
          tmp.v.y += Math.sin(time * 1.2 + c * 0.6 + r) * 0.03;
          // правило: размер элемента зависит от положения, а не случаен
          const w = 0.16 + 0.07 * (0.5 + 0.5 * Math.sin(c * 0.9 + r * 1.4));
          tmp.m.compose(tmp.v, tmp.q.identity(), tmp.s.set(w * local, w * local, 0.02));
          tiles.setMatrixAt(i, tmp.m);
          // правило пробегает по полю волной — тот же ритм, что и по форме в ядре
          const lit = Math.max(0, Math.sin((c * 0.8 + r * 0.5) - time * 2.6)) ** 4;
          tmp.col.copy(tmp.layerCols[(c + r) % CORE_LAYERS.length]).lerp(tmp.sand, 0.45).multiplyScalar(0.45 + 0.55 * lit);
          tiles.setColorAt(i, tmp.col.lerp(tmp.orange, lit * 0.5));
          i++;
        }
      tiles.instanceMatrix.needsUpdate = true;
      if (tiles.instanceColor) tiles.instanceColor.needsUpdate = true;
      tiles.visible = algo > 0.005;
    }
    res.tile.opacity = algo;
    res.gridLinkMat.opacity = algo * 0.6;
    lines.gridLink.visible = algo > 0.01;
    setTag(gridTagRef.current, algo);
    const gp = gridPartsRef.current;
    if (gp) {
      for (let k = 0; k < 6; k++) {
        lines.gridLinkCurve.getPoint(frac(time * 0.45 + k / 6), tmp.v2);
        tmp.m.compose(tmp.v2, tmp.q.identity(), tmp.s.setScalar(algo > 0.6 ? 0.055 : 1e-4));
        gp.setMatrixAt(k, tmp.m);
        gp.setColorAt(k, k % 2 ? tmp.orange : tmp.white);
      }
      gp.instanceMatrix.needsUpdate = true;
      if (gp.instanceColor) gp.instanceColor.needsUpdate = true;
    }

    // ── участники и связи: данные выходят к участникам и возвращаются в ядро ──
    const parts = partsRef.current;
    nodes.forEach((n, ni) => {
      const amt = n.amount(p);
      const sel = n.station ? selOf(n.links) : 1;
      // в финале участники и потоки собираются в ядро
      const pos = tmp.nodePos[ni].copy(n.home).multiplyScalar(1 - 0.78 * gather);
      const anchor = anchorRefs.current[ni];
      if (anchor) {
        anchor.position.copy(pos);
        anchor.rotation.y = time * 0.9 + ni;
        anchor.scale.setScalar(Math.max(easeOut(amt) * 0.16 * (1 - 0.5 * gather), 1e-4));
        anchor.visible = amt > 0.005 && gather < 0.97;
      }
      const cardAnchor = cardAnchorRefs.current[ni];
      if (cardAnchor) cardAnchor.position.copy(pos).setY(pos.y + 0.32);
      const card = cardRefs.current[ni];
      if (card) {
        card.style.opacity = String(amt * (selected === null || !n.station ? 1 : sel > 0.5 ? 1 : 0.28) * (1 - sm(0.9, 0.935, p)));
        card.style.visibility = amt > 0.01 && p < 0.94 ? "visible" : "hidden";
        card.dataset.on = selected !== null && n.station && sel > 0.5 ? "1" : "0";
      }

      // связь выходит из кольца своего слоя в сторону участника
      tmp.v.set(pos.x, 0, pos.z);
      if (tmp.v.lengthSq() < 1e-4) tmp.v.set(0, 0, 1);
      tmp.v.normalize();
      const start = tmp.curve.v0.set(tmp.v.x * RING_R, RING_Y[n.layer] * ringsGap, tmp.v.z * RING_R);
      const end = tmp.curve.v2.copy(pos);
      tmp.curve.v1.addVectors(start, end).multiplyScalar(0.5).setY(Math.max(start.y, end.y) + 0.9 * (1 - 0.6 * gather));
      const line = lines.links[ni];
      const lp = line.geometry.attributes.position as BufferAttribute;
      for (let k = 0; k < CURVE_PTS; k++) {
        tmp.curve.getPoint(k / (CURVE_PTS - 1), tmp.v2);
        lp.setXYZ(k, tmp.v2.x, tmp.v2.y, tmp.v2.z);
      }
      lp.needsUpdate = true;
      line.geometry.setDrawRange(0, Math.ceil(easeOut(amt) * CURVE_PTS));
      res.linkMats[ni].opacity = (0.3 + 0.45 * amt) * sel * (1 - 0.5 * finale) * (amt > 0.01 ? 1 : 0);
      line.visible = amt > 0.01;

      if (parts) {
        // исходные данные сначала только входят в ядро
        const outward = n.input ? sm(0.47, 0.5, p) : 1;
        const boost = n.key === "site" ? fb : 0;
        for (let k = 0; k < 4; k++) {
          const back = k >= 2;
          const u = frac(time * 0.32 + p * 4 + (k % 2) * 0.5 + ni * 0.17 + (back ? 0.25 : 0));
          tmp.curve.getPoint(back ? 1 - u : u, tmp.v2);
          const s = amt > 0.9 ? (back ? 0.06 + 0.05 * boost : 0.07 * outward) * (still ? 1.25 : 1) : 0;
          tmp.m.compose(tmp.v2, tmp.q.identity(), tmp.s.setScalar(Math.max(s, 1e-4)));
          parts.setMatrixAt(ni * 4 + k, tmp.m);
          parts.setColorAt(ni * 4 + k, tmp.col.copy(back ? tmp.white : tmp.layerCols[n.layer]).multiplyScalar(sel));
        }
      }
    });
    if (parts) {
      parts.instanceMatrix.needsUpdate = true;
      if (parts.instanceColor) parts.instanceColor.needsUpdate = true;
    }

    // ── маршрут детали: производства → логистика → площадка ──
    const routeAmt = sm(0.685, 0.72, p) * (1 - sm(0.88, 0.92, p));
    res.pathMat.opacity = routeAmt * (selected === null || selected === 4 ? 0.9 : 0.2);
    lines.routeLine.visible = routeAmt > 0.01;
    const parcel = parcelRef.current;
    if (parcel) {
      const t = clamp01((p - 0.7) / 0.16);
      const f = t * (lines.route.length - 1);
      const i0 = Math.floor(f);
      const i1 = Math.min(lines.route.length - 1, i0 + 1);
      parcel.position.lerpVectors(lines.route[i0], lines.route[i1], f - i0);
      parcel.position.y += 0.12;
      parcel.lookAt(lines.route[i1].x, parcel.position.y, lines.route[i1].z);
      parcel.visible = routeAmt > 0.5 && t > 0 && t < 1;
      setTag(parcelTagRef.current, parcel.visible ? 1 : 0);
    }

    // ── факт с площадки возвращается в ядро ──
    res.feedbackMat.opacity = fb * 0.95;
    lines.fbLine.visible = fb > 0.01;
    const fbp = fbPartsRef.current;
    if (fbp) {
      const n = lines.fbPts.length - 1;
      for (let k = 0; k < 5; k++) {
        const t = frac(time * 0.28 + k * 0.2) * n;
        const i0 = Math.floor(t);
        tmp.v2.lerpVectors(lines.fbPts[i0], lines.fbPts[Math.min(n, i0 + 1)], t - i0);
        tmp.m.compose(tmp.v2, tmp.q.identity(), tmp.s.setScalar(fb > 0.5 ? 0.075 : 1e-4));
        fbp.setMatrixAt(k, tmp.m);
        fbp.setColorAt(k, tmp.green);
      }
      fbp.instanceMatrix.needsUpdate = true;
      if (fbp.instanceColor) fbp.instanceColor.needsUpdate = true;
    }
    res.markerMat.opacity = fb;
    MEASURE.forEach((m, i) => {
      const mk = markerRefs.current[i];
      if (!mk) return;
      formPoint(m.u + spin / (Math.PI * 2), m.v, twist, bulge, mk.position);
      mk.lookAt(camera.position);
      mk.scale.setScalar(Math.max(fb * (0.1 + 0.04 * Math.sin(time * 2.4 + i * 1.7)), 1e-4));
      mk.visible = fb > 0.01;
    });
    setTag(fbTagRef.current, fb);

    // ── ядро: вспышка при смене главы; в финале — светлый цельный образ и название ──
    const swap = reset * (1 - sm(0.39, 0.42, p));
    res.coreGlow.opacity = 0.07 + 0.25 * swap + 0.35 * finale + 0.05 * focus;
    lines.glowSprite.scale.setScalar(R * (2.5 + 1.3 * finale));
    res.glassShell.uniforms.uOpacity.value = 0.55 + finale * 0.8;
    // внутренняя структура просвечивает сквозь светлое ядро
    res.whiteCore.opacity = finale * 0.86;
    fx.bloom = 0.45 * (1 - 0.55 * finale) + 0.2 * swap;
    const wave = sm(0.935, 1, p);
    const wm = waveRef.current;
    if (wm) {
      wm.scale.setScalar(R * (1.05 + 2.6 * wave));
      wm.visible = wave > 0.005 && wave < 0.995;
    }
    res.waveMat.opacity = Math.sin(wave * Math.PI) * 0.9;
    res.orbitMat.opacity = 0.07 * keep;
    res.whiteCore.depthWrite = finale > 0.5;
    res.envMat.opacity = 0.16 * keep;
    lines.envLine.visible = keep > 0.08;
    setTag(envTagRef.current, sm(0.26, 0.3, p) * (1 - sm(0.36, 0.38, p)));
    setTag(markRef.current, sm(0.93, 0.985, p));

    // упрощённая схема: только ядро, слои, хребет и участники со связями
    if (still) {
      lines.globe.visible = false;
      if (pointsRef.current) pointsRef.current.visible = false;
      for (const o of [arrowsRef.current, lensRef.current, parcelRef.current, fbPartsRef.current, scanRef.current, scanRimRef.current, tilesRef.current, gridPartsRef.current]) {
        if (o) o.visible = false;
      }
      markerRefs.current.forEach((m) => m && (m.visible = false));
      lines.routeLine.visible = false;
      lines.fbLine.visible = false;
      lines.gridLink.visible = false;
    }
  });

  return (
    <>
      {/* ядро */}
      <mesh geometry={res.sphere} material={res.glassShell} renderOrder={10} />
      <mesh geometry={res.sphere} material={res.whiteCore} scale={0.995} renderOrder={11} />
      <primitive object={lines.globe} />
      <primitive object={lines.glowSprite} />
      <mesh geometry={res.disc} material={res.floorGlow} rotation={[-Math.PI / 2, 0, 0]} position={[0, -R - 0.4, 0]} scale={4.5} />

      {/* геометрия и подсистема внутри ядра */}
      <primitive object={lines.skin} />
      <primitive object={lines.form} />
      <instancedMesh ref={pointsRef} args={[res.box, res.pointMat, FU * (FV + 1)]} frustumCulled={false} />
      <mesh ref={columnRef} geometry={res.box} material={res.spine} visible={false} />
      <instancedMesh ref={ribsRef} args={[res.box, res.spine, CORE_LAYERS.length * RIBS]} frustumCulled={false} visible={false} />
      <instancedMesh ref={bracesRef} args={[res.box, res.spine, (CORE_LAYERS.length - 1) * RIBS]} frustumCulled={false} visible={false} />
      <instancedMesh ref={jointsRef} args={[res.box, res.joint, CORE_LAYERS.length * RIBS + CORE_LAYERS.length]} frustumCulled={false} visible={false} />
      {SUB_NOTES.map((n, i) => (
        <mesh key={n.text} ref={(m) => void (noteAnchorRefs.current[i] = m)} visible={false}>
          <Html zIndexRange={[6, 0]} style={{ pointerEvents: "none", willChange: "transform" }}>
            <div ref={(el) => void (noteRefs.current[i] = el)} className="cs-note">
              {n.text}
            </div>
          </Html>
        </mesh>
      ))}

      {/* расчёты, деталировка, монтаж */}
      <instancedMesh ref={arrowsRef} args={[res.cone, res.arrowMat, RIBS]} frustumCulled={false} visible={false} />
      <mesh ref={lensRef} geometry={res.marker} material={res.lensMat} visible={false}>
        <Html zIndexRange={[7, 0]} style={{ pointerEvents: "none", willChange: "transform" }}>
          <div ref={lensTagRef} className="cs-callout">
            <svg viewBox="0 0 64 40" aria-hidden>
              <path d="M6 34 H58 M14 34 V12 H40 M40 12 V34 M22 12 V6 H34 V12" />
              <circle cx="14" cy="34" r="2.2" />
              <circle cx="40" cy="12" r="2.2" />
              <path className="dim" d="M6 4 H58 M6 2 V6 M58 2 V6" />
            </svg>
            <span>
              <b>Деталировка</b>
              Узел У-12 · кронштейн, допуски ±2 мм
            </span>
          </div>
        </Html>
      </mesh>
      {ASSEMBLY.map((_, i) => (
        <mesh key={i} ref={(m) => void (asmRefs.current[i] = m)} visible={false}>
          <Html center zIndexRange={[7, 0]} style={{ pointerEvents: "none", willChange: "transform" }}>
            <div ref={(el) => void (asmTagRefs.current[i] = el)} className="cs-step">
              {i + 1}
            </div>
          </Html>
        </mesh>
      ))}

      {/* обмеры */}
      <mesh ref={scanRef} geometry={res.disc} material={res.scanMat} rotation={[-Math.PI / 2, 0, 0]} visible={false} />
      <mesh ref={scanRimRef} geometry={res.torus} material={res.scanRimMat} rotation={[Math.PI / 2, 0, 0]} visible={false} />
      <Html position={[-1.55, FORM_H / 2 + 0.45, 0]} zIndexRange={[6, 0]} style={{ pointerEvents: "none", willChange: "transform" }}>
        <div ref={scanTagRef} className="cs-note cs-note--scan">Обмеры основания</div>
      </Html>

      {/* слои */}
      {CORE_LAYERS.map((_, i) => (
        <group key={i}>
          <mesh ref={(m) => void (ringRefs.current[i] = m)} geometry={res.torus} material={res.ringMats[i]} rotation={[Math.PI / 2, 0, 0]} visible={false} />
          <mesh ref={(m) => void (haloRefs.current[i] = m)} geometry={res.halo} material={res.haloMats[i]} rotation={[Math.PI / 2, 0, 0]} visible={false} />
        </group>
      ))}
      <instancedMesh ref={dotsRef} args={[res.box, res.basic, CORE_LAYERS.length * NODES]} frustumCulled={false} />
      {CORE_LAYERS.map((l, i) => (
        <Html key={l.key} position={[RING_R + 0.3, RING_Y[i], 0.4]} zIndexRange={[6, 0]} style={{ pointerEvents: "none", willChange: "transform" }}>
          <div ref={(el) => void (popRefs.current[i] = el)} className="cs-pop" style={{ ["--c" as string]: l.color }}>
            + {l.name}
          </div>
        </Html>
      ))}

      {/* алгоритмы */}
      <instancedMesh ref={tilesRef} args={[res.box, res.tile, 28]} frustumCulled={false} visible={false} />
      <primitive object={lines.gridLink} />
      <instancedMesh ref={gridPartsRef} args={[res.ico, res.basic, 6]} frustumCulled={false} />
      <Html position={toUpright(167, 168, 1.1)} zIndexRange={[6, 0]} style={{ pointerEvents: "none", willChange: "transform" }}>
        <div ref={gridTagRef} className="cs-env">Правила → множество элементов</div>
      </Html>

      {/* участники */}
      {nodes.map((n, i) => (
        <group key={n.key}>
          <mesh ref={(m) => void (anchorRefs.current[i] = m)} geometry={res.diamond} material={res.nodeMats[n.layer]} visible={false} />
          <mesh ref={(m) => void (cardAnchorRefs.current[i] = m)} visible={false}>
            <Html zIndexRange={[6, 0]} style={{ pointerEvents: "none", willChange: "transform" }}>
              <div ref={(el) => void (cardRefs.current[i] = el)} className="cs-st" style={{ ["--c" as string]: CORE_LAYERS[n.layer].color }}>
                <i aria-hidden />
                <b>{n.name}</b>
                <span>{n.sub}</span>
              </div>
            </Html>
          </mesh>
        </group>
      ))}
      {lines.links.map((l, i) => (
        <primitive key={i} object={l} />
      ))}
      <instancedMesh ref={partsRef} args={[res.ico, res.basic, nodes.length * 4]} frustumCulled={false} />

      {/* маршрут детали */}
      <primitive object={lines.routeLine} />
      <mesh ref={parcelRef} geometry={res.box} material={res.parcelMat} scale={[0.36, 0.22, 0.22]} visible={false}>
        <Html position={[0, 1.6, 0]} zIndexRange={[6, 0]} style={{ pointerEvents: "none", willChange: "transform" }}>
          <div ref={parcelTagRef} className="cs-tag cs-tag--move">P-042 · K-03</div>
        </Html>
      </mesh>

      {/* обратная связь с площадки */}
      <primitive object={lines.fbLine} />
      <instancedMesh ref={fbPartsRef} args={[res.ico, res.basic, 5]} frustumCulled={false} />
      {MEASURE.map((_, i) => (
        <mesh key={i} ref={(m) => void (markerRefs.current[i] = m)} geometry={res.marker} material={res.markerMat} visible={false} />
      ))}
      <Html position={lines.fbPts[Math.floor(lines.fbPts.length * 0.35)]} zIndexRange={[6, 0]} style={{ pointerEvents: "none", willChange: "transform" }}>
        <div ref={fbTagRef} className="cs-note cs-note--fact">Факт → модель → связанные решения</div>
      </Html>

      {/* граница общей среды и контуры схемы */}
      <primitive object={lines.envLine} />
      {lines.orbits.map((o, i) => (
        <primitive key={i} object={o} />
      ))}
      <mesh ref={waveRef} geometry={res.torus} material={res.waveMat} rotation={[Math.PI / 2, 0, 0]} visible={false} />
      <Html position={toScheme(500 + 460 * Math.cos(2.5), 246 + 220 * Math.sin(2.5))} zIndexRange={[6, 0]} style={{ pointerEvents: "none", willChange: "transform" }}>
        <div ref={envTagRef} className="cs-env">Общая цифровая среда</div>
      </Html>

      {/* финал: название на светлом ядре */}
      <Html center zIndexRange={[8, 0]} style={{ pointerEvents: "none", willChange: "transform" }}>
        <div ref={markRef} className="cs-mark">
          <b>
            STRUKTURA<i>+</i>
          </b>
          <span>Цифровое ядро</span>
        </div>
      </Html>
    </>
  );
}

/** Высота плоскости сканирования — медленно проходит форму снизу вверх и обратно. */
function scanY(time: number) {
  return Math.sin(time * 0.9) * (FORM_H / 2 - 0.1);
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Core story scene failed", error, info);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function CoreStoryScene({ active, ...props }: SceneProps) {
  const simple = props.still ?? false;
  const fx = useRef<Fx>({ bloom: 0.6 });
  return (
    <SceneBoundary>
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={simple ? [1.5, 2] : [1, 1.75]}
        camera={{ fov: 34, near: 0.1, far: 120, position: [0, 6, 17] }}
        gl={{ antialias: simple, alpha: false }}
        style={{ touchAction: "pan-y" }}
      >
        <color attach="background" args={["#101010"]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[5, 8, 7]} intensity={1.4} />
        <directionalLight position={[-6, 2, -5]} intensity={0.5} color="#ff8a4c" />
        <World {...props} fx={fx.current} />
        {!simple && <Effects fx={fx.current} />}
      </Canvas>
    </SceneBoundary>
  );
}
