# blobmascot

Procedural blob mascot for React. Morph, emote, react.

Published on npm. No sprites, no Lottie files, no asset pipeline. Shape, expression, motion, and gaze are independent axes that lerp on a canvas.

[npm](https://www.npmjs.com/package/blobmascot) · [demo](https://naandalist.github.io/blobmascot/) · [changelog](./CHANGELOG.md) · [source](https://github.com/Naandalist/blobmascot)

```bash
npm install blobmascot
```

Peer dependencies: `react` and `react-dom` 18 or newer.

## Features

- **Drop in** `<BlobMascot />` plus a controller. Nothing to bundle besides the package.
- **12 shapes** that morph into each other: circle, pebble, squircle, capsule, triangle, cloud, droplet, flame, medal, acorn, jellyfish, clover.
- **12 expressions** that reshape the eyes: neutral, attentive, surprised, excited, happy, angry, sad, suspicious, curious, proud, shy, unimpressed.
- **13 motion states**: idle and thinking loop. wink, alert, exclaim, burst, and comet play once then return to idle.
- **Gaze** follows the pointer by default, or you drive `yaw` / `pitch` yourself.
- **Poke** on click. Also available as `controller.poke()`.
- **PNG export** from any snapshot, any size.
- **TypeScript** types for every public value.

GIF and WebP export come in 0.2.0.

## Get started

```tsx
import { BlobMascot, useBlobMascot } from "blobmascot";

export function App() {
  const mascot = useBlobMascot({
    shape: "droplet",
    expression: "curious",
    state: "idle",
    color: "#111111",
  });

  return <BlobMascot controller={mascot} size={240} />;
}
```

The hook owns the controller for the life of the component. Mutate it. The canvas keeps interpolating.

## Usage

### Reactions

```ts
mascot.setExpression("surprised");
mascot.setState("alert");

mascot.setExpression("excited");
mascot.setState("orbit");

mascot.setState("thinking");

mascot.setExpression("happy");
mascot.setState("idle");
```

Sustained states loop until you change them: `idle`, `thinking`, `notify`, `sleep`, `play`, `orbit`, `swirl`, `wide`.

One-shot states play about 900ms then snap back to `idle`: `wink`, `alert`, `exclaim`, `burst`, `comet`.

### Morph

```ts
mascot.setShape("clover");
mascot.setExpression("proud");
mascot.setColor("#4B8FEA");
```

Any hex color works. The playground palette is a suggestion, not a limit.

### Poke

Click the canvas, or call it from your own UI:

```ts
mascot.poke();
```

That is a `burst` that returns to `idle`.

## Gaze tracking

`followCursor` is on by default. The eyes look toward the pointer, clamped so they stay on the body.

Turn it off when you want to aim the gaze at a field, a cursor in a chat, or a fixed rest pose:

```tsx
<BlobMascot controller={mascot} size={240} followCursor={false} />
```

```ts
mascot.lookAt({ yaw: 20, pitch: -8 });
mascot.resetGaze();
```

| Field | Unit | Meaning |
| --- | --- | --- |
| `yaw` | degrees | Negative looks left. Positive looks right. |
| `pitch` | degrees | Negative looks up. Positive looks down. |

Useful ranges sit around `yaw` ±36 and `pitch` ±28. Larger values are clipped in the renderer.

Example: look at an input while it is focused.

```tsx
<input
  onFocus={() => mascot.lookAt({ yaw: 18, pitch: 6 })}
  onBlur={() => mascot.resetGaze()}
/>
```

## Rendering to PNG

`exportPng` paints the current snapshot to an offscreen canvas and returns a `Blob`.

```ts
import { exportPng } from "blobmascot";

const png = await exportPng(mascot.getSnapshot(), 1024);
const url = URL.createObjectURL(png);

const anchor = document.createElement("a");
anchor.href = url;
anchor.download = "blobmascot.png";
anchor.click();
URL.revokeObjectURL(url);
```

The second argument is pixel size. Default is `512`. Export uses the snapshot pose, not the live idle wobble, so share cards stay stable.

## API reference

### `<BlobMascot />`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `controller` | `BlobMascotController` | required | State owner from `useBlobMascot` or `createController`. |
| `size` | `number` | `200` | Canvas width and height in CSS pixels. |
| `followCursor` | `boolean` | `true` | Pointer gaze. Off means you call `lookAt` yourself. |
| `className` | `string` | | Passed to the `<canvas>`. |
| `label` | `string` | `"{expression} {shape} mascot"` | `aria-label`. |

Clicking the canvas calls `poke()`.

### `useBlobMascot(options?)`

Creates a controller and subscribes the component to it.

```ts
const mascot = useBlobMascot({
  shape: "circle",
  expression: "neutral",
  state: "idle",
  color: "#111111",
});
```

Returns the controller plus `snapshot`, the current `{ shape, expression, state, color, gaze }`.

Options are read on first mount only. Change appearance after that through setter methods.

### Controller methods

| Method | What it does |
| --- | --- |
| `setShape(shape)` | Morph the silhouette. |
| `setExpression(expression)` | Change the eyes. |
| `setState(state)` | Change the motion clip. |
| `setColor(color)` | Solid fill, any CSS color string. |
| `lookAt({ yaw, pitch })` | Aim the eyes. Either field is optional. |
| `resetGaze()` | Center the eyes. |
| `poke()` | One-shot burst, then idle. |
| `getSnapshot()` | Current `{ shape, expression, state, color, gaze }`. |
| `subscribe(listener)` | Subscribe to changes. Returns an unsubscribe function. |

### Catalog

**Shapes:** `circle` `pebble` `squircle` `capsule` `triangle` `cloud` `droplet` `flame` `medal` `acorn` `jellyfish` `clover`

**Expressions:** `neutral` `attentive` `surprised` `excited` `happy` `angry` `sad` `suspicious` `curious` `proud` `shy` `unimpressed`

**States:** `idle` `thinking` `wink` `wide` `alert` `notify` `exclaim` `sleep` `play` `orbit` `swirl` `burst` `comet`

Arrays `SHAPES`, `EXPRESSIONS`, `STATES`, and `PALETTE` are exported if you want to build a picker.

## Advanced usage

### Headless controller

Use `createController` outside React, or share one controller across several trees.

```ts
import { createController, BlobMascot, exportPng } from "blobmascot";

const mascot = createController({ shape: "medal", color: "#8B5CF6" });

function Badge() {
  return <BlobMascot controller={mascot} size={96} followCursor={false} />;
}

async function thumbnail() {
  return exportPng(mascot.getSnapshot(), 256);
}
```

### Several instances

Each `useBlobMascot()` call is isolated. Two blobs on one page do not share gaze or poke.

```tsx
function Pair() {
  const left = useBlobMascot({ shape: "pebble", color: "#111111" });
  const right = useBlobMascot({ shape: "cloud", color: "#4B8FEA" });

  return (
    <>
      <BlobMascot controller={left} size={180} />
      <BlobMascot controller={right} size={180} followCursor={false} />
    </>
  );
}
```

### Reduced motion

If the user has `prefers-reduced-motion: reduce`, idle liveliness freezes. Shape and expression changes still apply.

### Playground

The live demo is the same app as `playground/`:

https://naandalist.github.io/blobmascot/

```bash
npm install
npm run dev
```

```bash
npm run build
npm run build:playground
npm run typecheck
```

## Publish

Releases go out through GitHub Actions OIDC. No npm token in the repo.

```bash
# bump version in package.json first
git tag v0.2.0
git push origin v0.2.0
```

## License

MIT
