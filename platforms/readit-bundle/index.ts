import { expose } from "../../src/api/expose";

declare global {
    const ReadItNative: {
        meta: {
            loaderVersion: string;
            platform: string;
        };
    };
}

expose(
    {
        info: {
            version: ReadItNative.meta.loaderVersion,
            platform: ReadItNative.meta.platform,
        },
    },
    "readit.platform",
);
