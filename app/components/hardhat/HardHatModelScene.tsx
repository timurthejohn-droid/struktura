"use client";

import { Component, Suspense, useEffect, useMemo, useRef, type ErrorInfo, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import {
  CanvasTexture, DoubleSide, Euler, Group, Mesh, MeshPhysicalMaterial,
  MeshStandardMaterial, Object3D, Raycaster, SRGBColorSpace, Vector3,
  type BufferGeometry,
} from "three";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const MODEL_SRC = `${BASE_PATH}/models/struktura-hardhat.glb`;
const LOGO_SRC = `${BASE_PATH}/logos/logo-black.svg`;
const LOGO_CROP = { x: 0, y: 476, w: 1080, h: 128 };

function makeLogoTexture(onReady: () => void) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = Math.round((2048 * LOGO_CROP.h) / LOGO_CROP.w);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  const image = new Image();
  image.onload = () => {
    const context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, LOGO_CROP.x, LOGO_CROP.y, LOGO_CROP.w, LOGO_CROP.h, 0, 0, canvas.width, canvas.height);
    texture.needsUpdate = true;
    onReady();
  };
  image.src = LOGO_SRC;
  return texture;
}

function projectLogo(shell: Mesh, origin: Vector3, direction: Vector3, width: number) {
  const hit = new Raycaster(origin, direction).intersectObject(shell, false)[0];
  if (!hit?.face) return null;
  const normal = hit.face.normal.clone().normalize();
  const projector = new Object3D();
  projector.position.copy(hit.point);
  projector.lookAt(hit.point.clone().add(normal));
  const aspect = LOGO_CROP.w / LOGO_CROP.h;
  return new DecalGeometry(
    shell,
    hit.point.clone().addScaledVector(normal, 0.008),
    new Euler().copy(projector.rotation),
    new Vector3(width, width / aspect, 0.22),
  );
}

function Helmet({ reduced }: { reduced: boolean }) {
  const { scene } = useGLTF(MODEL_SRC);
  const invalidate = useThree((state) => state.invalidate);

  const resources = useMemo(() => {
    const source = scene.getObjectByProperty("type", "Mesh") as Mesh | undefined;
    if (!source) throw new Error("Hard hat GLB does not contain a mesh");
    const geometry = (source.geometry as BufferGeometry).clone();
    geometry.computeBoundingBox();
    const center = geometry.boundingBox!.getCenter(new Vector3());
    const size = geometry.boundingBox!.getSize(new Vector3());
    const scale = 2.45 / Math.max(size.x, size.z);

    // Source faces +X; the rotation points its real, short brim toward the viewer.
    geometry.translate(-center.x, -center.y, -center.z);
    geometry.rotateY(-Math.PI / 2);
    geometry.scale(scale, scale * 1.18, scale);
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();

    const plastic = new MeshPhysicalMaterial({
      color: "#f8f8f6", metalness: 0, roughness: 0.35,
      clearcoat: 0.55, clearcoatRoughness: 0.22, side: DoubleSide,
    });
    const shell = new Mesh(geometry, plastic);
    shell.updateMatrixWorld();
    const logoTexture = makeLogoTexture(invalidate);
    const logoMaterial = new MeshStandardMaterial({
      map: logoTexture, transparent: true, roughness: 0.48,
      depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4,
      side: DoubleSide,
    });
    // Логотип на гладких боках купола: спереди центральное ребро уже надписи и ломает её
    const logoGeometries = [
      projectLogo(shell, new Vector3(3, 0.1, 0), new Vector3(-1, 0, 0), 0.86),
      projectLogo(shell, new Vector3(-3, 0.1, 0), new Vector3(1, 0, 0), 0.86),
    ].filter((item): item is DecalGeometry => item !== null);
    return { geometry, plastic, logoTexture, logoMaterial, logoGeometries, bottom: geometry.boundingBox!.min.y };
  }, [scene, invalidate]);

  useEffect(() => () => {
    resources.geometry.dispose();
    resources.plastic.dispose();
    resources.logoTexture.dispose();
    resources.logoMaterial.dispose();
    resources.logoGeometries.forEach((geometry) => geometry.dispose());
  }, [resources]);

  const groupRef = useRef<Group>(null);
  const time = useRef(0);
  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    if (reduced) {
      group.rotation.set(0.08, 0.5, 0);
      group.position.y = 0;
      return;
    }
    time.current += Math.min(delta, 0.1);
    group.rotation.y = 0.5 + time.current * 0.55;
    group.rotation.x = 0.08 + Math.sin(time.current * 0.8) * 0.02;
    group.position.y = Math.sin(time.current * 1.1) * 0.025;
  });

  return (
    <>
      <group ref={groupRef}>
        <mesh geometry={resources.geometry} material={resources.plastic} />
        {resources.logoGeometries.map((geometry, index) => (
          <mesh key={index} geometry={geometry} material={resources.logoMaterial} />
        ))}
      </group>
      <ContactShadows position={[0, resources.bottom - 0.05, 0]} scale={4} blur={2.8} far={1.5} opacity={0.32} color="#3b3328" />
    </>
  );
}

function Wake({ active }: { active: boolean }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let count = 0;
    const tick = () => {
      invalidate();
      if (++count < 4) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, invalidate]);
  return null;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("Hard hat scene failed", error, info); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function HardHatModelScene({ active, reduced }: { active: boolean; reduced: boolean }) {
  return (
    <SceneBoundary>
      <Canvas
        frameloop={active ? (reduced ? "demand" : "always") : "never"}
        dpr={[1, 2]}
        camera={{ fov: 28, near: 0.1, far: 50, position: [0, 1.8, 7.1] }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ camera }) => camera.lookAt(0, 0.1, 0)}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.42} />
        <directionalLight position={[3, 6, 4]} intensity={1.6} />
        <directionalLight position={[-4, 2, -3]} intensity={0.5} />
        <Environment resolution={256}>
          <Lightformer form="rect" position={[0, 5, 2]} scale={[8, 4, 1]} intensity={2.2} />
          <Lightformer form="rect" position={[-5, 1.5, 2]} scale={[3, 6, 1]} intensity={1.4} />
          <Lightformer form="rect" position={[5, 1, 1]} scale={[3, 5, 1]} intensity={1} />
          <Lightformer form="rect" position={[0, 1, -5]} scale={[8, 3, 1]} intensity={0.8} />
        </Environment>
        <Suspense fallback={null}><Helmet reduced={reduced} /></Suspense>
        <Wake active={active} />
      </Canvas>
    </SceneBoundary>
  );
}

useGLTF.preload(MODEL_SRC);
