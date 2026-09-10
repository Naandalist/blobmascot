import { useEffect, useRef } from "react";
import { drawBlob } from "../render/canvas";
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
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const snapshot = controller.getSnapshot();
      const time = reduced ? 0 : (now - start) / 1000;
      drawBlob(ctx, snapshot, size, time);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    const unsub = controller.subscribe(() => {});

    return () => {
      cancelAnimationFrame(frame);
      unsub();
    };
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
