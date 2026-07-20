"use client";
import { motion, useReducedMotion } from "framer-motion";

// Плавная загрузка страниц: мягкий fade на каждом переходе/первой отрисовке.
// Только opacity — transform на обёртке ломал бы position: fixed/sticky
// (Nav, pinned-секции).

export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
