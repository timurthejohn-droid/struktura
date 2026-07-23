"use client";
import { useEffect, useState } from "react";

// Ротатор слов: слово в фразе перелистывается по кругу. Для строки вида
// «Превращаем идеи в …» — фасады / арт-объекты / навесы. Анимация смены —
// .word-roll в CSS (перезапускается сменой key), reduced-motion её глушит.

export default function WordRotator({
  words,
  interval = 2000,
  className = "",
  style,
}: {
  words: string[];
  interval?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);

  return (
    <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
      <span key={i} className={`word-roll ${className}`} style={style}>
        {words[i]}
      </span>
    </span>
  );
}
