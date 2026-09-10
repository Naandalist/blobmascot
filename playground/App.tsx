import {
  BlobMascot,
  SPIKE_EXPRESSIONS,
  SPIKE_SHAPES,
  SPIKE_STATES,
  useBlobMascot,
  exportPng,
} from "../src";

export function App() {
  const mascot = useBlobMascot({
    shape: "cloud",
    expression: "happy",
    state: "idle",
    color: "#4F8EF7",
  });

  async function downloadPng() {
    const blob = await exportPng(mascot.getSnapshot(), 512);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blobmascot.png";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="page">
      <h1>blobmascot</h1>
      <p className="lead">Fase 0 spike: morph circle / pebble / cloud, then change the face.</p>
      <div className="stage">
        <div className="canvas-wrap">
          <BlobMascot controller={mascot} size={240} />
        </div>
        <div className="controls">
          <label>
            Shape
            <select
              value={mascot.snapshot.shape}
              onChange={(e) => mascot.setShape(e.target.value as typeof mascot.snapshot.shape)}
            >
              {SPIKE_SHAPES.map((shape) => (
                <option key={shape}>{shape}</option>
              ))}
            </select>
          </label>
          <label>
            Expression
            <select
              value={mascot.snapshot.expression}
              onChange={(e) =>
                mascot.setExpression(e.target.value as typeof mascot.snapshot.expression)
              }
            >
              {SPIKE_EXPRESSIONS.map((expression) => (
                <option key={expression}>{expression}</option>
              ))}
            </select>
          </label>
          <label>
            State
            <select
              value={mascot.snapshot.state}
              onChange={(e) => mascot.setState(e.target.value as typeof mascot.snapshot.state)}
            >
              {SPIKE_STATES.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
          </label>
          <label>
            Color
            <input
              type="color"
              value={mascot.snapshot.color}
              onChange={(e) => mascot.setColor(e.target.value)}
            />
          </label>
          <div className="row">
            <button type="button" onClick={() => mascot.lookAt({ yaw: -40, pitch: 6 })}>
              Look left
            </button>
            <button type="button" onClick={() => mascot.resetGaze()}>
              Center
            </button>
            <button type="button" onClick={() => mascot.lookAt({ yaw: 40, pitch: 6 })}>
              Look right
            </button>
          </div>
          <button type="button" onClick={downloadPng}>
            Export PNG
          </button>
        </div>
      </div>
    </main>
  );
}
