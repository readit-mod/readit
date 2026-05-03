import type { Plugin } from "vite";

export function inlineCss(): Plugin {
    return {
        name: "inline-css",
        enforce: "pre",

        async resolveId(source, importer) {
            if (source.endsWith(".css") && !source.includes("?")) {
                return this.resolve(`${source}?inline`, importer, {
                    skipSelf: true,
                });
            }
        },
    };
}
