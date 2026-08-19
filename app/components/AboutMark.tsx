"use client";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { SVGLoader } from "three-stdlib";
import {
  Box3,
  CanvasTexture,
  ExtrudeGeometry,
  RepeatWrapping,
  Vector3,
  type BufferGeometry,
  type Group,
  type ShapePath,
  type Texture,
} from "three";

const SPIN_SPEED = 0.6; // rad/s — the whole mark turns as one (~10.5s per turn)
const BASE_ROT_X = -0.16; // slight downward tilt so the extruded metal thickness reads

// Brand mark ("знак") straight from the logo: the STRUKTURA "S" with the "+" to its
// upper-right. Both paths live in one SVG so their relative placement is already correct.
const S_PATH =
  "M537.476 567.327C505.357 531.963 457.761 506.828 394.106 492.215L272.928 462.989C236.428 454.513 210.148 441.946 194.089 425.579C178.321 409.212 170.437 387.293 170.437 359.235C170.437 327.963 181.241 302.536 202.849 282.078C224.748 261.912 255.7 251.975 296.287 251.975C341.839 251.975 376.002 264.25 398.194 289.092C420.386 314.227 434.11 342.869 439.366 375.602L581.568 353.39C569.888 285 540.98 230.932 494.261 191.184C447.542 151.728 382.718 131.855 299.791 131.855C246.064 131.855 198.761 141.499 157.589 160.789C116.418 180.37 84.2981 207.551 61.2304 242.622C38.4546 277.694 27.0668 319.195 27.0668 367.419C27.0668 435.808 45.1706 486.662 81.6701 519.98C118.17 553.59 166.933 577.556 227.376 592.461L348.555 620.518C383.594 628.117 407.83 640.392 421.554 656.467C434.986 672.834 441.702 695.046 441.702 723.103C441.702 756.421 429.438 782.432 404.618 800.552C379.506 818.965 346.511 828.025 305.339 828.025C257.16 828.025 220.66 816.627 195.841 793.538C171.021 770.742 154.085 738.885 144.741 698.553L0.203125 721.934C14.2189 799.676 46.9225 856.667 98.0219 893.2C149.413 930.025 216.864 948.145 300.959 948.145C356.731 948.145 406.078 939.085 448.71 921.257C491.633 903.429 524.921 877.418 548.864 843.223C573.1 809.028 585.072 766.942 585.072 717.258C585.072 652.667 569.304 602.69 537.476 567.327Z";
const PLUS_PATH =
  "M1080 287.918V372.09H935.462V516.76H851.659V372.09H707.121V287.918H851.659V143.54H935.462V287.918H1080Z";
const SIGN_SVG = `<svg viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg"><path d="${S_PATH}"/><path d="${PLUS_PATH}"/></svg>`;

/** Fine grain used as roughness + micro-bump so the matte black metal has a real,
 *  non-uniform blasted surface instead of a flat CG look. */
function makeSurfaceTexture(): Texture | null {
  if (typeof document === "undefined") return null;
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = 184 + Math.floor(Math.random() * 71);
    img.data[i * 4] = v;
    img.data[i * 4 + 1] = v;
    img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.anisotropy = 4;
  return tex;
}

/** Parse the brand mark SVG → extrude each glyph → center & normalise the whole group
 *  so the "S" and "+" keep their relative placement and spin around a shared center. */
function buildSignGeometries(): BufferGeometry[] {
  const loader = new SVGLoader();
  const { paths } = loader.parse(SIGN_SVG);

  const geos: ExtrudeGeometry[] = [];
  for (const path of paths) {
    // three-stdlib's parsed path vs @types/three's ShapePath differ only in userData optionality.
    for (const shape of SVGLoader.createShapes(path as unknown as ShapePath)) {
      geos.push(
        new ExtrudeGeometry(shape, {
          depth: 200,
          bevelEnabled: true,
          bevelThickness: 12,
          bevelSize: 8,
          bevelSegments: 3,
          curveSegments: 12,
        }),
      );
    }
  }

  // SVG's Y axis points down — turn the glyph upright. A 180° turn around X, not
  // scale(1,-1,1): mirroring flips triangle winding without flipping the stored normals,
  // so every face renders as a back face and the mark looks hollow / see-through when it
  // spins. A rotation keeps handedness (same silhouette, correct winding).
  geos.forEach((g) => g.rotateX(Math.PI));

  // One combined bounding box → shared center + uniform scale for the whole mark.
  const bb = new Box3();
  geos.forEach((g) => {
    g.computeBoundingBox();
    if (g.boundingBox) bb.union(g.boundingBox);
  });
  const center = new Vector3();
  const dims = new Vector3();
  bb.getCenter(center);
  bb.getSize(dims);
  const fit = 2.0 / Math.max(dims.x, dims.y);
  geos.forEach((g) => {
    g.translate(-center.x, -center.y, -center.z);
    g.scale(fit, fit, fit);
  });

  return geos;
}

function Sign({ reduced }: { reduced: boolean }) {
  const ref = useRef<Group>(null);
  const geometries = useMemo(buildSignGeometries, []);
  const surface = useMemo(makeSurfaceTexture, []);

  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    const d = Math.min(delta, 0.05);

    if (reduced) {
      g.rotation.set(BASE_ROT_X, 0, 0);
      g.position.y = 0;
      return;
    }

    // The S and the + share this group, so they turn together as one object.
    g.rotation.x = BASE_ROT_X;
    g.rotation.y += d * SPIN_SPEED;
    g.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.03;
  });

  return (
    <group ref={ref} rotation={[BASE_ROT_X, 0, 0]}>
      {geometries.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <meshStandardMaterial
            color="#1f1f1f"
            metalness={0.86}
            roughness={0.52}
            roughnessMap={surface ?? undefined}
            bumpMap={surface ?? undefined}
            bumpScale={0.004}
            envMapIntensity={1.5}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Static black mark shown if WebGL is unavailable or the 3D canvas throws. */
function StaticSignFallback() {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 1080 1080" className="w-[64%] h-[64%]" fill="#171717">
        <path d={S_PATH} />
        <path d={PLUS_PATH} />
      </svg>
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

export default function AboutMark() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <CanvasErrorBoundary fallback={<StaticSignFallback />}>
      <Suspense fallback={<StaticSignFallback />}>
        <Canvas
          className="absolute inset-0"
          camera={{ position: [0, 0, 6.6], fov: 30 }}
          dpr={[1, 1.75]}
          gl={{ alpha: true, antialias: true }}
          style={{ pointerEvents: "none", touchAction: "pan-y" }}
        >
          <ambientLight intensity={0.35} />
          <directionalLight position={[4, 6, 5]} intensity={1.7} color="#ffffff" />
          <directionalLight position={[-5, 1, -2]} intensity={0.5} color="#cdd6e6" />

          {/* Neutral studio so the black metal reads as metal (not tinted). */}
          <Environment resolution={512}>
            <Lightformer form="rect" position={[0, 4, 6]} scale={[10, 10, 1]} intensity={3.6} color="#f4f6fa" />
            <Lightformer form="rect" position={[-6, 1, 2]} scale={[4, 10, 1]} intensity={1.4} color="#eef1f6" />
            <Lightformer form="rect" position={[6, 0, 3]} scale={[4, 10, 1]} intensity={1.1} color="#dfe7ff" />
            <Lightformer form="ring" position={[2, 3, -6]} scale={[6, 6, 1]} intensity={2.4} color="#ffffff" />
            <Lightformer form="rect" position={[0, -5, 2]} scale={[10, 3, 1]} intensity={0.5} color="#1c2028" />
          </Environment>

          <Sign reduced={reduced} />
        </Canvas>
      </Suspense>
    </CanvasErrorBoundary>
  );
}
