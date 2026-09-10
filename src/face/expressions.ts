import type { BlobExpression } from "../core/types";

export type FacePose = {
  width: number;
  height: number;
  spread: number;
  y: number;
  rotate: number;
  kind: number;
};

const OVAL = 0;
const ARC = 1;
const LINE = 2;

const FACES: Record<BlobExpression, FacePose> = {
  neutral: { width: 0.055, height: 0.125, spread: 0.165, y: -0.04, rotate: 0, kind: OVAL },
  attentive: { width: 0.048, height: 0.115, spread: 0.17, y: -0.03, rotate: 0.18, kind: OVAL },
  surprised: { width: 0.1, height: 0.155, spread: 0.2, y: -0.04, rotate: 0, kind: OVAL },
  excited: { width: 0.11, height: 0.17, spread: 0.2, y: -0.05, rotate: 0, kind: OVAL },
  happy: { width: 0.1, height: 0.07, spread: 0.2, y: -0.02, rotate: 0.12, kind: ARC },
  angry: { width: 0.07, height: 0.11, spread: 0.19, y: -0.06, rotate: 0.38, kind: OVAL },
  sad: { width: 0.045, height: 0.09, spread: 0.16, y: 0.04, rotate: -0.12, kind: OVAL },
  suspicious: { width: 0.05, height: 0.08, spread: 0.175, y: -0.02, rotate: 0.22, kind: OVAL },
  curious: { width: 0.045, height: 0.1, spread: 0.15, y: -0.08, rotate: 0.32, kind: OVAL },
  proud: { width: 0.05, height: 0.13, spread: 0.16, y: -0.05, rotate: 0, kind: OVAL },
  shy: { width: 0.04, height: 0.08, spread: 0.145, y: 0.03, rotate: 0, kind: OVAL },
  unimpressed: { width: 0.09, height: 0.018, spread: 0.16, y: -0.02, rotate: 0, kind: LINE },
};

export function getFace(expression: BlobExpression): FacePose {
  return { ...FACES[expression] };
}

export function lerpFace(from: FacePose, to: FacePose, t: number): FacePose {
  return {
    width: from.width + (to.width - from.width) * t,
    height: from.height + (to.height - from.height) * t,
    spread: from.spread + (to.spread - from.spread) * t,
    y: from.y + (to.y - from.y) * t,
    rotate: from.rotate + (to.rotate - from.rotate) * t,
    kind: from.kind + (to.kind - to.kind) * t,
  };
}

export const EYE_OVAL = OVAL;
export const EYE_ARC = ARC;
export const EYE_LINE = LINE;
