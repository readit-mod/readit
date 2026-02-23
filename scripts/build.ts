import { readFileSync, writeFileSync } from "node:fs";
import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";
import packageJSON from "../package.json";
import { platformIIFEPlugin } from "./plugins/platform";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type BuildMode = "userscript" | "bundle";

type MetaReplacement = {
    find: string;
    replace: (() => string) | string;
};

const version = process.argv[3] ?? `${packageJSON.version}-dev-${new Date().toISOString()}`;
const root = resolve(__dirname, "..");

const replacements: MetaReplacement[] = [
    {
        find: "%version%",
        replace: version,
    },
    {
        find: "%icon%",
        replace() {
            const rawIcon = readFileSync(resolve(root, "src/assets/svg/ReadItIcon.svg"), "utf-8");

            return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(rawIcon)}`;
        },
    },
];

function applyReplacements(meta: string, replacements: MetaReplacement[]): string {
    let result = meta;

    for (const { find, replace } of replacements) {
        result = result.replace(find, typeof replace === "function" ? replace() : replace);
    }
    return result;
}

const meta = applyReplacements(
    readFileSync(resolve(root, "readit.meta.js"), "utf-8"),
    replacements,
);

const common: import("vite").InlineConfig = {
    define: {
        __READIT_VERSION__: JSON.stringify(version),
    },
    resolve: {
        alias: {
            "@api": resolve(root, "./src/api"),
            "@modules": resolve(root, "./src/modules"),
            "@assets": resolve(root, "./src/assets"),
            "@": resolve(root, "./src"),
        },
    },
    plugins: [],
    build: {
        target: "esnext",
        outDir: "dist",
        emptyOutDir: false,
    },
};

const commonLibConfig: import("vite").LibraryOptions = {
    entry: resolve(root, "./src/index.ts"),
    name: "ReadIt",
    formats: [
        "iife",
    ],
};

export async function buildReadIt(mode: BuildMode = "userscript") {
    const isBundle = mode === "bundle";
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
                banner: meta,
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

    writeFileSync(resolve(root, "dist/manifest.json"), JSON.stringify(manifest));

    console.log(`Successfully built ${isBundle ? "bundle" : "userscript"}!`);
}

if (require.main) {
    buildReadIt(process.argv[2] as BuildMode);
}
