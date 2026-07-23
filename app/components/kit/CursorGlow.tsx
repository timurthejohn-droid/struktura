"use client";
import { useEffect, useRef } from "react";

// Курсор-прицел: за указателем едет квадратная рамка (с запаздыванием) и
// точное пятно. Чертёжный «прицел» вместо обычного курсора. Родной курсор
// не прячем. Только на устройствах с настоящим ховером.

export default function CursorGlow() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rx = -100;
    let ry = -100;
    let tx = -100;
    let ty = -100;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${tx}px, ${ty}px)`;
    };
    const loop = () => {
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed top-0 left-0 z-[80] hidden lg:block"
        style={{ marginLeft: -15, marginTop: -15, width: 30, height: 30, border: "1px solid var(--orange)" }}
        aria-hidden
      />
      <div
        ref={dot}
        className="pointer-events-none fixed top-0 left-0 z-[80] hidden lg:block"
        style={{ marginLeft: -2, marginTop: -2, width: 4, height: 4, background: "var(--orange)" }}
        aria-hidden
      />
    </>
  );
}
