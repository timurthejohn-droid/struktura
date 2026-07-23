"use client";
import { useRef } from "react";

// Магнитная кнопка: в пределах наведения слегка тянется за курсором и
// пружинит обратно. Микровзаимодействие для главных CTA. Использует
// классы .btn — то есть остаётся фирменной, только «живой».

export default function MagneticButton({
  children,
  href = "#",
  className = "btn btn-orange",
  strength = 0.35,
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: "transform 0.3s var(--ease-out)" }}
    >
      {children}
    </a>
  );
}
