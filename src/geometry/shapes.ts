import type { BlobShape } from "../core/types";

export type Point = { x: number; y: number };

const POINT_COUNT = 12;

function circlePoints(): Point[] {
  return Array.from({ length: POINT_COUNT }, (_, i) => {
    const a = (i / POINT_COUNT) * Math.PI * 2 - Math.PI / 2;
    return { x: Math.cos(a) * 0.72, y: Math.sin(a) * 0.72 };
  });
}

function ripple(base: Point[], amplitudes: number[]): Point[] {
  return base.map((_p, i) => {
    const a = (i / POINT_COUNT) * Math.PI * 2 - Math.PI / 2;
    const r = 0.72 + (amplitudes[i % amplitudes.length] ?? 0);
    return { x: Math.cos(a) * r, y: Math.sin(a) * r };
  });
}

const SHAPE_POINTS: Record<BlobShape, Point[]> = {
  circle: circlePoints(),
  pebble: ripple(circlePoints(), [0.06, -0.04, 0.02, 0.08, -0.05, 0.03]),
  squircle: ripple(circlePoints(), [0.04, 0.04, -0.02, 0.04, 0.04, -0.02]),
  capsule: ripple(circlePoints(), [0.1, 0.02, -0.08, 0.02]),
  triangle: ripple(circlePoints(), [0.16, -0.12, -0.12]),
  cloud: ripple(circlePoints(), [0.12, -0.02, 0.1, -0.04, 0.14, -0.03]),
  droplet: ripple(circlePoints(), [0.18, -0.04, -0.06, -0.04]),
  flame: ripple(circlePoints(), [0.2, -0.08, 0.04, -0.1, 0.12, -0.06]),
  medal: ripple(circlePoints(), [0.02, 0.08, 0.02, 0.08]),
  acorn: ripple(circlePoints(), [0.08, 0.02, -0.1, 0.02]),
  jellyfish: ripple(circlePoints(), [0.1, -0.08, 0.06, -0.08, 0.1, -0.08]),
  clover: ripple(circlePoints(), [0.14, -0.08, 0.14, -0.08]),
};

export function getShapePoints(shape: BlobShape): Point[] {
  return SHAPE_POINTS[shape];
}

export function lerpPoints(from: Point[], to: Point[], t: number): Point[] {
  return from.map((p, i) => ({
    x: p.x + (to[i].x - p.x) * t,
    y: p.y + (to[i].y - p.y) * t,
  }));
}
