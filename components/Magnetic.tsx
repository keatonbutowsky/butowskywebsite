"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";

const SPRING = { stiffness: 220, damping: 18, mass: 0.4 };

export default function Magnetic({
  children,
  strength = 0.18,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={className}
      onPointerMove={(event) => {
        if (reduced || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const originX = rect.left + rect.width / 2 - x.get();
        const originY = rect.top + rect.height / 2 - y.get();
        x.set((event.clientX - originX) * strength);
        y.set((event.clientY - originY) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
