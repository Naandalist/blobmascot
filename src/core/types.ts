export const SPIKE_SHAPES = ["circle", "pebble", "cloud"] as const;
export const SPIKE_EXPRESSIONS = ["neutral", "surprised", "happy"] as const;
export const SPIKE_STATES = ["idle", "thinking"] as const;

export const SHAPES = [
  "circle",
  "pebble",
  "squircle",
  "capsule",
  "triangle",
  "cloud",
  "droplet",
  "flame",
  "medal",
  "acorn",
  "jellyfish",
  "clover",
] as const;

export type BlobShape = (typeof SHAPES)[number];

export const EXPRESSIONS = [
  "neutral",
  "attentive",
  "surprised",
  "excited",
  "happy",
  "angry",
  "sad",
  "suspicious",
  "curious",
  "proud",
  "shy",
  "unimpressed",
] as const;

export type BlobExpression = (typeof EXPRESSIONS)[number];

export const STATES = [
  "idle",
  "thinking",
  "wink",
  "wide",
  "alert",
  "notify",
  "exclaim",
  "sleep",
  "play",
  "orbit",
  "burst",
  "comet",
] as const;

export type BlobState = (typeof STATES)[number];

export const PLAYGROUND_STATES = [
  "idle",
  "thinking",
  "wink",
  "wide",
  "alert",
  "notify",
  "exclaim",
  "sleep",
] as const;

export const ONE_SHOT_STATES: readonly BlobState[] = [
  "wink",
  "alert",
  "exclaim",
  "burst",
  "comet",
];

export type Gaze = {
  yaw: number;
  pitch: number;
};

export type BlobMascotOptions = {
  shape?: BlobShape;
  expression?: BlobExpression;
  state?: BlobState;
  color?: string;
  size?: number;
};

export type BlobSnapshot = {
  shape: BlobShape;
  expression: BlobExpression;
  state: BlobState;
  color: string;
  gaze: Gaze;
};
