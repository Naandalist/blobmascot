import { toCanvasPoints, type Point } from "../geometry/shapes";
import type { VisualFrame } from "../core/runtime";
import type { BlobSnapshot } from "../core/types";
import { createRuntime } from "../core/runtime";

function smoothPath(ctx: CanvasRenderingContext2D, points: Point[]) {
  const count = points.length;
  const mid = (a: Point, b: Point): Point => ({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  });

  const start = mid(points[count - 1], points[0]);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  for (let i = 0; i < count; i += 1) {
    const current = points[i];
    const next = points[(i + 1) % count];
    const end = mid(current, next);
    ctx.quadraticCurveTo(current.x, current.y, end.x, end.y);
  }
  ctx.closePath();
}

function jellyPoints(points: Point[], time: number, amount: number): Point[] {
  return points.map((point, i) => {
    const wave = Math.sin(time * 2.2 + i * 0.7) * amount;
    const angle = Math.atan2(point.y, point.x);
    return {
      x: point.x + Math.cos(angle) * wave,
      y: point.y + Math.sin(angle) * wave,
    };
  });
}

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  frame: VisualFrame,
  size: number,
  time: number,
) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2 + frame.motion.bounce;
  const radius = size * 0.42 * frame.motion.breathe * frame.motion.squash;
  const points = toCanvasPoints(
    jellyPoints(frame.points, time, frame.motion.jelly),
    cx,
    cy,
    radius,
  );

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(frame.motion.tilt);
  ctx.translate(-cx, -cy);

  smoothPath(ctx, points);
  ctx.fillStyle = frame.color;
  ctx.fill();

  ctx.globalAlpha = 0.22;
  ctx.beginPath();
  ctx.ellipse(cx - radius * 0.16, cy - radius * 0.24, radius * 0.26, radius * 0.15, -0.45, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.globalAlpha = 1;

  const gazeX = (frame.gaze.yaw / 90) * radius * 0.22;
  const gazeY = (frame.gaze.pitch / 90) * radius * 0.18;
  const eyeY = cy - radius * 0.08;
  const eyeSpread = radius * 0.2;
  const eyeH = Math.max(1.8, radius * 0.11 * frame.face.eyeOpen);
  const eyeW = radius * 0.09;

  ctx.strokeStyle = "#1b2430";
  ctx.lineWidth = Math.max(2, radius * 0.03);
  ctx.lineCap = "round";
  for (const side of [-1, 1]) {
    const browY = eyeY - eyeH - radius * 0.08;
    ctx.beginPath();
    ctx.moveTo(cx + side * (eyeSpread + radius * 0.08), browY - frame.face.brow * 6);
    ctx.lineTo(cx + side * (eyeSpread - radius * 0.06), browY + frame.face.brow * 4);
    ctx.stroke();
  }

  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(cx + side * eyeSpread + gazeX, eyeY + gazeY, eyeW, eyeH, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#1b2430";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + side * eyeSpread + gazeX - 2.2, eyeY + gazeY - 2.4, Math.max(1.6, radius * 0.025), 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
  }

  const mouthY = cy + radius * 0.2;
  const mouthW = radius * 0.16;
  ctx.beginPath();
  if (frame.face.smile >= 0) {
    ctx.arc(cx + gazeX * 0.25, mouthY - frame.face.smile * 3, mouthW, 0.2, Math.PI - 0.2);
  } else {
    ctx.arc(cx + gazeX * 0.25, mouthY + 12, mouthW, Math.PI + 0.25, -0.25);
  }
  ctx.stroke();

  ctx.restore();
}

export function drawBlob(
  ctx: CanvasRenderingContext2D,
  snapshot: BlobSnapshot,
  size: number,
  time: number,
) {
  const runtime = createRuntime(snapshot);
  const frame = runtime.step(snapshot, 1, time);
  drawFrame(ctx, frame, size, time);
}
