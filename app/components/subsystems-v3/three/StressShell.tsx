"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import { BufferAttribute, Color, DoubleSide, Group, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry } from "three";

const SEG_U = 64;
const SEG_V = 36;
const STOPS = ["#1d4fa8", "#2fa39a", "#e8cc44", "#d6411f"].map((c) => new Color(c));

function ramp(t: number, out: Color) {
  const x = Math.min(0.999, Math.max(0, t)) * (STOPS.length - 1);
  const i = Math.floor(x);
  return out.copy(STOPS[i]).lerp(STOPS[i + 1], x - i);
}

/**
 * Оболочка-свод под нагрузкой: цвет — величина перемещения.
 * loadRef — 0..1, нагрузка задаётся снаружи.
 */
export default function StressShell({ loadRef }: { loadRef: MutableRefObject<number> }) {
  const group = useRef<Group>(null);
  const geo = useMemo(() => {
    const g = new PlaneGeometry(1, 1, SEG_U, SEG_V);
    g.setAttribute("color", new BufferAttribute(new Float32Array(g.attributes.position.count * 3), 3));
    return g;
  }, []);
  const mat = useMemo(() => new MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0.1, side: DoubleSide, flatShading: false }), []);
  const wire = useMemo(() => new MeshBasicMaterial({ color: "#ffffff", wireframe: true, transparent: true, opacity: 0.08 }), []);
  const c = useMemo(() => new Color(), []);
  const cur = useRef(0);

  useFrame((state, dt) => {
    cur.current += (loadRef.current - cur.current) * (1 - Math.pow(0.02, dt));
    const L = cur.current;
    const pos = geo.attributes.position as BufferAttribute;
    const col = geo.attributes.color as BufferAttribute;
    for (let k = 0; k < pos.count; k++) {
      const iu = k % (SEG_U + 1);
      const iv = Math.floor(k / (SEG_U + 1));
      const u = iu / SEG_U;
      const v = iv / SEG_V;
      // Форма свода
      const x = (u - 0.5) * 6.2;
      const z = (v - 0.5) * 3.6;
      const arch = Math.sin(Math.PI * u) * 1.5 * (1 - 0.18 * (2 * v - 1) ** 2);
      // Перемещение: максимум в пролёте, опоры по торцам
      const d = Math.sin(Math.PI * u) ** 2 * (0.75 + 0.25 * Math.sin(Math.PI * v)) * (1 + 0.25 * Math.sin(u * 9 + state.clock.elapsedTime * 0.6) * 0.2);
      pos.setXYZ(k, x, arch - d * L * 0.42, z);
      ramp(d * (0.15 + L * 0.85), c);
      col.setXYZ(k, c.r, c.g, c.b);
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
    geo.computeVertexNormals();
    if (group.current) group.current.rotation.y = -0.5 + Math.sin(state.clock.elapsedTime * 0.15) * 0.25;
  });

  return (
    <group ref={group}>
      <mesh geometry={geo} material={mat} />
      <mesh geometry={geo} material={wire} />
      {/* опоры */}
      {[-3.1, 3.1].map((x) =>
        [-1.8, 0, 1.8].map((z) => (
          <mesh key={`${x}${z}`} position={[x, -0.12, z]}>
            <coneGeometry args={[0.14, 0.24, 4]} />
            <meshStandardMaterial color="#8d8a83" />
          </mesh>
        )),
      )}
    </group>
  );
}
