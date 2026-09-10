import { useEffect, useRef, useState } from "react";
import {
  BlobMascot,
  EXPRESSIONS,
  PALETTE,
  PLAYGROUND_STATES,
  SHAPES,
  useBlobMascot,
  exportPng,
  exportWebp,
} from "../src";
import { MiniBlob } from "./MiniBlob";

type Theme = "lavender" | "light" | "dark";
type ExportKind = "png" | "webp";

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
  const previewColor = theme === "dark" ? DARK_BODY : LIGHT_BODY;

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
      kind === "webp"
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
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 3v12m0 0 4.5-4.5M12 15 7.5 10.5M5 21h14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Export
            <svg className="caret" viewBox="0 0 24 24" aria-hidden="true">
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
              <MiniBlob shape={shape} expression="surprised" color={previewColor} />
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
              <MiniBlob shape="circle" expression={expression} color={previewColor} />
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
              <MiniBlob shape="circle" expression="surprised" state={state} color={previewColor} />
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
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.12-1.47-1.12-1.47-.92-.63.07-.62.07-.62 1 .07 1.53 1.04 1.53 1.04.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.1.39-1.99 1.03-2.7-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.03a9.56 9.56 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.37.2 2.39.1 2.64.64.71 1.03 1.6 1.03 2.7 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
            />
          </svg>
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
