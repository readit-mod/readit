import { readFileSync, rmSync } from "fs";
import { resolve } from "path";
import { build, Plugin } from "vite";
import { tmpdir } from "os";

export function platformIIFEPlugin(
    root: string,
    type: "userscript" | "bundle",
): Plugin {
    const entry = resolve(root, `platforms/readit-${type}/index.ts`);
    const outDir = resolve(tmpdir(), `readit-platform-${type}`);

    let iifeCode: string | null = null;

    return {
        name: "readit-platform-iife",

        async buildStart() {
            await build({
                root,
                logLevel: "silent",
                build: {
                    emptyOutDir: true,
                    outDir,
                    lib: {
                        entry,
                        name: "ReadItPlatform",
                        formats: ["iife"],
                        fileName: () => "platform.iife.js",
                    },
                    rollupOptions: {
                        output: {
                            inlineDynamicImports: true,
                        },
                    },
                    minify: false,
                },
            });

            const file = resolve(outDir, "platform.iife.js");
            iifeCode = readFileSync(file, "utf8");

            rmSync(outDir, { recursive: true, force: true });
        },

        renderChunk(code, chunk) {
            if (!chunk.isEntry || !iifeCode) return null;

            return {
                code: `${iifeCode};\n${code}`,
                map: null,
            };
        },
    };
}
