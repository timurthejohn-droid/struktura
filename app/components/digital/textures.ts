import { CanvasTexture, SRGBColorSpace } from "three";

/** Перфорированный алюминий: шаг отверстий меняется по полю панели. */
export function makePerforation() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#f2f0eb";
  g.fillRect(0, 0, 256, 256);
  const n = 18;
  const step = 256 / n;
  g.fillStyle = "#8c877e";
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const k = 0.5 + 0.5 * Math.sin(i * 0.42 + j * 0.31);
      g.beginPath();
      g.arc((i + 0.5) * step, (j + 0.5) * step, 0.6 + k * step * 0.26, 0, Math.PI * 2);
      g.fill();
    }
  }
  g.strokeStyle = "#bdb7ac";
  g.lineWidth = 4;
  g.strokeRect(2, 2, 252, 252);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Мягкое радиальное пятно — подложка-свечение под моделью. */
export function makeRadialGlow(color = "255,255,255") {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, `rgba(${color},0.55)`);
  grad.addColorStop(0.45, `rgba(${color},0.14)`);
  grad.addColorStop(1, `rgba(${color},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}
