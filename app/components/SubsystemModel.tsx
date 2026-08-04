"use client";

import { Component, Suspense, useEffect, useMemo, useRef, type ErrorInfo, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Box3, Material, Mesh, MeshStandardMaterial, Vector3, type Group, type Object3D } from "three";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const MODEL_PATH = `${BASE_PATH}/models/Untitled1234.web.glb`;
const MODEL_ROTATION_Y = Math.PI - 0.28;
const MODEL_COLOR = "#ff5a00";
const PANELS_ROOT_NAME = "col_pnl";
const MODEL_OUTLIER_LIMIT = 10;
const PARTICLE_SPREAD = 1.45;
const ASSEMBLY_MIN_SCALE = 0.08;
const DETAIL_ZOOM_SCALE = 3.15;
const PANEL_SPREAD = 28000;

type AssemblyPiece = {
  mesh: Mesh;
  position: Vector3;
  scale: Vector3;
  offset: Vector3;
  delay: number;
  materials: Material[];
};

type PanelPiece = AssemblyPiece;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);
const easeInOutCubic = (value: number) => (value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2);
const fadeFromTransparent = (value: number) => easeOutCubic(clamp01((value - 0.12) / 0.88));

function hash01(value: number) {
  const x = Math.sin(value * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function collectMaterials(material: Mesh["material"]) {
  return Array.isArray(material) ? material : [material];
}

function isInsideRoot(object: Object3D, root: Object3D | undefined) {
  if (!root) return false;
  for (let current: Object3D | null = object; current; current = current.parent) {
    if (current === root) return true;
  }
  return false;
}

function LoadingState() {
  return null;
}

class ModelErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Subsystem model failed to load", error, info);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Model({ assemblyProgress, zoomProgress, spinProgress, panelProgress, showTopPanels }: { assemblyProgress: number; zoomProgress: number; spinProgress: number; panelProgress: number; showTopPanels: boolean }) {
  const { scene } = useGLTF(MODEL_PATH);
  const groupRef = useRef<Group>(null);
  const animationRef = useRef<AssemblyPiece[]>([]);
  const panelAnimationRef = useRef<PanelPiece[]>([]);
  const panelRootRef = useRef<Object3D | undefined>(undefined);
  const { model, pieces, panelPieces, panelsRoot } = useMemo(() => {
    const orangeModel = scene.clone(true);
    const tintMaterial = (source: Material) => {
      const material = source.clone();

      if (material instanceof MeshStandardMaterial) {
        material.color.set(MODEL_COLOR);
        material.emissive.set("#1f0800");
        material.emissiveIntensity = 0.12;
        material.metalness = Math.max(material.metalness, 0.45);
        material.roughness = 0.48;
      }
      material.transparent = true;
      material.opacity = 0;

      return material;
    };
    const box = new Box3();
    const center = new Vector3();
    const size = new Vector3();
    const outliers: Mesh[] = [];

    orangeModel.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      box.setFromObject(object);
      box.getCenter(center);
      box.getSize(size);

      if (
        Math.abs(center.x) > MODEL_OUTLIER_LIMIT ||
        Math.abs(center.y) > MODEL_OUTLIER_LIMIT ||
        Math.abs(center.z) > MODEL_OUTLIER_LIMIT ||
        size.length() > MODEL_OUTLIER_LIMIT
      ) {
        outliers.push(object);
        return;
      }

      object.material = Array.isArray(object.material) ? object.material.map(tintMaterial) : tintMaterial(object.material);
    });
    outliers.forEach((object) => object.parent?.remove(object));

    const panels = orangeModel.getObjectByName(PANELS_ROOT_NAME);
    if (panels) {
      panels.visible = false;
      panels.traverse((object) => {
        if (!(object instanceof Mesh)) return;
        for (const material of collectMaterials(object.material)) {
          material.opacity = 0;
          material.depthWrite = false;
        }
      });
    }
    const assemblyPieces: AssemblyPiece[] = [];
    const panelAssemblyPieces: PanelPiece[] = [];

    orangeModel.traverse((object) => {
      if (!(object instanceof Mesh) || isInsideRoot(object, panels)) return;
      const index = assemblyPieces.length + 1;
      const angle = hash01(index * 3.7) * Math.PI * 2;
      const radius = PARTICLE_SPREAD * (0.35 + hash01(index * 5.1) * 0.65);
      const height = (hash01(index * 7.9) - 0.5) * PARTICLE_SPREAD * 1.2;

      assemblyPieces.push({
        mesh: object,
        position: object.position.clone(),
        scale: object.scale.clone(),
        offset: new Vector3(Math.cos(angle) * radius, height, Math.sin(angle) * radius),
        delay: hash01(index * 11.3) * 0.42,
        materials: collectMaterials(object.material),
      });
    });

    panels?.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      const index = panelAssemblyPieces.length + 1;
      const angle = hash01(index * 4.9) * Math.PI * 2;
      const radius = PANEL_SPREAD * (0.65 + hash01(index * 6.7) * 0.5);

      panelAssemblyPieces.push({
        mesh: object,
        position: object.position.clone(),
        scale: object.scale.clone(),
        offset: new Vector3(Math.cos(angle) * radius, 12000 + hash01(index * 8.3) * 9000, Math.sin(angle) * radius),
        delay: 0,
        materials: collectMaterials(object.material),
      });
    });
    const panelDelayDenom = Math.max(1, panelAssemblyPieces.length - 1);
    panelAssemblyPieces.forEach((piece, index) => {
      piece.delay = (index / panelDelayDenom) * 0.58;
    });

    return { model: orangeModel, pieces: assemblyPieces, panelPieces: panelAssemblyPieces, panelsRoot: panels };
  }, [scene]);

  useEffect(() => {
    animationRef.current = pieces;
    panelAnimationRef.current = panelPieces;
    panelRootRef.current = panelsRoot;
  }, [panelPieces, panelsRoot, pieces]);

  useEffect(() => {
    if (panelRootRef.current) panelRootRef.current.visible = showTopPanels || panelProgress > 0.001;
  }, [panelProgress, showTopPanels]);

  useFrame(() => {
    const progress = clamp01(assemblyProgress);
    const zoom = easeInOutCubic(clamp01(zoomProgress));
    const spin = easeInOutCubic(clamp01(spinProgress));
    const panelPhase = clamp01(panelProgress);
    const viewZoom = zoom * (1 - spin);

    if (groupRef.current) {
      const scale = 1 + viewZoom * (DETAIL_ZOOM_SCALE - 1);
      groupRef.current.scale.setScalar(scale);
      groupRef.current.position.set(-0.08 * viewZoom, -0.82 * viewZoom, 0);
      groupRef.current.rotation.set(0, MODEL_ROTATION_Y + Math.PI * 2 * spin, 0);
    }

    for (const piece of animationRef.current) {
      const local = easeOutCubic(clamp01((progress - piece.delay) / 0.58));
      const scatter = 1 - local;
      piece.mesh.position.copy(piece.position).addScaledVector(piece.offset, scatter);
      piece.mesh.scale.copy(piece.scale).multiplyScalar(ASSEMBLY_MIN_SCALE + local * (1 - ASSEMBLY_MIN_SCALE));

      const opacity = fadeFromTransparent(local);
      for (const material of piece.materials) {
        material.opacity = opacity;
        material.depthWrite = local > 0.96;
      }
    }

    if (panelRootRef.current) {
      panelRootRef.current.visible = showTopPanels || panelPhase > 0.001;
    }

    for (const piece of panelAnimationRef.current) {
      const local = easeOutCubic(clamp01((panelPhase - piece.delay) / 0.32));
      const scatter = 1 - local;
      const opacity = clamp01(local / 0.18);
      piece.mesh.position.copy(piece.position).addScaledVector(piece.offset, scatter);
      piece.mesh.scale.copy(piece.scale);
      piece.mesh.updateMatrix();
      piece.mesh.updateMatrixWorld();

      for (const material of piece.materials) {
        material.opacity = opacity;
        material.depthWrite = local > 0.96;
      }
    }
  });

  return (
    <group ref={groupRef} rotation={[0, MODEL_ROTATION_Y, 0]}>
      <primitive object={model} />
    </group>
  );
}

export default function SubsystemModel({ assemblyProgress, zoomProgress, spinProgress, panelProgress, showTopPanels }: { assemblyProgress: number; zoomProgress: number; spinProgress: number; panelProgress: number; showTopPanels: boolean }) {
  return (
    <div className="absolute inset-x-0 bottom-[118px] top-8 z-0 md:bottom-[124px]">
      <ModelErrorBoundary>
        <Suspense fallback={<LoadingState />}>
          <Canvas
            camera={{ position: [5, 3.5, 7], fov: 34 }}
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: true }}
            style={{ pointerEvents: "none", touchAction: "pan-y" }}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 7, 6]} intensity={2.4} color="#fff4eb" />
            <directionalLight position={[-5, 2, -4]} intensity={1.1} color="#ff5a00" />

            <Environment resolution={128}>
              <Lightformer position={[0, 5, -5]} scale={[10, 6, 1]} intensity={2.5} />
              <Lightformer position={[5, 1, 2]} scale={[4, 8, 1]} intensity={1.5} color="#ff7a33" />
            </Environment>

            <Bounds fit clip margin={0.78}>
              <Model assemblyProgress={assemblyProgress} zoomProgress={zoomProgress} spinProgress={spinProgress} panelProgress={panelProgress} showTopPanels={showTopPanels} />
            </Bounds>
          </Canvas>
        </Suspense>
      </ModelErrorBoundary>
    </div>
  );
}
