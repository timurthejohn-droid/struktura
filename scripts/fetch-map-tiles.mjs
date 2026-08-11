// Подтягивает тайлы карты вокруг офиса один раз и кладёт их в public/map/,
// чтобы страница контактов рисовала карту сама — без чужого интерфейса,
// внешних запросов и ключей. Запуск: node scripts/fetch-map-tiles.mjs
//
// Источник тайлов — OpenStreetMap (© OpenStreetMap contributors),
// атрибуция выводится в углу карты в ContactsMap.tsx.

import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Ленинградский проспект, д. 15 стр. 14
const LAT = 55.781237;
const LON = 37.571709;
const ZOOM = 17;
const COLS = 7; // 7 × 256 = 1792 px по ширине
const ROWS = 3; // 3 × 256 = 768 px по высоте
const TILE = 256;
const UA = "struktura-site/1.0 (+https://sk-struktura.ru)";

const project = (lat, lon, z) => {
  const n = 2 ** z;
  const x = ((lon + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return { x, y };
};

const { x, y } = project(LAT, LON, ZOOM);
const centerTileX = Math.floor(x);
const centerTileY = Math.floor(y);
const startX = centerTileX - (COLS - 1) / 2;
const startY = centerTileY - (ROWS - 1) / 2;

// Смещение метки внутри собранной сетки тайлов
const markerX = (x - startX) * TILE;
const markerY = (y - startY) * TILE;

const dir = resolve(ROOT, "public/map");
await mkdir(dir, { recursive: true });

for (let row = 0; row < ROWS; row += 1) {
  for (let col = 0; col < COLS; col += 1) {
    const tx = startX + col;
    const ty = startY + row;
    const file = resolve(dir, `${ZOOM}-${tx}-${ty}.png`);
    try {
      await access(file);
      continue; // уже скачан
    } catch {}
    const res = await fetch(`https://tile.openstreetmap.org/${ZOOM}/${tx}/${ty}.png`, {
      headers: { "User-Agent": UA },
    });
    if (!res.ok) throw new Error(`tile ${tx}/${ty}: ${res.status}`);
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
    console.log("saved", `${ZOOM}-${tx}-${ty}.png`);
    await new Promise((r) => setTimeout(r, 120)); // вежливо к серверу тайлов
  }
}

console.log("\nПараметры для ContactsMap.tsx:");
console.log(
  JSON.stringify(
    {
      zoom: ZOOM,
      cols: COLS,
      rows: ROWS,
      startX,
      startY,
      markerX: Math.round(markerX),
      markerY: Math.round(markerY),
    },
    null,
    2,
  ),
);
