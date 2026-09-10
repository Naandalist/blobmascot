import { useMemo, useRef, useSyncExternalStore } from "react";
import { createController, type BlobMascotController } from "../core/controller";
import type { BlobMascotOptions, BlobSnapshot } from "../core/types";

export type UseBlobMascotReturn = BlobMascotController & {
  snapshot: BlobSnapshot;
};

export function useBlobMascot(options: BlobMascotOptions = {}): UseBlobMascotReturn {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const controller = useMemo(() => createController(optionsRef.current), []);

  const snapshot = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  );

  return useMemo(
    () => Object.assign(controller, { snapshot }),
    [controller, snapshot],
  );
}
