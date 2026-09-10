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
};

export function BlobMascot({
  controller,
  size = 200,
  className,
  label,
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
