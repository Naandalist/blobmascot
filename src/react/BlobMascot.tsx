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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const runtime = createRuntime(controller.getSnapshot());
    let frame = 0;
    let last = performance.now();
    const origin = last;

    const tick = (now: number) => {
      const snapshot = controller.getSnapshot();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const time = reduced ? 0 : (now - origin) / 1000;
      const visual = runtime.step(snapshot, reduced ? 1 : dt, time);
      drawFrame(ctx, visual, size, time);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [controller, size]);

  useEffect(() => {
    if (!followCursor) {
      controller.resetGaze();
      return;
    }

    const onMove = (event: PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      controller.lookAt({
        yaw: clamp(dx, -1, 1) * 42,
        pitch: clamp(dy, -1, 1) * 28,
      });
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
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
      style={{ display: "block", width: size, height: size }}
    />
  );
}
