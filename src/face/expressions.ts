import type { BlobExpression } from "../core/types";

export type FacePose = {
  eyeOpen: number;
  smile: number;
  brow: number;
};

const FACES: Record<BlobExpression, FacePose> = {
  neutral: { eyeOpen: 1, smile: 0.15, brow: 0 },
  happy: { eyeOpen: 0.85, smile: 0.8, brow: 0.15 },
  excited: { eyeOpen: 1.1, smile: 1, brow: 0.25 },
  sad: { eyeOpen: 0.7, smile: -0.55, brow: -0.35 },
  angry: { eyeOpen: 0.9, smile: -0.35, brow: -0.55 },
  curious: { eyeOpen: 1.15, smile: 0.2, brow: 0.2 },
  proud: { eyeOpen: 0.8, smile: 0.45, brow: 0.1 },
  shy: { eyeOpen: 0.6, smile: 0.35, brow: 0.05 },
};

export function getFace(expression: BlobExpression): FacePose {
  return FACES[expression];
}
