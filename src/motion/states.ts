import type { BlobState } from "../core/types";

export type MotionSample = {
  breathe: number;
  squash: number;
  tilt: number;
  jelly: number;
  bounce: number;
};

export function sampleMotion(state: BlobState, time: number): MotionSample {
  if (state === "thinking") {
    return {
      breathe: 1 + Math.sin(time * 2.4) * 0.018,
      squash: 1 + Math.sin(time * 2.4) * 0.02,
      tilt: Math.sin(time * 1.3) * 0.08,
      jelly: 0.018,
      bounce: Math.sin(time * 1.1) * 2,
    };
  }

  return {
    breathe: 1 + Math.sin(time * 1.35) * 0.02,
    squash: 1 + Math.sin(time * 1.35 + 0.4) * 0.015,
    tilt: Math.sin(time * 0.7) * 0.03,
    jelly: 0.012,
    bounce: Math.sin(time * 1.35) * 4,
  };
}
