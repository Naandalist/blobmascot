# blobmascot

Procedural blob mascot for React. Morph, emote, react.

Live canvas character. Shape, expression, and motion are independent axes. PNG export is included. GIF/WebP come later.

Inspired by the idea behind [`reactive_bloub`](https://pub.dev/packages/reactive_bloub) (Flutter).

## Status

**0.1.1** package-ready playground + library API.

- 12 shapes
- 12 expressions
- cursor gaze, blink, liveliness
- click to poke
- `exportPng()`

Not on npm yet. Install from GitHub or local `dist`.

## Usage

```tsx
import { BlobMascot, useBlobMascot, exportPng } from "blobmascot";

function App() {
  const mascot = useBlobMascot({
    shape: "droplet",
    expression: "curious",
    state: "idle",
    color: "#111111",
  });

  return (
    <BlobMascot
      controller={mascot}
      size={240}
      followCursor
    />
  );
}
```

```ts
mascot.setShape("clover");
mascot.setExpression("happy");
mascot.setState("thinking");
mascot.setColor("#4B8FEA");
mascot.lookAt({ yaw: 20, pitch: -8 });
mascot.poke();
const png = await exportPng(mascot.getSnapshot(), 1024);
```

## Develop

```bash
npm install
npm run dev
```

```bash
npm run build
npm run build:playground
npm run typecheck
```

Playground source is `playground/`. Library source is `src/`.

## Layout

```
src/
  core/        controller, runtime, types
  geometry/    shape paths + morph
  face/        expressions + 3D gaze
  motion/      idle, thinking, burst, ...
  render/      canvas 2d
  export/      png (gif later)
  react/       <BlobMascot />, useBlobMascot()
playground/
```

## Roadmap

- **0.0.x** spike: closed
- **0.1.1** public API, poke, PNG, playground build
- **0.2.0** GIF/WebP export, CSS theme, npm publish

## License

MIT
