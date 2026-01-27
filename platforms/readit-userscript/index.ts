import { expose } from "../../src/api/expose";

declare global {
    const GM_info: {
        script: {
            version: string;
        };
    };
}

expose(
    {
        info: {
            version: GM_info.script.version,
            platform: "userscript",
        },
    },
    "readit.platform",
);
