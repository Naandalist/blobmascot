import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root,
  base: "./",
  plugins: [react()],
  build: {
    outDir: resolve(root, "../dist-playground"),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      blobmascot: resolve(root, "../src/index.ts"),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
