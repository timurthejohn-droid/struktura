"use client";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import {
  Box3,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { ShellState } from "./state";

/**
 * Реальная модель подсистемы STRUKTURA (та же, что на главной).
 * Модель раскладывается на слои по размеру деталей:
 *   облицовка (col_pnl) · несущие профили · узлы/кронштейны · крепёж.
 * Управление — тот же ShellState, что у процедурной модели.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const REAL_MODEL_PATH = `${BASE_PATH}/models/Untitled1234.web.glb`;
const PANELS_ROOT = "col_pnl";
const OUTLIER_LIMIT = 10;
/** Размер модели после нормализации (по наибольшей стороне) */
const TARGET = 6.4;
/** Разворот как на главной */
const MODEL_ROTATION_Y = Math.PI - 0.28;
/** Сторона, обращённая к камерам сцен (в координатах модели) */
const FACING = new Vector3(0.75, 0, 0.66).normalize();
const ORANGE = new Color("#ff5a00");

type Panel = { geo: BufferGeometry; center: Vector3; radial: Vector3; weight: number; scatter: Vector3; delay: number };
type Slab = { position: Vector3; size: [number, number, number] };
type Prepared = {
  panels: Panel[];
  bearing: BufferGeometry;
  nodesNear: BufferGeometry;
  nodesFar: BufferGeometry;
  fasteners: BufferGeometry;
  /** направление регулировки (наружу от оси в активной зоне) */
  adjustDir: Vector3;
  size: number;
  height: number;
  floor: Slab;
  ceiling: Slab;
};

const hash = (n: number) => {
  const x = Math.sin(n * 91.345) * 43758.5453;
  return x - Math.floor(x);
};
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);

/** Квантованную геометрию glTF → обычная Float32 с индексом (нужно для склейки). */
function toFloat(src: BufferGeometry, m: Matrix4) {
  const pos = src.getAttribute("position");
  const n = pos.count;
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    p[i * 3] = pos.getX(i);
    p[i * 3 + 1] = pos.getY(i);
    p[i * 3 + 2] = pos.getZ(i);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(p, 3));
  const idx = src.index ? Uint32Array.from(src.index.array as ArrayLike<number>) : Uint32Array.from({ length: n }, (_, i) => i);
  g.setIndex(new BufferAttribute(idx, 1));
  g.applyMatrix4(m);
  return g;
}

function merge(list: BufferGeometry[]) {
  if (!list.length) return new BufferGeometry();
  const g = mergeGeometries(list, false) ?? new BufferGeometry();
  g.computeVertexNormals();
  return g;
}

// Подготовка тяжёлая — делаем один раз на страницу и делим между всеми сценами.
let cache: Prepared | null = null;

function prepare(scene: Object3D): Prepared {
  if (cache) return cache;
  scene.updateMatrixWorld(true);

  let panelsRoot: Object3D | undefined;
  scene.traverse((o) => {
    if (o.name === PANELS_ROOT) panelsRoot = o;
  });
  const inPanels = (o: Object3D) => {
    for (let c: Object3D | null = o; c; c = c.parent) if (c === panelsRoot) return true;
    return false;
  };

  // Меши + отсев выбросов (как на главной)
  const box = new Box3();
  const c = new Vector3();
  const s = new Vector3();
  const panelMeshes: Mesh[] = [];
  const partMeshes: Mesh[] = [];
  scene.traverse((o) => {
    if (!(o instanceof Mesh)) return;
    if (inPanels(o)) return panelMeshes.push(o);
    box.setFromObject(o);
    box.getCenter(c);
    box.getSize(s);
    if (Math.abs(c.x) > OUTLIER_LIMIT || Math.abs(c.y) > OUTLIER_LIMIT || Math.abs(c.z) > OUTLIER_LIMIT || s.length() > OUTLIER_LIMIT) return;
    partMeshes.push(o);
  });

  // Нормализация: разворот как на главной, центр по X/Z, низ на y=0, высота = TARGET
  const R = new Matrix4().makeRotationY(MODEL_ROTATION_Y);
  const all = new Box3();
  [...panelMeshes, ...partMeshes].forEach((m) => all.expandByObject(m));
  const rotated = all.clone().applyMatrix4(R);
  const allSize = rotated.getSize(new Vector3());
  const k = TARGET / Math.max(allSize.x, allSize.y, allSize.z);
  const ctr = rotated.getCenter(new Vector3());
  const N = new Matrix4().makeScale(k, k, k).multiply(new Matrix4().makeTranslation(-ctr.x, -rotated.min.y, -ctr.z)).multiply(R);

  const panelsWorld = panelMeshes.map((m) => toFloat(m.geometry, new Matrix4().multiplyMatrices(N, m.matrixWorld)));
  const partsWorld = partMeshes.map((m) => toFloat(m.geometry, new Matrix4().multiplyMatrices(N, m.matrixWorld)));

  const boxOf = (g: BufferGeometry) => {
    g.computeBoundingBox();
    return g.boundingBox!;
  };
  const partsBox = new Box3();
  partsWorld.forEach((g) => partsBox.union(boxOf(g)));
  const panelsBox = new Box3();
  panelsWorld.forEach((g) => panelsBox.union(boxOf(g)));
  const H = Math.max(partsBox.max.y, panelsBox.max.y);
  const D = TARGET;

  // Ось колонны — центр каркаса в плане
  const axis = partsBox.getCenter(new Vector3()).setY(0);
  const radialOf = (p: Vector3) => {
    const r = p.clone().sub(axis).setY(0);
    return r.lengthSq() < 1e-6 ? new Vector3(1, 0, 0) : r.normalize();
  };

  // Активная зона регулировки: панель на ~середине высоты облицовки, со стороны камеры
  const midY = (panelsBox.min.y + panelsBox.max.y) / 2;
  let active = panelsBox.getCenter(new Vector3());
  let best = -Infinity;
  panelsWorld.forEach((g) => {
    const pc = boxOf(g).getCenter(new Vector3());
    const score = radialOf(pc).dot(FACING) * 2 - Math.abs(pc.y - midY) / (0.15 * D);
    if (score > best) {
      best = score;
      active = pc;
    }
  });
  const adjustDir = radialOf(active);
  const sigma = 0.07 * D;

  const panels: Panel[] = panelsWorld.map((g, i) => {
    const center = boxOf(g).getCenter(new Vector3());
    g.translate(-center.x, -center.y, -center.z);
    g.computeVertexNormals();
    const radial = radialOf(center);
    const d = center.distanceTo(active);
    return {
      geo: g,
      center,
      radial,
      weight: Math.exp(-(d * d) / (2 * sigma * sigma)),
      scatter: radial.clone().multiplyScalar(D * (0.25 + hash(i) * 0.35)).add(new Vector3(0, (hash(i + 1) - 0.3) * D * 0.4, 0)),
      delay: (center.y / H) * 0.35 + hash(i + 3) * 0.3,
    };
  });

  // Слои подсистемы по размеру детали
  const bearing: BufferGeometry[] = [];
  const near: BufferGeometry[] = [];
  const far: BufferGeometry[] = [];
  const fasteners: BufferGeometry[] = [];
  const sz = new Vector3();
  const cc = new Vector3();
  partsWorld.forEach((g) => {
    const b = boxOf(g);
    const L = Math.max(...b.getSize(sz).toArray());
    if (L < 0.0033 * D) fasteners.push(g);
    else if (L < 0.026 * D) (b.getCenter(cc).distanceTo(active) < 0.11 * D ? near : far).push(g);
    else bearing.push(g);
  });

  // Основание: плита пола под колонной и перекрытие, к которому идут тяжи
  const foot = new Box3();
  partsWorld.forEach((g) => {
    const b = boxOf(g);
    if (b.min.y < 0.08 * H) foot.union(b);
  });
  const fs = foot.isEmpty() ? new Vector3(0.6, 0, 0.6) : foot.getSize(new Vector3());
  const fc = foot.isEmpty() ? axis.clone() : foot.getCenter(new Vector3());
  const ps = partsBox.getSize(new Vector3());
  const pcen = partsBox.getCenter(new Vector3());
  const floor: Slab = {
    position: new Vector3(fc.x, -0.015 * D, fc.z),
    size: [Math.max(fs.x * 3.2, 0.5 * D), 0.03 * D, Math.max(fs.z * 3.2, 0.5 * D)],
  };
  const ceiling: Slab = {
    position: new Vector3(pcen.x, H + 0.012 * D, pcen.z),
    size: [ps.x * 1.25, 0.024 * D, ps.z * 1.25],
  };

  cache = {
    panels,
    bearing: merge(bearing),
    nodesNear: merge(near),
    nodesFar: merge(far),
    fasteners: merge(fasteners),
    adjustDir,
    size: D,
    height: H,
    floor,
    ceiling,
  };
  return cache;
}

export default function RealSubsystem({ stateRef, dark = true }: { stateRef: MutableRefObject<ShellState>; dark?: boolean }) {
  const { scene } = useGLTF(REAL_MODEL_PATH);
  const model = useMemo(() => prepare(scene), [scene]);

  const graphite = dark ? "#5a5853" : "#3a3936";
  const mats = useMemo(
    () => ({
      panel: new MeshStandardMaterial({ color: "#ebe6dc", metalness: 0.4, roughness: 0.36, side: DoubleSide, transparent: true }),
      bearing: new MeshStandardMaterial({ color: graphite, metalness: 0.65, roughness: 0.4, transparent: true }),
      node: new MeshStandardMaterial({ color: "#ff5a00", metalness: 0.35, roughness: 0.42, transparent: true }),
      fast: new MeshStandardMaterial({ color: "#a29e95", metalness: 0.7, roughness: 0.35, transparent: true }),
      base: new MeshStandardMaterial({ color: dark ? "#2b2a28" : "#cdc8bd", roughness: 0.9, transparent: true }),
    }),
    [dark, graphite],
  );

  const root = useRef<Group>(null);
  const floorRef = useRef<Mesh>(null);
  const ceilRef = useRef<Mesh>(null);
  const nearRef = useRef<Mesh>(null);
  const panelRefs = useRef<(Mesh | null)[]>([]);
  const cur = useRef({ explode: 0, assemble: 1, adjust: 0, o: {} as Record<string, number> });
  const tmp = useMemo(() => new Color(), []);

  useFrame((state, dt) => {
    const st = stateRef.current;
    const c = cur.current;
    const k = 1 - Math.pow(0.0025, dt);
    c.explode += (st.explode - c.explode) * k;
    c.assemble += (st.assemble - c.assemble) * Math.min(1, k * 0.6);
    c.adjust += ((st.layer === "adjust" ? 1 : 0) - c.adjust) * k;
    if (root.current) root.current.rotation.y = st.spin;

    // Подсветка слоёв
    const L = st.layer;
    const focus: Record<string, boolean> = {
      base: L === "base",
      bearing: L === "bearing",
      nodes: L === "nodes" || L === "adjust",
      shell: L === "shell" || L === "adjust",
    };
    const ease = (key: string, target: number) => (c.o[key] = (c.o[key] ?? target) + (target - (c.o[key] ?? target)) * k);
    const dim = (key: string) => ease(key, L === "all" || focus[key] ? 1 : 0.12);
    const hi = (key: string) => ease(`h${key}`, focus[key] && L !== "all" ? 1 : 0);

    mats.base.opacity = dim("base");
    mats.bearing.opacity = dim("bearing");
    mats.node.opacity = mats.fast.opacity = dim("nodes");
    mats.panel.opacity = Math.min(dim("shell"), 0.2 + c.assemble);

    const hb = hi("bearing");
    mats.bearing.color.set(graphite).lerp(ORANGE, hb);
    mats.bearing.emissive.copy(ORANGE).multiplyScalar(hb * 0.25);
    mats.base.color.set(dark ? "#2b2a28" : "#cdc8bd").lerp(ORANGE, hi("base") * 0.55);
    mats.node.emissive.copy(ORANGE).multiplyScalar(0.12 + hi("nodes") * 0.6);
    mats.fast.color.copy(tmp.set("#a29e95")).lerp(ORANGE, hi("nodes") * 0.5);

    // Разнесение: облицовка раскрывается от оси, пол и перекрытие расходятся
    const D = model.size;
    const e = c.explode;
    if (floorRef.current) floorRef.current.position.copy(model.floor.position).setY(model.floor.position.y - e * 0.1 * D);
    if (ceilRef.current) ceilRef.current.position.copy(model.ceiling.position).setY(model.ceiling.position.y + e * 0.07 * D);

    // Регулировка: узлы активной зоны и облицовка над ними «дышат» наружу/внутрь
    const wave = Math.sin(state.clock.elapsedTime * 1.7) * c.adjust * 0.022 * D;
    if (nearRef.current) nearRef.current.position.copy(model.adjustDir).multiplyScalar(wave);

    model.panels.forEach((p, i) => {
      const m = panelRefs.current[i];
      if (!m) return;
      const a = easeOut((c.assemble - p.delay) / 0.45);
      m.position
        .copy(p.center)
        .addScaledVector(p.radial, e * 0.1 * D + wave * p.weight)
        .addScaledVector(p.scatter, 1 - a);
      m.rotation.set((1 - a) * (hash(i) - 0.5) * 1.2, 0, (1 - a) * (hash(i + 7) - 0.5) * 1.2);
    });
  });

  return (
    <group ref={root}>
      <mesh ref={floorRef} position={model.floor.position} material={mats.base}>
        <boxGeometry args={model.floor.size} />
      </mesh>
      <mesh ref={ceilRef} position={model.ceiling.position} material={mats.base}>
        <boxGeometry args={model.ceiling.size} />
      </mesh>
      <mesh geometry={model.bearing} material={mats.bearing} />
      <mesh geometry={model.nodesFar} material={mats.node} />
      <mesh ref={nearRef} geometry={model.nodesNear} material={mats.node} />
      <mesh geometry={model.fasteners} material={mats.fast} />
      <group>
        {model.panels.map((p, i) => (
          <mesh
            key={i}
            ref={(m) => {
              panelRefs.current[i] = m;
            }}
            geometry={p.geo}
            material={mats.panel}
            position={p.center}
          />
        ))}
      </group>
    </group>
  );
}
