import { useState } from "react";
import {
  BlobMascot,
  EXPRESSIONS,
  PALETTE,
  PLAYGROUND_STATES,
  SHAPES,
  useBlobMascot,
  exportPng,
} from "../src";
import { MiniBlob } from "./MiniBlob";

export function App() {
  const [followCursor, setFollowCursor] = useState(true);
  const mascot = useBlobMascot({
    shape: "circle",
    expression: "surprised",
    state: "idle",
    color: "#111111",
  });

  async function downloadPng() {
    const blob = await exportPng(mascot.getSnapshot(), 1024);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blobmascot.png";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app">
      <section className="stage">
        <BlobMascot controller={mascot} size={420} followCursor={followCursor} />
        <button className="export" type="button" onClick={downloadPng}>
          Export as PNG
        </button>
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
        <a className="about" href="https://github.com/Naandalist/blobmascot">
          View the project on GitHub
        </a>
      </aside>
    </div>
  );
}

function label(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
