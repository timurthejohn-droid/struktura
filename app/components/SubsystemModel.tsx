"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, Environment, Lightformer, useAnimations, useGLTF, useProgress } from "@react-three/drei";
import {
  InterleavedBuffer,
  InterleavedBufferAttribute,
  Box3,
  Material,
  Mesh,
  MeshStandardMaterial,
  Vector3,
  type Group,
  type Object3D,
} from "three";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const MODEL_PATH = `${BASE_PATH}/models/Untitled.glb`;
const EXPLODE_PATH = `${BASE_PATH}/models/Untitled.explode.bin`;
const EXPLODE_MAGIC = 0x50584553;
const MODEL_ROTATION_Y = Math.PI - 0.28;
const NODE_FOCUS = new Vector3(0, 7.25, 0.25);
const Y_AXIS = new Vector3(0, 1, 0);

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const easeInOut = (value: number) => value * value * (3 - 2 * value);

function makeExplodeMaterial(source: Material) {
  const material = source.clone();
  if (material instanceof MeshStandardMaterial) {
    material.color.set("#ff5a00");
    material.emissive.set("#351000");
    material.emissiveIntensity = 0.28;
    material.metalness = Math.max(material.metalness, 0.55);
    material.roughness = 0.42;
  }
  material.transparent = true;
  material.depthWrite = false;
  material.userData.assemblyProgress = 0;
  material.onBeforeCompile = (shader) => {
    material.userData.assemblyUniform = shader.uniforms.uAssembly = {
      value: material.userData.assemblyProgress,
    };
    shader.vertexShader = `
      attribute vec3 aExplode;
      attribute float aDelay;
      uniform float uAssembly;
      varying float vPartVisibility;
    ${shader.vertexShader}`.replace(
      "#include <begin_vertex>",
      `
        float delay = aDelay * 0.58;
        float partProgress = smoothstep(delay, delay + 0.36, uAssembly);
        vPartVisibility = smoothstep(0.18, 0.82, partProgress);
        vec3 transformed = vec3(position + aExplode * 14000.0 * (1.0 - partProgress));
      `,
    );
    shader.fragmentShader = `
      varying float vPartVisibility;
    ${shader.fragmentShader}`.replace(
      "#include <opaque_fragment>",
      `
        #include <opaque_fragment>
        gl_FragColor.a *= vPartVisibility;
      `,
    );
  };
  material.customProgramCacheKey = () => "subsystem-explode-v2";
  material.needsUpdate = true;
  return material;
}

function prepareModel(source: Object3D, explodeData: ArrayBuffer) {
  const model = source.clone(true);
  const materials: Material[] = [];
  const dataView = new DataView(explodeData);
  if (dataView.getUint32(0, true) !== EXPLODE_MAGIC || dataView.getUint32(4, true) !== 1) {
    throw new Error("Unsupported subsystem explode data");
  }

  const expectedMeshes = dataView.getUint32(8, true);
  let dataOffset = 12;
  let meshIndex = 0;

  model.traverse((object) => {
    if (!(object instanceof Mesh)) return;

    object.geometry = object.geometry.clone();
    const vertexCount = dataView.getUint32(dataOffset, true);
    dataOffset += 4;
    if (vertexCount !== object.geometry.getAttribute("position").count) {
      throw new Error(`Explode data does not match subsystem mesh ${meshIndex}`);
    }

    const values = new Int16Array(explodeData, dataOffset, vertexCount * 4);
    const interleaved = new InterleavedBuffer(values, 4);
    object.geometry.setAttribute("aExplode", new InterleavedBufferAttribute(interleaved, 3, 0, true));
    object.geometry.setAttribute("aDelay", new InterleavedBufferAttribute(interleaved, 1, 3, true));
    dataOffset += values.byteLength;

    if (Array.isArray(object.material)) {
      object.material = object.material.map((sourceMaterial) => {
        const material = makeExplodeMaterial(sourceMaterial);
        materials.push(material);
        return material;
      });
    } else {
      const material = makeExplodeMaterial(object.material);
      materials.push(material);
      object.material = material;
    }

    meshIndex += 1;
  });

  if (meshIndex !== expectedMeshes) throw new Error("Explode data mesh count mismatch");

  const center = new Box3().setFromObject(model).getCenter(new Vector3());
  return { model, materials, center };
}

function LoadingState() {
  const { progress } = useProgress();

  return (
    <div className="absolute inset-0 flex items-center justify-center font-mono text-orange/70" style={{ fontSize: 10 }}>
      3D {Math.round(progress)}%
    </div>
  );
}

function Model({ progress }: { progress: number }) {
  const groupRef = useRef<Group>(null);
  const { scene, animations } = useGLTF(MODEL_PATH);
  const [explodeData, setExplodeData] = useState<ArrayBuffer | null>(null);
  const prepared = useMemo(() => (explodeData ? prepareModel(scene, explodeData) : null), [explodeData, scene]);
  const model = prepared?.model;
  const materials = prepared?.materials;
  const center = prepared?.center;
  const focusTransform = useMemo(() => {
    if (!center) return null;
    return {
      center: center.clone().applyAxisAngle(Y_AXIS, MODEL_ROTATION_Y),
      focus: NODE_FOCUS.clone().applyAxisAngle(Y_AXIS, MODEL_ROTATION_Y),
    };
  }, [center]);
  const targetPosition = useMemo(() => new Vector3(), []);
  const { actions, mixer, names } = useAnimations(animations, groupRef);

  useEffect(() => {
    const controller = new AbortController();
    fetch(EXPLODE_PATH, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load explode data: ${response.status}`);
        return response.arrayBuffer();
      })
      .then(setExplodeData)
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error(error);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const action = names[0] ? actions[names[0]] : undefined;
    action?.reset().play();

    return () => {
      action?.stop();
    };
  }, [actions, names]);

  useEffect(
    () => () => {
      model?.traverse((object) => {
        if (object instanceof Mesh) object.geometry.dispose();
      });
      materials?.forEach((material) => material.dispose());
    },
    [materials, model],
  );

  useFrame(() => {
    if (!groupRef.current || !materials || !focusTransform) return;

    const assemblyProgress = easeInOut(clamp01(progress * 4));
    materials.forEach((material) => {
      material.userData.assemblyProgress = assemblyProgress;
      material.depthWrite = assemblyProgress > 0.97;
      if (material.userData.assemblyUniform) {
        material.userData.assemblyUniform.value = assemblyProgress;
      }
    });

    if (animations[0]) {
      mixer.setTime(progress * animations[0].duration);
    }

    const zoomProgress = easeInOut(clamp01((progress - 0.25) * 4));
    const scale = 1 + zoomProgress * 3.5;
    groupRef.current.scale.setScalar(scale);
    targetPosition.copy(focusTransform.focus).multiplyScalar(scale).multiplyScalar(-1).add(focusTransform.center);
    groupRef.current.position.copy(targetPosition).multiplyScalar(zoomProgress);
  });

  if (!model) return null;

  return (
    <group ref={groupRef} rotation={[0, MODEL_ROTATION_Y, 0]}>
      <primitive object={model} />
    </group>
  );
}

export default function SubsystemModel({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-x-0 bottom-[118px] top-8 z-0 md:bottom-[124px]">
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

          <Bounds fit clip observe margin={1.35}>
            <Model progress={progress} />
          </Bounds>
        </Canvas>
      </Suspense>
    </div>
  );
}

useGLTF.preload(MODEL_PATH);
