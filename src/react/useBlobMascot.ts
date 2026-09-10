import { useMemo, useRef, useSyncExternalStore } from "react";
import { createController } from "../core/controller";
import type { BlobMascotOptions, BlobSnapshot } from "../core/types";

export function useBlobMascot(options: BlobMascotOptions = {}) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const controller = useMemo(() => createController(optionsRef.current), []);

  const snapshot: BlobSnapshot = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  );

  return { ...controller, snapshot };
}

export type UseBlobMascotReturn = ReturnType<typeof useBlobMascot>;
