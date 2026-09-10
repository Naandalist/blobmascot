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

function drawEye(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  rotate: number,
  kind: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotate);
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  ctx.lineCap = "round";

  if (kind > 1.4) {
    ctx.lineWidth = Math.max(2, height);
    ctx.beginPath();
    ctx.moveTo(-width, 0);
    ctx.lineTo(width, 0);
    ctx.stroke();
  } else if (kind > 0.55) {
    ctx.lineWidth = Math.max(2.5, height * 0.45);
    ctx.beginPath();
    ctx.arc(0, height * 0.6, width, Math.PI + 0.25, -0.25);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.ellipse(0, 0, width, height, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
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

  const turnX = frame.gaze.yaw / 80;
  const turnY = frame.gaze.pitch / 70;

  ctx.save();
  ctx.translate(cx + turnX * radius * 0.12, cy + turnY * radius * 0.1);
  ctx.rotate(frame.motion.tilt + turnX * 0.32);
  ctx.scale(1 + Math.abs(turnX) * 0.05, 1 - Math.abs(turnY) * 0.07);
  ctx.translate(-cx, -cy);

  smoothPath(ctx, points);
  ctx.fillStyle = frame.color;
  ctx.fill();

  ctx.save();
  smoothPath(ctx, points);
  ctx.clip();
  const gloss = ctx.createRadialGradient(
    cx - radius * 0.18,
    cy - radius * 0.28,
    radius * 0.02,
    cx,
    cy,
    radius * 1.05,
  );
  gloss.addColorStop(0, "rgba(255,255,255,0.22)");
  gloss.addColorStop(0.35, "rgba(255,255,255,0.05)");
  gloss.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gloss;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.restore();

  const gazeX = turnX * radius * 0.38;
  const gazeY = turnY * radius * 0.34;
  const eyeY = cy + frame.face.y * radius + gazeY;
  const spread = frame.face.spread * radius * (1 - Math.abs(turnX) * 0.12);
  const eyeW = Math.max(1.2, frame.face.width * radius);
  const canBlink = frame.face.kind < 0.55 && frame.state !== "sleep";
  const wink = frame.state === "wink" ? 1 : 0;
  const leftBlink = canBlink ? Math.max(frame.blink, wink) : 0;
  const rightBlink = canBlink ? frame.blink : 0;
  const leftH = Math.max(1.2, frame.face.height * radius * (1 - leftBlink * 0.92));
  const rightH = Math.max(1.2, frame.face.height * radius * (1 - rightBlink * 0.92));

  const leftW = Math.max(1.2, eyeW * (1 - turnX * 0.22));
  const rightW = Math.max(1.2, eyeW * (1 + turnX * 0.22));
  drawEye(ctx, cx - spread + gazeX, eyeY, leftW, leftH, -frame.face.rotate + turnX * 0.15, frame.face.kind);
  drawEye(ctx, cx + spread + gazeX, eyeY, rightW, rightH, frame.face.rotate + turnX * 0.15, frame.face.kind);

  if (frame.state === "notify" || frame.state === "orbit" || frame.state === "swirl") {
    const angle = time * (frame.state === "notify" ? 2.2 : 1.6);
    const ring = radius * 0.96;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(angle) * ring, cy + Math.sin(angle) * ring, radius * 0.14, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
  }

  if (frame.state === "burst") {
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * (1.08 + (time % 0.6) * 0.35), 0, Math.PI * 2);
    ctx.stroke();
  }

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
