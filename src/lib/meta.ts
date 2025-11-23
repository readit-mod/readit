import { withNative } from "@lib/native";

let meta: ReadItMeta;

meta = withNative(() => {
    return window.ReadItNative.meta;
}) ?? {
    // It doesnt have a specific loader, so we pass the script version.
    loaderVersion: GM_info.script.version,
    platform: "userscript",
};

export { meta };
