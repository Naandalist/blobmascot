import { formatHex, lerpRgb, parseHex, type Rgb } from "./color";
import { getFace, lerpFace, type FacePose } from "../face/expressions";
import { getShapePoints, lerpPoints, type Point } from "../geometry/shapes";
import { sampleMotion, type MotionSample } from "../motion/states";
import type { BlobSnapshot, Gaze } from "./types";

export type VisualFrame = {
  points: Point[];
  face: FacePose;
  color: string;
  gaze: Gaze;
  motion: MotionSample;
};

function damp(dt: number, speed: number): number {
  return 1 - Math.exp(-speed * dt);
}

export function createRuntime(initial: BlobSnapshot) {
  let points = getShapePoints(initial.shape);
  let face = getFace(initial.expression);
  let rgb: Rgb = parseHex(initial.color);
  let gaze: Gaze = { ...initial.gaze };

  return {
    step(snapshot: BlobSnapshot, dt: number, time: number): VisualFrame {
      const t = damp(Math.min(dt, 0.05), 9);
      points = lerpPoints(points, getShapePoints(snapshot.shape), t);
      face = lerpFace(face, getFace(snapshot.expression), t);
      rgb = lerpRgb(rgb, parseHex(snapshot.color), t);
      gaze = {
        yaw: gaze.yaw + (snapshot.gaze.yaw - gaze.yaw) * t,
        pitch: gaze.pitch + (snapshot.gaze.pitch - gaze.pitch) * t,
      };

      return {
        points,
        face,
        color: formatHex(rgb),
        gaze,
        motion: sampleMotion(snapshot.state, time),
      };
    },
  };
}
