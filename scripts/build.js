import { build } from "vite";
import preact from "@preact/preset-vite";
import path, { resolve, dirname } from "path";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const root = path.resolve(__dirname, "..");
const packageJson = JSON.parse(
    readFileSync(resolve(root, "package.json"), "utf-8"),
);
const bannerTemplate = readFileSync(resolve(root, "readit.meta.js"), "utf-8");

async function runBuild(mode = "userscript", version = "") {
    const isBundle = mode === "bundle";
    const formattedVersion = version ? version : `${packageJson.version}-dev-${(new Date()).toISOString()}`
    const banner = isBundle
        ? undefined
        : bannerTemplate.replace("%version%", formattedVersion);

    const buildOptions = {
        plugins: [preact()],
        esbuild: {
            jsxImportSource: "preact",
            banner,
        },
        define: {
            __READIT_VERSION__: JSON.stringify(formattedVersion),
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
                "@modules": resolve(root, "./src/core/modules"),
                "@components": resolve(root, "./src/core/components"),
                "@lib": resolve(root, "./src/lib"),
                "@utils": resolve(root, "./src/core/utils.ts"),
                "@": resolve(root, "./"),
            },
        },
    };

    await build(buildOptions);

    let manifest = {
        version: formattedVersion,
    }

    writeFileSync(path.join(root, "dist/manifest.json"), JSON.stringify(manifest))

    console.log(
        `Built ${isBundle ? "bundle" : "user script"} → dist/${
            isBundle ? "readit.bundle.js" : "readit.user.js"
        }`,
    );
}

const modeArg = process.argv[2];
const versionArg = process.argv[3];

await runBuild(modeArg, versionArg);
