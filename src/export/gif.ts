import { GIFEncoder, applyPalette, quantize } from "gifenc";
import { createRuntime } from "../core/runtime";
import { drawFrame } from "../render/canvas";
import type { BlobSnapshot } from "../core/types";
import type { ExportOptions } from "./options";

export async function exportGif(
  snapshot: BlobSnapshot,
  options: ExportOptions = {},
): Promise<Blob> {
  const size = options.size ?? 256;
  const fps = options.fps ?? 12;
  const durationMs = options.durationMs ?? 2000;
  const background = options.background ?? "#f6f0fa";
  const frameCount = Math.max(2, Math.round((durationMs / 1000) * fps));
  const delay = Math.round(1000 / fps);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D is not available");

  const runtime = createRuntime(snapshot);
  const gif = GIFEncoder();

  for (let i = 0; i < frameCount; i += 1) {
    const time = i / fps;
    const visual = runtime.step(snapshot, 1 / fps, time);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, size, size);
    drawFrame(ctx, visual, size, time);
    const rgba = ctx.getImageData(0, 0, size, size).data;
    const palette = quantize(rgba, 256);
    const index = applyPalette(rgba, palette);
    gif.writeFrame(index, size, size, {
      palette,
      delay,
      repeat: i === 0 ? 0 : undefined,
    });
  }

  gif.finish();
  const bytes = gif.bytes();
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Blob([copy.buffer], { type: "image/gif" });
}
