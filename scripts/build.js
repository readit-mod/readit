import { build } from "vite";
import preact from "@preact/preset-vite";
import path, { resolve, dirname } from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const root = path.resolve(__dirname, "..");
const packageJson = JSON.parse(
    readFileSync(resolve(root, "package.json"), "utf-8"),
);
const bannerTemplate = readFileSync(resolve(root, "readit.meta.js"), "utf-8");

async function runBuild(mode = "default") {
    const isBundle = mode === "bundle";
    const banner = isBundle
        ? undefined
        : bannerTemplate.replace("%version%", packageJson.version);

    const buildOptions = {
        plugins: [preact()],
        esbuild: {
            jsxImportSource: "preact",
            banner,
        },
        define: {
            __READIT_VERSION__: JSON.stringify(packageJson.version),
        },
        build: {
            target: "esnext",
            outDir: "dist",
            emptyOutDir: false,
            lib: {
                entry: resolve(root, "src/index.ts"),
                name: "ReadIt",
                fileName: () =>
                    isBundle ? "readit.bundle.js" : "readit.user.js",
                formats: ["iife"],
            },
            rollupOptions: {
                external: [],
            },
        },
        resolve: {
            alias: {
                "@": resolve(root, "./src"),
            },
        },
    };

    await build(buildOptions);

    console.log(
        `Built ${isBundle ? "bundle" : "user script"} → dist/${
            isBundle ? "readit.bundle.js" : "readit.user.js"
        }`,
    );
}

const modeArg = process.argv[2];

await runBuild(modeArg);
