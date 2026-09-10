import {
  BlobMascot,
  EXPRESSIONS,
  PLAYGROUND_STATES,
  SHAPES,
  useBlobMascot,
  exportPng,
} from "../src";
import { MiniBlob } from "./MiniBlob";

export function App() {
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
        <BlobMascot controller={mascot} size={420} />
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
      </aside>
    </div>
  );
}

function label(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
