import { useEffect, useRef } from "react";
import { createRuntime } from "../core/runtime";
import { drawFrame } from "../render/canvas";
import type { BlobMascotController } from "../core/controller";
import type { UseBlobMascotReturn } from "./useBlobMascot";

type ControllerLike = BlobMascotController | UseBlobMascotReturn;

export type BlobMascotProps = {
  controller: ControllerLike;
  size?: number;
  className?: string;
  label?: string;
  followCursor?: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function BlobMascot({
  controller,
  size = 200,
  className,
  label,
  followCursor = true,
}: BlobMascotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef(controller);
  controllerRef.current = controller;
  const followRef = useRef(followCursor);
  followRef.current = followCursor;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const runtime = createRuntime(controllerRef.current.getSnapshot());
    let frame = 0;
    let last = performance.now();
    const origin = last;

    const tick = (now: number) => {
      const snapshot = controllerRef.current.getSnapshot();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const time = reduced ? 0 : (now - origin) / 1000;
      const visual = runtime.step(snapshot, reduced ? 1 : dt, time);
      drawFrame(ctx, visual, size, time);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [size]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (!followRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 8 || rect.height < 8) return;
      const dx = (event.clientX - (rect.left + rect.width / 2)) / (window.innerWidth * 0.32);
      const dy = (event.clientY - (rect.top + rect.height / 2)) / (window.innerHeight * 0.32);
      controllerRef.current.lookAt({
        yaw: clamp(dx, -1, 1) * 80,
        pitch: clamp(dy, -1, 1) * 64,
      });
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    if (!followCursor) controller.resetGaze();
  }, [controller, followCursor]);

  const snapshot = controller.getSnapshot();
  const aria = label ?? `${snapshot.expression} ${snapshot.shape} mascot`;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      width={size}
      height={size}
      role="img"
      aria-label={aria}
    />
  );
}
