/** Состояние 3D-сцены подсистемы — меняется из скролла/таймеров без ре-рендеров React. */
export type ShellLayer = "all" | "base" | "bearing" | "nodes" | "adjust" | "shell";

export type ShellState = {
  /** 0 — собрано, 1 — разнесено по слоям */
  explode: number;
  /** 0 — панели разлетелись, 1 — собраны (интро) */
  assemble: number;
  layer: ShellLayer;
  /** Поворот модели, рад */
  spin: number;
};

export const createShellState = (s: Partial<ShellState> = {}): ShellState => ({
  explode: 0,
  assemble: 1,
  layer: "all",
  spin: 0,
  ...s,
});
