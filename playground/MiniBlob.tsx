import { useEffect, useRef } from "react";
import { drawBlob } from "../src/render/canvas";
import type { BlobExpression, BlobShape, BlobState } from "../src";

type MiniBlobProps = {
  shape: BlobShape;
  expression: BlobExpression;
  state?: BlobState;
  size?: number;
};

export function MiniBlob({
  shape,
  expression,
  state = "idle",
  size = 52,
}: MiniBlobProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    drawBlob(
      ctx,
      {
        shape,
        expression,
        state,
        color: "#111111",
        gaze: { yaw: 0, pitch: 0 },
      },
      size,
      0,
    );
  }, [shape, expression, state, size]);

  return <canvas ref={ref} width={size} height={size} aria-hidden="true" />;
}
