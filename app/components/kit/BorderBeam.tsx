// Луч по рамке: оранжевый сегмент бесконечно обходит границу карточки.
// Даёт «схемотехнический» акцент, не трогая содержимое. Анимация — в CSS
// (.beam-wrap), поэтому уважает reduced-motion.

export default function BorderBeam({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`beam-wrap ${className}`}>
      <div className="beam-inner">{children}</div>
    </div>
  );
}
