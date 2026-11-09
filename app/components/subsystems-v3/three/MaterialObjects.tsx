"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, RoundedBox } from "@react-three/drei";
import { Suspense, useMemo, useRef, type ReactNode } from "react";
import { CanvasTexture, DoubleSide, LatheGeometry, PlaneGeometry, RepeatWrapping, SRGBColorSpace, Vector2, type Group } from "three";
import { useNearViewport } from "./Stage";

export type MaterialShape = "metal" | "glass" | "stone" | "ceramic" | "composite";

/** Сглаженный value-noise с октавами — основа процедурных фактур. */
function makeNoise(seed: number) {
  const N = 64;
  let st = seed;
  const rnd = () => ((st = (st * 16807) % 2147483647) / 2147483647);
  const grid = Array.from({ length: N * N }, rnd);
  const at = (x: number, y: number) => grid[((y % N) + N) % N * N + (((x % N) + N) % N)];
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const value = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const fx = smooth(x - xi), fy = smooth(y - yi);
    const a = at(xi, yi), b = at(xi + 1, yi), c = at(xi, yi + 1), d = at(xi + 1, yi + 1);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  };
  return (x: number, y: number, oct = 5) => {
    let sum = 0, amp = 0.5, f = 1;
    for (let o = 0; o < oct; o++) {
      sum += value(x * f, y * f) * amp;
      amp *= 0.5;
      f *= 2;
    }
    return sum;
  };
}

function canvasTexture(size: number, draw: (img: ImageData) => void, repeat = 1) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  draw(img);
  ctx.putImageData(img, 0, 0);
  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(repeat, repeat);
  return t;
}

/** Камень: тёплый известняк/гранит — пятна, мелкое зерно и редкие прожилки. */
function useStoneTextures(seed: number) {
  return useMemo(() => {
    const S = 512;
    const n = makeNoise(seed);
    const grain = makeNoise(seed * 7 + 3);
    const h = new Float32Array(S * S);
    for (let y = 0; y < S; y++)
      for (let x = 0; x < S; x++) {
        const u = x / S * 8, v = y / S * 8;
        const mottle = n(u, v);
        const vein = Math.pow(1 - Math.abs(Math.sin((u + n(u * 0.5, v * 0.5, 4) * 6) * 1.4)), 14);
        const speck = grain(u * 9, v * 9, 2);
        h[y * S + x] = mottle * 0.7 + speck * 0.3 - vein * 0.35;
      }
    const map = canvasTexture(S, (img) => {
      for (let i = 0; i < S * S; i++) {
        const k = h[i];
        const dark = Math.random() < 0.012 ? 0.55 : 1;
        img.data[i * 4] = (150 + k * 85) * dark;
        img.data[i * 4 + 1] = (136 + k * 80) * dark;
        img.data[i * 4 + 2] = (114 + k * 72) * dark;
        img.data[i * 4 + 3] = 255;
      }
    });
    map.colorSpace = SRGBColorSpace;
    const bump = canvasTexture(S, (img) => {
      for (let i = 0; i < S * S; i++) {
        const k = Math.max(0, Math.min(255, h[i] * 255 + (Math.random() - 0.5) * 40));
        img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = k;
        img.data[i * 4 + 3] = 255;
      }
    });
    return { map, bump };
  }, [seed]);
}

/** Карбон: саржевое плетение 2×2 — пучки волокон с бликом по центру. */
function useCarbonTextures() {
  return useMemo(() => {
    const S = 512, cells = 16, cs = S / cells;
    const shade = new Float32Array(S * S);
    for (let y = 0; y < S; y++)
      for (let x = 0; x < S; x++) {
        const i = Math.floor(x / cs), j = Math.floor(y / cs);
        const horizontal = (i + j) % 4 < 2;
        const across = horizontal ? (y % cs) / cs : (x % cs) / cs;
        const along = horizontal ? (x % cs) / cs : (y % cs) / cs;
        const tow = Math.sin(across * Math.PI); // скруглённый пучок
        const fibers = 0.85 + 0.15 * Math.sin((horizontal ? y : x) * 2.1);
        const ends = 0.75 + 0.25 * Math.sin(along * Math.PI);
        shade[y * S + x] = tow * fibers * ends * (horizontal ? 1 : 0.62);
      }
    const map = canvasTexture(
      S,
      (img) => {
        for (let i = 0; i < S * S; i++) {
          const k = 18 + shade[i] * 70;
          img.data[i * 4] = k;
          img.data[i * 4 + 1] = k;
          img.data[i * 4 + 2] = k + 4;
          img.data[i * 4 + 3] = 255;
        }
      },
      3,
    );
    map.colorSpace = SRGBColorSpace;
    const bump = canvasTexture(
      S,
      (img) => {
        for (let i = 0; i < S * S; i++) {
          const k = shade[i] * 255;
          img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = k;
          img.data[i * 4 + 3] = 255;
        }
      },
      3,
    );
    return { map, bump };
  }, []);
}

/** Медленное вращение; при наведении на карточку — быстрее. */
function Spin({ hover, speed = 0.35, children }: { hover: boolean; speed?: number; children: ReactNode }) {
  const ref = useRef<Group>(null);
  const v = useRef(speed);
  useFrame((_, dt) => {
    v.current += ((hover ? speed * 4 : speed) - v.current) * Math.min(1, dt * 3);
    if (ref.current) ref.current.rotation.y += v.current * dt;
  });
  return <group ref={ref}>{children}</group>;
}

/** Металл — полированный узел-лента. */
function Metal() {
  return (
    <mesh rotation={[0.5, 0, 0.2]}>
      <torusKnotGeometry args={[0.78, 0.2, 220, 32, 2, 3]} />
      <meshStandardMaterial color="#c9ced3" metalness={1} roughness={0.22} />
    </mesh>
  );
}

/** Стекло — двояковыпуклая линза. */
function Glass() {
  const geo = useMemo(() => {
    const R = 1.05, edge = 0.05, sag = 0.26;
    const pts: Vector2[] = [];
    const steps = 48;
    for (let k = 0; k <= steps; k++) {
      const r = (k / steps) * R;
      pts.push(new Vector2(r, edge + sag * (1 - (r / R) ** 2)));
    }
    for (let k = steps; k >= 0; k--) {
      const r = (k / steps) * R;
      pts.push(new Vector2(r, -edge - sag * (1 - (r / R) ** 2)));
    }
    // профиль снизу вверх — чтобы нормали смотрели наружу
    return new LatheGeometry(pts.reverse(), 96);
  }, []);
  return (
    <group rotation={[Math.PI / 2 - 0.35, 0, 0.25]}>
      <mesh geometry={geo}>
        <meshPhysicalMaterial
          color="#e4f2f4"
          transmission={1}
          thickness={0.9}
          roughness={0.02}
          ior={1.52}
          clearcoat={1}
          clearcoatRoughness={0}
          attenuationColor="#8ec3cc"
          attenuationDistance={1.6}
          specularIntensity={1}
          envMapIntensity={1.6}
        />
      </mesh>
    </group>
  );
}

/** Камень — стопка смещённых плит с фактурой природного камня. */
function Stone() {
  const { map, bump } = useStoneTextures(11);
  const slabs = [
    { y: -0.56, r: 0, tint: "#f2ece2" },
    { y: 0, r: 0.42, tint: "#e2d8c8" },
    { y: 0.56, r: 0.86, tint: "#fbf6ee" },
  ];
  return (
    <group rotation={[0.28, 0, 0]}>
      {slabs.map((s) => (
        <RoundedBox key={s.y} args={[1.7, 0.46, 1.1]} radius={0.035} smoothness={3} position={[0, s.y, 0]} rotation={[0, s.r, 0]}>
          <meshStandardMaterial color={s.tint} map={map} bumpMap={bump} bumpScale={1.6} roughness={0.88} metalness={0} />
        </RoundedBox>
      ))}
    </group>
  );
}

/** Керамика — закрученная колонна из плиток. */
function Ceramic() {
  const n = 11;
  return (
    <group rotation={[0.18, 0, 0.12]}>
      {Array.from({ length: n }, (_, i) => (
        <RoundedBox
          key={i}
          args={[1.5, 0.14, 0.62]}
          radius={0.03}
          smoothness={2}
          position={[0, (i - (n - 1) / 2) * 0.2, 0]}
          rotation={[0, i * 0.17, 0]}
        >
          <meshPhysicalMaterial color={i % 2 ? "#a3876a" : "#b89c7e"} roughness={0.42} clearcoat={0.5} clearcoatRoughness={0.3} />
        </RoundedBox>
      ))}
    </group>
  );
}

/** Композиты — гнутая волной карбоновая панель с лаковым покрытием. */
function Composite() {
  const { map, bump } = useCarbonTextures();
  const geo = useMemo(() => {
    const g = new PlaneGeometry(2.1, 1.7, 80, 40);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      p.setZ(i, Math.sin(x * 2.6) * 0.32);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geo} rotation={[-0.35, 0, 0.18]}>
      <meshPhysicalMaterial
        map={map}
        bumpMap={bump}
        bumpScale={0.8}
        roughness={0.38}
        metalness={0.35}
        clearcoat={1}
        clearcoatRoughness={0.06}
        side={DoubleSide}
      />
    </mesh>
  );
}

const SHAPES: Record<MaterialShape, () => JSX.Element> = {
  metal: Metal,
  glass: Glass,
  stone: Stone,
  ceramic: Ceramic,
  composite: Composite,
};

export default function MaterialObject({ shape, hover, className = "" }: { shape: MaterialShape; hover: boolean; className?: string }) {
  const [ref, near] = useNearViewport<HTMLDivElement>("200px");
  const Shape = SHAPES[shape];
  return (
    <div ref={ref} className={className}>
      {near && (
        <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0.4, 4.6], fov: 34 }} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 6, 5]} intensity={1.8} />
          <directionalLight position={[-5, 2, -3]} intensity={0.6} color="#ffb48a" />
          <Environment resolution={128}>
            <Lightformer intensity={2.2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 5, 1]} />
            <Lightformer intensity={1.4} position={[-5, 1, 3]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
            <Lightformer intensity={1} color="#ff7a30" position={[5, 0, -2]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} />
          </Environment>
          <Suspense fallback={null}>
            <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.5}>
              <Spin hover={hover}>
                <Shape />
              </Spin>
            </Float>
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
