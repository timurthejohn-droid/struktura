"use client";
import { useReveal } from "../useReveal";

// Лёгкая обёртка, чтобы дата-секции оставались серверными,
// но получали фирменный reveal-on-scroll (globals.css → .reveal / .visible).
export default function Reveal({
  children,
  className = "",
  threshold,
}: {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}) {
  const ref = useReveal(threshold);
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
