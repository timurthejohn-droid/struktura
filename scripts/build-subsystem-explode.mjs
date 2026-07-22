import fs from "node:fs";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Vector3 } from "three";

globalThis.ProgressEvent ??= class ProgressEvent {};

const SOURCE_PATH = "public/models/Untitled.glb";
const OUTPUT_PATH = "public/models/Untitled.explode.bin";
const MAGIC = 0x50584553;
const OFFSET_SCALE = 3.5;

const hash = (seed) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

function buildMeshData(geometry, center, meshIndex) {
  const position = geometry.getAttribute("position");
  const index = geometry.getIndex();
  if (!position || !index) throw new Error("Subsystem geometry must be indexed");

  const vertexCount = position.count;
  const parents = new Int32Array(vertexCount);
  const ranks = new Uint8Array(vertexCount);
  for (let i = 0; i < vertexCount; i += 1) parents[i] = i;

  const find = (value) => {
    let root = value;
    while (parents[root] !== root) root = parents[root];
    while (parents[value] !== value) {
      const next = parents[value];
      parents[value] = root;
      value = next;
    }
    return root;
  };

  const join = (a, b) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA === rootB) return;
    if (ranks[rootA] < ranks[rootB]) parents[rootA] = rootB;
    else {
      parents[rootB] = rootA;
      if (ranks[rootA] === ranks[rootB]) ranks[rootA] += 1;
    }
  };

  const indices = index.array;
  for (let i = 0; i < indices.length; i += 3) {
    join(indices[i], indices[i + 1]);
    join(indices[i], indices[i + 2]);
  }

  const roots = new Int16Array(vertexCount * 4);
  const rootValues = new Int16Array(vertexCount * 4);

  for (let i = 0; i < vertexCount; i += 1) {
    if (find(i) !== i) continue;

    const seed = i + meshIndex * 1000003;
    let dx = position.getX(i) - center[0];
    let dy = position.getY(i) - center[1];
    let dz = position.getZ(i) - center[2];
    let length = Math.hypot(dx, dy, dz);
    const rx = hash(seed + 11) * 2 - 1;
    const ry = hash(seed + 23) * 2 - 1;
    const rz = hash(seed + 47) * 2 - 1;
    const randomLength = Math.hypot(rx, ry, rz) || 1;

    if (length < 0.0001) {
      dx = rx;
      dy = ry;
      dz = rz;
      length = randomLength;
    }

    const strength = 1.5 + hash(seed + 71) * 1.25;
    dx = (dx / length) * strength + (rx / randomLength) * 0.65;
    dy = (dy / length) * strength + (ry / randomLength) * 0.65;
    dz = (dz / length) * strength + (rz / randomLength) * 0.65;

    rootValues[i * 4] = Math.round((Math.max(-OFFSET_SCALE, Math.min(OFFSET_SCALE, dx)) / OFFSET_SCALE) * 32767);
    rootValues[i * 4 + 1] = Math.round((Math.max(-OFFSET_SCALE, Math.min(OFFSET_SCALE, dy)) / OFFSET_SCALE) * 32767);
    rootValues[i * 4 + 2] = Math.round((Math.max(-OFFSET_SCALE, Math.min(OFFSET_SCALE, dz)) / OFFSET_SCALE) * 32767);
    rootValues[i * 4 + 3] = Math.round(hash(seed + 97) * 32767);
  }

  for (let i = 0; i < vertexCount; i += 1) {
    const root = find(i);
    roots.set(rootValues.subarray(root * 4, root * 4 + 4), i * 4);
  }

  return roots;
}

const bytes = fs.readFileSync(SOURCE_PATH);
const data = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
const gltf = await new Promise((resolve, reject) => new GLTFLoader().parse(data, "", resolve, reject));
const meshes = [];
gltf.scene.traverse((object) => {
  if (object.isMesh) meshes.push(object);
});

const chunks = [];
let totalSize = 12;
for (let i = 0; i < meshes.length; i += 1) {
  const mesh = meshes[i];
  mesh.geometry.computeBoundingBox();
  const center = mesh.geometry.boundingBox.getCenter(new Vector3());
  const chunk = buildMeshData(mesh.geometry, [center.x, center.y, center.z], i);
  chunks.push(chunk);
  totalSize += 4 + chunk.byteLength;
}

const output = new ArrayBuffer(totalSize);
const view = new DataView(output);
view.setUint32(0, MAGIC, true);
view.setUint32(4, 1, true);
view.setUint32(8, chunks.length, true);
let offset = 12;
for (const chunk of chunks) {
  view.setUint32(offset, chunk.length / 4, true);
  offset += 4;
  new Int16Array(output, offset, chunk.length).set(chunk);
  offset += chunk.byteLength;
}

fs.writeFileSync(OUTPUT_PATH, Buffer.from(output));
console.log(`Wrote ${OUTPUT_PATH} (${(totalSize / 1024 / 1024).toFixed(2)} MB)`);
