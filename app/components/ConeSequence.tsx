"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_INDICES = Array.from({ length: 31 }, (_, i) => i * 5);
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

function frameSrc(index: number) {
  return `${BASE_PATH}/cone/frame_${String(index).padStart(4, "0")}%20copy.png`;
}

export default function ConeSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let loaded = 0;

    FRAME_INDICES.forEach((index, position) => {
      const image = new window.Image();
      image.src = frameSrc(index);
      image.onload = () => {
        loaded += 1;
        if (loaded === FRAME_INDICES.length && !cancelled) setReady(true);
      };
      imagesRef.current[position] = image;
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const draw = (frame: number) => {
      const image = imagesRef.current[frame];
      if (!image?.complete) return;
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(bounds.width * dpr);
      const height = Math.round(bounds.height * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      context.clearRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
    };

    const resize = () => draw(frameRef.current);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    if (!ready || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => observer.disconnect();
    }

    let animationFrame = 0;
    let previous = 0;
    const frameDuration = 1000 / 18;
    const animate = (now: number) => {
      if (now - previous >= frameDuration) {
        frameRef.current = (frameRef.current + 1) % FRAME_INDICES.length;
        draw(frameRef.current);
        previous = now;
      }
      animationFrame = requestAnimationFrame(animate);
    };
    draw(0);
    animationFrame = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [ready]);

  return (
    <div className="relative h-full w-full" aria-hidden="true">
      <img
        src={frameSrc(0)}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${ready ? "opacity-0" : "opacity-100"}`}
      />
      <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
}
