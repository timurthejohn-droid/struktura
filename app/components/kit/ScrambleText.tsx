"use client";
import { useEffect, useRef, useState } from "react";

// Декодирующийся текст: при попадании во вьюпорт буквы «собираются» из
// случайных моно-символов слева направо. Терминально-инженерный характер,
// хорошо ложится на CoFo Sans Mono. Один раз за появление.

const CHARS = "STRUKTURA0123456789/+×#АБВГДЕЖЗ";

export default function ScrambleText({
  text,
  className = "",
  style,
  speed = 2,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  speed?: number;
}) {
  const [out, setOut] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }

    let raf = 0;
    let frame = 0;

    const run = () => {
      const total = text.length;
      const tick = () => {
        frame += 1;
        const revealed = Math.floor(frame / speed);
        let s = "";
        for (let i = 0; i < total; i++) {
          if (text[i] === " ") s += " ";
          else if (i < revealed) s += text[i];
          else s += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        setOut(s);
        if (revealed <= total) raf = requestAnimationFrame(tick);
        else setOut(text);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !done.current) {
            done.current = true;
            run();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, speed]);

  return (
    <span ref={ref} className={className} style={style}>
      {out}
    </span>
  );
}
