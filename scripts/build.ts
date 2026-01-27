import { build } from "vite";
import packageJSON from "../package.json";
import path, { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";
import minifyHTML from "@lit-labs/rollup-plugin-minify-html-literals";
import { fileURLToPath } from "url";
import { platformIIFEPlugin } from "./plugins/platform";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type BuildMode = "userscript" | "bundle";

const version =
    process.argv[3] ?? `${packageJSON.version}-dev-${new Date().toISOString()}`;
const root = resolve(__dirname, "..");
const banner = readFileSync(resolve(root, "readit.meta.js"), "utf-8").replace(
    "%version%",
    version,
);

const common: import("vite").InlineConfig = {
    define: {
        __READIT_VERSION__: JSON.stringify(version),
    },
    resolve: {
        alias: {
            "@api": resolve(root, "./src/api"),
            "@modules": resolve(root, "./src/modules"),
        },
    },
    plugins: [minifyHTML()],
    build: {
        target: "esnext",
        outDir: "dist",
        emptyOutDir: false,
    },
};

const commonLibConfig: import("vite").LibraryOptions = {
    entry: resolve(root, "./src/index.ts"),
    name: "ReadIt",
    formats: ["iife"],
};

export async function buildReadIt(mode: BuildMode = "userscript") {
    const isBundle = mode == "bundle";
    const manifest = {
        version,
    };

    if (isBundle) {
        await build({
            ...common,
            plugins: [
                ...(common.plugins ?? []),
                platformIIFEPlugin(root, mode),
            ],
            build: {
                ...common.build,
                lib: {
                    ...commonLibConfig,
                    fileName: () => "readit.bundle.js",
                },
            },
        });
    } else {
        await build({
            ...common,
            esbuild: {
                banner,
            },
            plugins: [
                ...(common.plugins ?? []),
                platformIIFEPlugin(root, mode),
            ],
            build: {
                ...common.build,
                lib: {
                    ...commonLibConfig,
                    fileName: () => "readit.user.js",
                },
            },
        });
    }

    writeFileSync(
        resolve(root, "dist/manifest.json"),
        JSON.stringify(manifest),
    );

    console.log(`Successfully built ${isBundle ? "bundle" : "userscript"}!`);
}

if (require.main) {
    buildReadIt(process.argv[2] as BuildMode);
}
