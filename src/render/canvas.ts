import { getFace } from "../face/expressions";
import { getShapePoints } from "../geometry/shapes";
import { hasParticles } from "../fx/particles";
import { sampleMotion } from "../motion/states";
import type { BlobSnapshot } from "../core/types";

function pathFromPoints(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  points: { x: number; y: number }[],
) {
  ctx.beginPath();
  points.forEach((p, i) => {
    const x = cx + p.x * radius;
    const y = cy + p.y * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
}

export function drawBlob(
  ctx: CanvasRenderingContext2D,
  snapshot: BlobSnapshot,
  size: number,
  time: number,
) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2;
  const motion = sampleMotion(snapshot.state, time);
  const radius = size * 0.42 * motion.squash;
  const points = getShapePoints(snapshot.shape).map((p) => ({
    x: p.x + motion.wobble,
    y: p.y,
  }));

  ctx.save();
  ctx.translate(0, Math.sin(time * 1.4) * 3);

  pathFromPoints(ctx, cx, cy, radius, points);
  ctx.fillStyle = snapshot.color;
  ctx.fill();

  ctx.globalAlpha = 0.22;
  ctx.beginPath();
  ctx.ellipse(cx - radius * 0.15, cy - radius * 0.22, radius * 0.28, radius * 0.16, -0.4, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.globalAlpha = 1;

  const face = getFace(snapshot.expression);
  const gazeX = (snapshot.gaze.yaw / 90) * radius * 0.12;
  const gazeY = (snapshot.gaze.pitch / 90) * radius * 0.12;
  const eyeY = cy - radius * 0.08;
  const eyeSpread = radius * 0.22;
  const eyeH = radius * 0.11 * face.eyeOpen;
  const eyeW = radius * 0.09;

  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(cx + side * eyeSpread + gazeX, eyeY + gazeY, eyeW, Math.max(1.5, eyeH), 0, 0, Math.PI * 2);
    ctx.fillStyle = "#1b2430";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + side * eyeSpread + gazeX - 2, eyeY + gazeY - 2, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
  }

  ctx.beginPath();
  const mouthW = radius * 0.18;
  const mouthY = cy + radius * 0.22;
  if (face.smile >= 0) {
    ctx.arc(cx + gazeX * 0.3, mouthY - face.smile * 4, mouthW, 0.15, Math.PI - 0.15);
  } else {
    ctx.arc(cx + gazeX * 0.3, mouthY + 10, mouthW, Math.PI + 0.2, -0.2);
  }
  ctx.strokeStyle = "#1b2430";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.stroke();

  if (hasParticles(snapshot.state)) {
    ctx.strokeStyle = snapshot.color;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * (1.18 + Math.sin(time * 4) * 0.04), 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}
