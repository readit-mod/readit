import { componentRenderPatch } from "@api/patches/customElements";
import { defineCorePlugin, PluginLifeCycle } from "@api/plugins";
import { nothing } from "@modules/common/lit";

const unpatches: (() => void)[] = [];

export default defineCorePlugin({
    name: "NoAds",
    id: "readit.no-ads",
    version: "1.0.0",
    lifeCycle: PluginLifeCycle.OnInit,
    start() {
        [
            "shreddit-ad-post",
            "shreddit-comments-page-ad",
            "shreddit-sidebar-ad",
        ].forEach((e) => {
            unpatches.push(
                componentRenderPatch(e, () => {
                    return nothing;
                }),
            );
        });
    },
    stop() {
        for (const unpatch of unpatches) {
            unpatch();
        }
    },
});
