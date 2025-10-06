import { defineConfig } from "vite";
import path from "path";
import { readFileSync } from 'fs';
import { resolve } from 'path';

const packageJsonPath = resolve(__dirname, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

export default defineConfig({
    esbuild:{
        jsxImportSource:"nano-jsx/esm",
        banner: readFileSync(resolve(__dirname, "readit.meta.js"), 'utf-8').replace("%version%", packageJson.version)
    },
    build: {
        target: "esnext",
        outDir: "dist",
        lib: {
            entry: "src/index.ts",
            name: "ReadIt",
            fileName: () => "readit.user.js",
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