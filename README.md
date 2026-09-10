# blobmascot

Procedural blob mascot for React. Morph, emote, react.

Live canvas character. Shape, expression, and motion are three independent axes. GIF/WebP are export extras, not how it renders.

> Inspired by the idea behind [`reactive_bloub`](https://pub.dev/packages/reactive_bloub) (Flutter). This is an original rewrite, not a port of that source.

## Status

Phase 0 spike is in progress: 3 shapes, 3 faces, idle/thinking, live morph.

Not published yet. Package name reserved in this repo as `blobmascot`.

## Install (later)

```bash
npm i blobmascot
```

```tsx
import { BlobMascot, useBlobMascot } from "blobmascot";

function App() {
  const mascot = useBlobMascot({
    shape: "cloud",
    expression: "curious",
    state: "idle",
  });

  return <BlobMascot controller={mascot} size={200} />;
}
```

## Develop

```bash
npm install
npm run dev
```

Playground runs at the Vite URL. Library source lives in `src/`.

## Layout

```
src/
  core/        state machine, easing
  geometry/    shape paths + morph
  face/        expressions
  motion/      idle / thinking / orbit / burst
  fx/          particles, rings
  render/      canvas 2d
  export/      png, gif (phase 2)
  react/       BlobMascot, useBlobMascot
playground/
```

## Roadmap

- **0.0.x** spike: circle, pebble, cloud + neutral/happy/sad + idle/thinking
- **0.1.0** Flutter parity + PNG export + demo
- **0.2.0** GIF export, poke, CSS theme

## License

MIT
