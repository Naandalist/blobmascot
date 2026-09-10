import type { BlobState } from "../core/types";

export type MotionSample = {
  wobble: number;
  squash: number;
};

export function sampleMotion(state: BlobState, time: number): MotionSample {
  switch (state) {
    case "thinking":
      return { wobble: Math.sin(time * 2.2) * 0.04, squash: 1 };
    case "sleep":
      return { wobble: Math.sin(time * 0.8) * 0.02, squash: 0.94 };
    case "orbit":
    case "play":
      return { wobble: Math.sin(time * 3) * 0.06, squash: 1 };
    case "burst":
    case "exclaim":
    case "alert":
      return { wobble: Math.sin(time * 10) * 0.03, squash: 1.06 };
    default:
      return { wobble: Math.sin(time * 1.6) * 0.025, squash: 1 };
  }
}
