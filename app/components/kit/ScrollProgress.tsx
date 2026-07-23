"use client";
import { useEffect, useState } from "react";

// Полоса прогресса чтения: тонкая оранжевая линия по верху страницы,
// ширина = процент прокрутки. Утилитарно и по-инженерному.

export default function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setP(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[60]"
      style={{ height: 3, width: `${p}%`, background: "var(--orange)" }}
      aria-hidden
    />
  );
}
