declare module "gifenc" {
  type Palette = Uint8Array | number[][];

  type FrameOpts = {
    palette?: Palette;
    delay?: number;
    repeat?: number;
    transparent?: number;
    dispose?: number;
  };

  type Encoder = {
    writeFrame(
      index: Uint8Array,
      width: number,
      height: number,
      opts?: FrameOpts,
    ): void;
    finish(): void;
    bytes(): Uint8Array;
  };

  export function GIFEncoder(): Encoder;
  export function quantize(
    rgba: Uint8Array | Uint8ClampedArray,
    maxColors: number,
  ): Uint8Array;
  export function applyPalette(
    rgba: Uint8Array | Uint8ClampedArray,
    palette: Uint8Array,
  ): Uint8Array;
}
