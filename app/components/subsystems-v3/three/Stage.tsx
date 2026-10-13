"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Vector3 } from "three";

/** Монтирует Canvas только рядом с вьюпортом и ставит рендер на паузу вне экрана. */
export function useNearViewport<T extends HTMLElement>(margin = "300px") {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, near] as const;
}

/** Плавный «дрейф» камеры за курсором. */
function CameraRig({ target, base, parallax }: { target: [number, number, number]; base: [number, number, number]; parallax: number }) {
  const { camera, pointer } = useThree();
  const look = useRef(new Vector3(...target));
  const pos = useRef(new Vector3(...base));
  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.02, dt);
    pos.current.set(base[0] + pointer.x * parallax, base[1] + pointer.y * parallax * 0.5, base[2]);
    camera.position.lerp(pos.current, k);
    look.current.set(...target);
    camera.lookAt(look.current);
  });
  return null;
}

export default function Stage({
  children,
  camera = [7.2, 4.4, 7.6],
  target = [0, 1.3, 0],
  fov = 34,
  parallax = 0.8,
  className = "",
  dark = true,
}: {
  children: ReactNode;
  camera?: [number, number, number];
  target?: [number, number, number];
  fov?: number;
  parallax?: number;
  className?: string;
  dark?: boolean;
}) {
  const [ref, near] = useNearViewport<HTMLDivElement>();
  return (
    <div ref={ref} className={className}>
      {near && (
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: camera, fov, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={dark ? 0.35 : 0.85} />
          <directionalLight position={[5, 9, 4]} intensity={dark ? 2.2 : 1.8} />
          <directionalLight position={[-6, 3, -4]} intensity={0.6} color="#ffb48a" />
          <Environment resolution={256}>
            <Lightformer intensity={2.4} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 6, 1]} />
            <Lightformer intensity={1.4} position={[-6, 2, 3]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
            <Lightformer intensity={1.2} color="#ff7a30" position={[6, 1, -3]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
          </Environment>
          <CameraRig target={target} base={camera} parallax={parallax} />
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      )}
    </div>
  );
}
