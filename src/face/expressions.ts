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
  neutral: { width: 0.1, height: 0.165, spread: 0.205, y: -0.04, rotate: 0, kind: OVAL },
  attentive: { width: 0.09, height: 0.16, spread: 0.21, y: -0.03, rotate: 0.16, kind: OVAL },
  surprised: { width: 0.135, height: 0.215, spread: 0.225, y: -0.05, rotate: 0, kind: OVAL },
  excited: { width: 0.145, height: 0.23, spread: 0.23, y: -0.06, rotate: 0, kind: OVAL },
  happy: { width: 0.13, height: 0.09, spread: 0.22, y: -0.02, rotate: 0.1, kind: ARC },
  angry: { width: 0.115, height: 0.048, spread: 0.175, y: 0.0, rotate: -0.72, kind: OVAL },
  sad: { width: 0.08, height: 0.14, spread: 0.195, y: 0.03, rotate: -0.1, kind: OVAL },
  suspicious: { width: 0.09, height: 0.13, spread: 0.205, y: -0.02, rotate: 0.2, kind: OVAL },
  curious: { width: 0.08, height: 0.15, spread: 0.19, y: -0.07, rotate: 0.28, kind: OVAL },
  proud: { width: 0.09, height: 0.185, spread: 0.2, y: -0.05, rotate: 0, kind: OVAL },
  shy: { width: 0.075, height: 0.125, spread: 0.185, y: 0.02, rotate: 0, kind: OVAL },
  unimpressed: { width: 0.125, height: 0.024, spread: 0.2, y: -0.02, rotate: 0, kind: LINE },
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
    kind: from.kind + (to.kind - from.kind) * t,
  };
}

export const EYE_OVAL = OVAL;
export const EYE_ARC = ARC;
export const EYE_LINE = LINE;
