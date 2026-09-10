type GazeHandler = (gaze: { yaw: number; pitch: number }) => void;

type Entry = {
  canvas: HTMLCanvasElement;
  onGaze: GazeHandler;
};

const entries = new Set<Entry>();
let attached = false;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function onMove(event: PointerEvent) {
  for (const entry of entries) {
    const rect = entry.canvas.getBoundingClientRect();
    if (rect.width < 8 || rect.height < 8) continue;
    const dx = (event.clientX - (rect.left + rect.width / 2)) / (window.innerWidth * 0.32);
    const dy = (event.clientY - (rect.top + rect.height / 2)) / (window.innerHeight * 0.32);
    entry.onGaze({
      yaw: clamp(dx, -1, 1) * 36,
      pitch: clamp(dy, -1, 1) * -28,
    });
  }
}

function ensure() {
  if (attached) return;
  window.addEventListener("pointermove", onMove, { passive: true });
  attached = true;
}

function release() {
  if (!attached || entries.size > 0) return;
  window.removeEventListener("pointermove", onMove);
  attached = false;
}

export function subscribePointer(canvas: HTMLCanvasElement, onGaze: GazeHandler) {
  const entry: Entry = { canvas, onGaze };
  entries.add(entry);
  ensure();
  return () => {
    entries.delete(entry);
    release();
  };
}
