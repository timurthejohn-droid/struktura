// Сияющий текст: по надписи бесконечно проходит светлая развёртка с
// оранжевым бликом. Логика анимации — .kit-shimmer в CSS (учитывает
// reduced-motion). Компонент только применяет класс.

export default function TextShimmer({
  text,
  className = "",
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span className={`kit-shimmer ${className}`} style={style}>
      {text}
    </span>
  );
}
