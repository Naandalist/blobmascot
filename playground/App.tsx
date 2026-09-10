import { useState } from "react";
import {
  BlobMascot,
  EXPRESSIONS,
  PALETTE,
  PLAYGROUND_STATES,
  SHAPES,
  useBlobMascot,
  exportGif,
  exportPng,
  exportWebp,
} from "../src";
import { MiniBlob } from "./MiniBlob";

type Theme = "lavender" | "light" | "dark";

export function App() {
  const [followCursor, setFollowCursor] = useState(true);
  const [theme, setTheme] = useState<Theme>("lavender");
  const mascot = useBlobMascot({
    shape: "circle",
    expression: "surprised",
    state: "idle",
    color: "#111111",
  });

  async function download(kind: "png" | "gif" | "webp") {
    const snapshot = mascot.getSnapshot();
    const blob =
      kind === "gif"
        ? await exportGif(snapshot, { size: 256, durationMs: 2000, fps: 12 })
        : kind === "webp"
          ? await exportWebp(snapshot, { size: 1024 })
          : await exportPng(snapshot, 1024);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blobmascot.${kind}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app" data-theme={theme}>
      <section className="stage">
        <BlobMascot controller={mascot} size={720} followCursor={followCursor} />
        <div className="exports">
          <button className="export" type="button" onClick={() => download("png")}>
            Export PNG
          </button>
          <button className="export" type="button" onClick={() => download("gif")}>
            Export GIF
          </button>
          <button className="export" type="button" onClick={() => download("webp")}>
            Export WebP
          </button>
        </div>
      </section>

      <aside className="dock">
        <h2>Shape</h2>
        <div className="grid">
          {SHAPES.map((shape) => (
            <button
              key={shape}
              type="button"
              className={mascot.snapshot.shape === shape ? "cell on" : "cell"}
              onClick={() => mascot.setShape(shape)}
            >
              <MiniBlob shape={shape} expression="surprised" />
              <span>{label(shape)}</span>
            </button>
          ))}
        </div>

        <h2>Expression</h2>
        <div className="grid">
          {EXPRESSIONS.map((expression) => (
            <button
              key={expression}
              type="button"
              className={mascot.snapshot.expression === expression ? "cell on" : "cell"}
              onClick={() => mascot.setExpression(expression)}
            >
              <MiniBlob shape="circle" expression={expression} />
              <span>{label(expression)}</span>
            </button>
          ))}
        </div>

        <h2>Animations</h2>
        <div className="grid">
          {PLAYGROUND_STATES.map((state) => (
            <button
              key={state}
              type="button"
              className={mascot.snapshot.state === state ? "cell on" : "cell"}
              onClick={() => mascot.setState(state)}
            >
              <MiniBlob shape="circle" expression="surprised" state={state} />
              <span>{label(state)}</span>
            </button>
          ))}
        </div>

        <h2>Colour</h2>
        <div className="swatches">
          {PALETTE.map((color) => (
            <button
              key={color}
              type="button"
              className={mascot.snapshot.color.toLowerCase() === color.toLowerCase() ? "swatch on" : "swatch"}
              style={{ background: color }}
              aria-label={color}
              onClick={() => mascot.setColor(color)}
            />
          ))}
        </div>

        <h2>Theme</h2>
        <div className="themes">
          {(["lavender", "light", "dark"] as Theme[]).map((value) => (
            <button
              key={value}
              type="button"
              className={theme === value ? "theme on" : "theme"}
              onClick={() => setTheme(value)}
            >
              {label(value)}
            </button>
          ))}
        </div>

        <div className="toggle-row">
          <span>Follow Cursor</span>
          <button
            type="button"
            className={followCursor ? "switch on" : "switch"}
            aria-pressed={followCursor}
            onClick={() => setFollowCursor((value) => !value)}
          >
            <span />
          </button>
        </div>

        <h2>About</h2>
        <a
          className="about"
          href="https://github.com/Naandalist/blobmascot"
          target="_blank"
          rel="noreferrer"
        >
          <span>
            <strong>View on GitHub</strong>
            <small>Naandalist/blobmascot</small>
          </span>
        </a>
      </aside>
    </div>
  );
}

function label(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
