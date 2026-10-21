let cached: boolean | null = null;

/**
 * Можно ли создать WebGL-контекст. Нет — при выключенном аппаратном ускорении,
 * заблокированном GPU (Chrome блокирует WebGL после нескольких сбоев GPU-процесса)
 * или на старых устройствах. Проверяем до монтирования <Canvas>, чтобы не ронять сцену,
 * а показать статичную замену. Пробный контекст сразу освобождаем.
 */
export function canUseWebGL(): boolean {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
    cached = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}
