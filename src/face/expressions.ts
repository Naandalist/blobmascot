import type { BlobExpression } from "../core/types";

export type FacePose = {
  eyeOpen: number;
  smile: number;
  brow: number;
};

const FACES: Record<BlobExpression, FacePose> = {
  neutral: { eyeOpen: 1, smile: 0.12, brow: 0 },
  happy: { eyeOpen: 0.82, smile: 0.85, brow: 0.18 },
  excited: { eyeOpen: 1.12, smile: 1, brow: 0.28 },
  sad: { eyeOpen: 0.68, smile: -0.62, brow: -0.38 },
  angry: { eyeOpen: 0.88, smile: -0.38, brow: -0.58 },
  curious: { eyeOpen: 1.16, smile: 0.18, brow: 0.22 },
  proud: { eyeOpen: 0.8, smile: 0.48, brow: 0.12 },
  shy: { eyeOpen: 0.58, smile: 0.32, brow: 0.06 },
};

export function getFace(expression: BlobExpression): FacePose {
  return { ...FACES[expression] };
}

export function lerpFace(from: FacePose, to: FacePose, t: number): FacePose {
  return {
    eyeOpen: from.eyeOpen + (to.eyeOpen - from.eyeOpen) * t,
    smile: from.smile + (to.smile - from.smile) * t,
    brow: from.brow + (to.brow - from.brow) * t,
  };
}
