"use client";
import { useRef } from "react";

// Тилт-карточка: наклоняется к курсору в 3D, содержимое чуть «всплывает».
// Держим угол небольшим — фирменный минимализм, не аттракцион.

export default function TiltCard({
  children,
  className = "",
  max = 8,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(760px) rotateY(${px * max}deg) rotateX(${-py * max}deg)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(760px) rotateY(0deg) rotateX(0deg)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: "transform 0.3s var(--ease-out)", transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {children}
    </div>
  );
}
