"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, Group, Mesh, MeshPhysicalMaterial, MeshStandardMaterial } from "three";

export type MatParams = {
  color: string;
  metalness: number;
  roughness: number;
  transmission: number;
  clearcoat: number;
  /** толщина панели */
  thick: number;
  /** кронштейнов на одну стойку (2–5) */
  supports: number;
  /** сечение стоек */
  rail: number;
  /** зазор между панелями */
  gap: number;
};

const COLS = 4;
const ROWS = 3;
const R = 4;
const ARC = 1.3;
const H = 1.1;
const MAX_SUP = 5;

/**
 * Фрагмент облицовки на подсистеме: изогнутая стена из панелей,
 * за ней стойки и кронштейны до основания-стены.
 */
export default function MaterialFragment({ params }: { params: MatParams }) {
  const group = useRef<Group>(null);
  const panelMat = useMemo(
    () => new MeshPhysicalMaterial({ color: "#cccccc", metalness: 0.5, roughness: 0.4, thickness: 0.4, ior: 1.5, transparent: true }),
    [],
  );
  const railMat = useMemo(() => new MeshStandardMaterial({ color: "#45443f", metalness: 0.7, roughness: 0.4 }), []);
  const bracketMat = useMemo(() => new MeshStandardMaterial({ color: "#ff5a00", metalness: 0.35, roughness: 0.45 }), []);
  const wallMat = useMemo(() => new MeshStandardMaterial({ color: "#d2cdc3", roughness: 0.95 }), []);

  const panels = useRef<(Mesh | null)[]>([]);
  const rails = useRef<(Mesh | null)[]>([]);
  const brackets = useRef<(Mesh | null)[]>([]);
  const cur = useRef({ thick: 0.04, rail: 1, gap: 0.04, sup: [1, 1, 1, 1, 1] });
  const tc = useMemo(() => new Color(), []);

  const angle = (c: number) => -ARC / 2 + (c + 0.5) * (ARC / COLS);
  const railAngle = (k: number) => -ARC / 2 + k * (ARC / COLS);

  useFrame((state, dt) => {
    const k = 1 - Math.pow(0.004, dt);
    const c = cur.current;
    c.thick += (params.thick - c.thick) * k;
    c.rail += (params.rail - c.rail) * k;
    c.gap += (params.gap - c.gap) * k;

    tc.set(params.color);
    panelMat.color.lerp(tc, k);
    panelMat.metalness += (params.metalness - panelMat.metalness) * k;
    panelMat.roughness += (params.roughness - panelMat.roughness) * k;
    panelMat.transmission += (params.transmission - panelMat.transmission) * k;
    panelMat.clearcoat += (params.clearcoat - panelMat.clearcoat) * k;

    const w = 2 * R * Math.sin(ARC / COLS / 2);
    panels.current.forEach((m) => {
      if (!m) return;
      m.scale.set(w - c.gap, H - c.gap, c.thick);
    });
    rails.current.forEach((m) => {
      if (!m) return;
      m.scale.set(c.rail, 1, c.rail);
    });
    // кронштейны: видимы первые N по высоте, равномерно
    for (let i = 0; i < MAX_SUP; i++) {
      const target = i < params.supports ? 1 : 0;
      c.sup[i] += (target - c.sup[i]) * k;
    }
    brackets.current.forEach((m, idx) => {
      if (!m) return;
      const i = idx % MAX_SUP;
      const n = Math.max(params.supports, 1);
      const y = 0.25 + (Math.min(i, n - 1) / Math.max(n - 1, 1)) * (ROWS * H - 0.5);
      m.position.y += (y - m.position.y) * k;
      const s = Math.max(0.001, c.sup[i]) * (0.6 + c.rail * 0.4);
      m.scale.set(s, s, Math.max(0.001, c.sup[i]));
    });

    if (group.current) group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.18 - 0.2;
  });

  const zWall = -(R * (1 - Math.cos(ARC / 2)) + 0.75);

  return (
    <group ref={group} position={[0, -ROWS * H * 0.5, 0]}>
      {/* стена-основание */}
      <mesh position={[0, (ROWS * H) / 2, zWall - 0.05]} material={wallMat}>
        <boxGeometry args={[6.6, ROWS * H + 1, 0.1]} />
      </mesh>
      {/* панели */}
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const a = angle(col);
        // Вырез: крайний пролёт без облицовки — видно подсистему
        if (col === COLS - 1 && row > 0) return null;
        return (
          <mesh
            key={i}
            ref={(m) => {
              panels.current[i] = m;
            }}
            material={panelMat}
            position={[Math.sin(a) * R, row * H + H / 2, Math.cos(a) * R - R]}
            rotation={[0, a, 0]}
          >
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
        );
      })}
      {/* стойки подсистемы */}
      {Array.from({ length: COLS + 1 }, (_, k) => {
        const a = railAngle(k);
        const r = R - 0.28;
        return (
          <mesh
            key={k}
            ref={(m) => {
              rails.current[k] = m;
            }}
            material={railMat}
            position={[Math.sin(a) * r, (ROWS * H) / 2, Math.cos(a) * r - R]}
            rotation={[0, a, 0]}
          >
            <boxGeometry args={[0.07, ROWS * H + 0.2, 0.07]} />
          </mesh>
        );
      })}
      {/* ригели между стойками */}
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const k = i % COLS;
        const row = Math.floor(i / COLS);
        const a0 = railAngle(k);
        const a1 = railAngle(k + 1);
        const r = R - 0.2;
        const mid = (a0 + a1) / 2;
        const len = 2 * r * Math.sin((a1 - a0) / 2);
        return (
          <mesh key={`g${i}`} material={railMat} position={[Math.sin(mid) * r, row * H + H / 2, Math.cos(mid) * r - R]} rotation={[0, mid, 0]}>
            <boxGeometry args={[len, 0.05, 0.05]} />
          </mesh>
        );
      })}
      {/* кронштейны до стены */}
      {Array.from({ length: (COLS + 1) * MAX_SUP }, (_, idx) => {
        const k = Math.floor(idx / MAX_SUP);
        const a = railAngle(k);
        const r0 = R - 0.28;
        const x = Math.sin(a) * r0;
        const z0 = Math.cos(a) * r0 - R;
        const len = z0 - zWall;
        return (
          <mesh
            key={idx}
            ref={(m) => {
              brackets.current[idx] = m;
            }}
            material={bracketMat}
            position={[x, 1, (z0 + zWall) / 2]}
          >
            <boxGeometry args={[0.09, 0.06, Math.max(len, 0.1)]} />
          </mesh>
        );
      })}
    </group>
  );
}
