import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    esbuild:{
        jsxImportSource:"nano-jsx/esm"
    },
    build: {
        target: "esnext",
        outDir: "dist",
        lib: {
            entry: "src/index.ts",
            name: "ReadIt",
            fileName: () => "readit.js",
            formats: ["iife"],
        },
        rollupOptions: {
            external: [],
        },
    },
    resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})