import { expose } from "@api/expose";

// TODO: maybe rewrite readit-desktop too?

expose(
    {
        info: {
            version: ReadItNative.meta.loaderVersion,
            platform: ReadItNative.meta.platform,
        },
    },
    "readit.platform",
);
