import { readFileSync } from "fs";
import { resolve } from "path";
import { Plugin } from "vite";

export function platformIIFEPlugin(
    root: string,
    type: "userscript" | "bundle",
): Plugin {
    const iifePath = resolve(root, `platforms/readit-${type}.js`);
    const iifeCode = readFileSync(iifePath);

    return {
        name: "readit-platform-iife",

        renderChunk(code, chunk) {
            if (!chunk.isEntry) return;

            return {
                code: `${iifeCode};\n${code}`,
                map: null,
            };
        },
    };
}
