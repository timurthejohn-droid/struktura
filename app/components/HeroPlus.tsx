"use client";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { ExtrudeGeometry, MathUtils, Shape, type Group } from "three";

const ORANGE = "#ff5a00";

// Resting pose — a slight 3/4 view so the extruded metal thickness reads as 3D.
const BASE_ROT_X = -0.16;
const BASE_ROT_Y = -0.42;
// How far the plus leans toward the cursor.
const MAX_TILT_X = 0.28; // pitch (vertical mouse)
const MAX_TILT_Y = 0.5; // yaw (horizontal mouse)
const DAMP = 3.4; // lower = smoother / slower follow

type Pointer = { x: number; y: number };

/** Procedural "+" outline → extruded with a bevel for crisp metallic edges. */
function buildPlusGeometry() {
  const e = 1; // half-extent (arm tip)
  const t = 0.33; // half-thickness of the bars
  const shape = new Shape();
  shape.moveTo(-t, -e);
  shape.lineTo(t, -e);
  shape.lineTo(t, -t);
  shape.lineTo(e, -t);
  shape.lineTo(e, t);
  shape.lineTo(t, t);
  shape.lineTo(t, e);
  shape.lineTo(-t, e);
  shape.lineTo(-t, t);
  shape.lineTo(-e, t);
  shape.lineTo(-e, -t);
  shape.lineTo(-t, -t);
  shape.closePath();

  const geo = new ExtrudeGeometry(shape, {
    depth: 0.62,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.07,
    bevelSegments: 4,
    curveSegments: 2,
  });
  geo.center();
  return geo;
}

function Plus({ pointer, reduced }: { pointer: MutableRefObject<Pointer>; reduced: boolean }) {
  const ref = useRef<Group>(null);
  const geometry = useMemo(buildPlusGeometry, []);

  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    const d = Math.min(delta, 0.05); // clamp to keep damping stable on frame drops

    if (reduced) {
      g.rotation.set(BASE_ROT_X, BASE_ROT_Y, 0);
      g.position.y = 0;
      return;
    }

    const t = state.clock.elapsedTime;
    const targetY = BASE_ROT_Y + pointer.current.x * MAX_TILT_Y;
    const targetX = BASE_ROT_X + pointer.current.y * MAX_TILT_X;

    g.rotation.y = MathUtils.damp(g.rotation.y, targetY, DAMP, d);
    g.rotation.x = MathUtils.damp(g.rotation.x, targetX, DAMP, d);
    // Gentle idle life so the object breathes even when the mouse is still.
    g.rotation.z = Math.sin(t * 0.5) * 0.03;
    g.position.y = Math.sin(t * 0.9) * 0.03;
  });

  return (
    <group ref={ref} rotation={[BASE_ROT_X, BASE_ROT_Y, 0]} scale={1.45}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={ORANGE} metalness={1} roughness={0.26} envMapIntensity={1.7} />
      </mesh>
    </group>
  );
}

/** Pure-CSS "+" shown if WebGL is unavailable or the 3D canvas throws. */
function StaticPlusFallback() {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center">
      <div
        style={{
          width: "min(42%, 220px)",
          aspectRatio: "1 / 1",
          background: `linear-gradient(145deg, #ff8a3d 0%, ${ORANGE} 45%, #b23f00 100%)`,
          clipPath:
            "polygon(35% 0, 65% 0, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0 65%, 0 35%, 35% 35%)",
          transform: "rotate(-6deg)",
        }}
      />
    </div>
  );
}

class CanvasErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function HeroPlus() {
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Track the cursor across the whole viewport (the canvas itself ignores pointer events).
  useEffect(() => {
    const onMove = (ev: PointerEvent) => {
      pointer.current.x = (ev.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (ev.clientY / window.innerHeight) * 2 - 1;
    };
    const onLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <CanvasErrorBoundary fallback={<StaticPlusFallback />}>
      <Suspense fallback={<StaticPlusFallback />}>
        <Canvas
          className="absolute inset-0"
          camera={{ position: [0, 0, 6.6], fov: 30 }}
          dpr={[1, 1.75]}
          gl={{ alpha: true, antialias: true }}
          style={{ pointerEvents: "none", touchAction: "pan-y" }}
        >
          <ambientLight intensity={0.55} />
          <directionalLight position={[4, 6, 5]} intensity={2.2} color="#fff3e8" />
          <directionalLight position={[-5, -2, -3]} intensity={1.0} color={ORANGE} />

          <Environment resolution={256}>
            <Lightformer position={[0, 3, 4]} scale={[7, 7, 1]} intensity={2.2} color="#ffffff" />
            <Lightformer position={[-4, 1, 2]} scale={[3, 7, 1]} intensity={1.5} color="#ff8a3d" />
            <Lightformer position={[4, -1, 2]} scale={[3, 7, 1]} intensity={1.0} color="#ffffff" />
            <Lightformer position={[0, -4, 2]} scale={[7, 3, 1]} intensity={0.6} color="#2a1c12" />
          </Environment>

          <Plus pointer={pointer} reduced={reduced} />
        </Canvas>
      </Suspense>
    </CanvasErrorBoundary>
  );
}
