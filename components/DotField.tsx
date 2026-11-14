"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export default function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    let seen = false;
    let pull = 0;
    let targetPull = 0;
    const pointer = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      for (let x = 14; x < width; x += 28) {
        for (let y = 14; y < height; y += 28) {
          const dx = current.x - x;
          const dy = current.y - y;
          const dist = Math.hypot(dx, dy);
          let alpha = 0.1;
          let offsetX = 0;
          let offsetY = 0;
          let radius = 1;
          if (pull > 0 && dist < 170 && dist > 0) {
            const influence = (1 - dist / 170) ** 2 * pull;
            alpha = 0.1 + 0.45 * influence;
            offsetX = (dx / dist) * influence * 7;
            offsetY = (dy / dist) * influence * 7;
            radius = 1 + 0.6 * influence;
          }
          context.beginPath();
          context.arc(x + offsetX, y + offsetY, radius, 0, 2 * Math.PI);
          context.fillStyle = `rgba(255,255,255,${alpha})`;
          context.fill();
        }
      }
    };

    const tick = () => {
      current.x += (pointer.x - current.x) * 0.12;
      current.y += (pointer.y - current.y) * 0.12;
      pull += (targetPull - pull) * 0.1;
      if (Math.abs(targetPull - pull) < 0.01) pull = targetPull;
      draw();
      const settled =
        pull === targetPull &&
        (targetPull === 0 ||
          Math.hypot(pointer.x - current.x, pointer.y - current.y) < 0.3);
      if (settled) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    };

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!seen) {
        current.x = pointer.x;
        current.y = pointer.y;
        seen = true;
      }
      targetPull = 1;
      start();
    };

    const onLeave = () => {
      targetPull = 0;
      start();
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduced) {
      window.addEventListener("pointermove", onMove);
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
