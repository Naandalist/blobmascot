import type { BlobShape } from "../core/types";

export type Point = { x: number; y: number };

export const POINT_COUNT = 16;

function fromRadii(radii: number[]): Point[] {
  return radii.map((radius, i) => {
    const angle = (i / POINT_COUNT) * Math.PI * 2 - Math.PI / 2;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  });
}

function fillRadii(pattern: number[]): number[] {
  return Array.from({ length: POINT_COUNT }, (_, i) => pattern[i % pattern.length] ?? 0.7);
}

const CIRCLE = fromRadii(Array.from({ length: POINT_COUNT }, () => 0.7));

const PEBBLE = fromRadii([
  0.66, 0.7, 0.74, 0.77, 0.73, 0.7, 0.67, 0.63, 0.6, 0.63, 0.66, 0.69, 0.71, 0.68, 0.65, 0.64,
]);

const CLOUD = fromRadii([
  0.84, 0.73, 0.66, 0.7, 0.64, 0.68, 0.73, 0.63, 0.6, 0.63, 0.72, 0.67, 0.64, 0.7, 0.76, 0.82,
]);

const SHAPE_POINTS: Record<BlobShape, Point[]> = {
  circle: CIRCLE,
  pebble: PEBBLE,
  squircle: fromRadii(fillRadii([0.74, 0.74, 0.66, 0.74])),
  capsule: fromRadii(fillRadii([0.78, 0.7, 0.58, 0.7])),
  triangle: fromRadii(fillRadii([0.86, 0.58, 0.58])),
  cloud: CLOUD,
  droplet: fromRadii(fillRadii([0.86, 0.66, 0.58, 0.66])),
  flame: fromRadii(fillRadii([0.88, 0.6, 0.7, 0.58])),
  medal: fromRadii(fillRadii([0.7, 0.78])),
  acorn: fromRadii(fillRadii([0.76, 0.68, 0.58, 0.68])),
  jellyfish: fromRadii(fillRadii([0.78, 0.6, 0.7, 0.6])),
  clover: fromRadii(fillRadii([0.82, 0.58, 0.82, 0.58])),
};

export function getShapePoints(shape: BlobShape): Point[] {
  return SHAPE_POINTS[shape].map((point) => ({ ...point }));
}

export function lerpPoints(from: Point[], to: Point[], t: number): Point[] {
  return from.map((point, i) => ({
    x: point.x + (to[i].x - point.x) * t,
    y: point.y + (to[i].y - point.y) * t,
  }));
}

export function toCanvasPoints(
  points: Point[],
  cx: number,
  cy: number,
  radius: number,
): Point[] {
  return points.map((point) => ({
    x: cx + point.x * radius,
    y: cy + point.y * radius,
  }));
}
