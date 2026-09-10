import { useEffect, useRef, useState } from "react";
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
type ExportKind = "png" | "gif" | "webp";

const DARK_BODY = "#ffffff";
const LIGHT_BODY = "#111111";

export function App() {
  const [followCursor, setFollowCursor] = useState(true);
  const [theme, setTheme] = useState<Theme>("lavender");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mascot = useBlobMascot({
    shape: "circle",
    expression: "surprised",
    state: "idle",
    color: LIGHT_BODY,
  });

  function applyTheme(next: Theme) {
    const current = mascot.getSnapshot().color.toLowerCase();
    setTheme(next);
    if (next === "dark" && current === LIGHT_BODY) {
      mascot.setColor(DARK_BODY);
    }
    if (next !== "dark" && current === DARK_BODY) {
      mascot.setColor(LIGHT_BODY);
    }
  }

  async function download(kind: ExportKind) {
    setMenuOpen(false);
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

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointer);
    return () => window.removeEventListener("pointerdown", onPointer);
  }, []);

  return (
    <div className="app" data-theme={theme}>
      <section className="stage">
        <BlobMascot controller={mascot} size={720} followCursor={followCursor} />
        <div className="exports" ref={menuRef}>
          <button
            className="export"
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            Export
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {menuOpen ? (
            <div className="export-list" role="menu">
              <button type="button" role="menuitem" onClick={() => download("png")}>
                PNG
              </button>
              <button type="button" role="menuitem" onClick={() => download("gif")}>
                GIF
              </button>
              <button type="button" role="menuitem" onClick={() => download("webp")}>
                WebP
              </button>
            </div>
          ) : null}
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
              onClick={() => applyTheme(value)}
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
