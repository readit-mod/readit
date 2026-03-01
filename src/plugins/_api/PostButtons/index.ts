import { getButtonResult, getButtonsForPost, getOverflowMenuItems } from "@api/patches/postButtons";
import { defineCorePlugin, PluginLifeCycle } from "@api/plugins";
import { html } from "@modules/common/lit";
import type { LitElement } from "lit";

export default defineCorePlugin({
    name: "PostButtonAPI",
    id: "readit.post-buttons",
    version: "1.0.0",
    lifeCycle: PluginLifeCycle.OnInit,

    patches: [
        {
            find: "renderReportButton",
            replacement: [
                {
                    match: /(?<=renderReportButton.{0,10})<div/,
                    // biome-ignore lint/suspicious/noTemplateCurlyInString: we are modifying the template literal
                    replace: "${$self.renderPostButtons(this)} $&",
                },
            ],
        },
        {
            find: "get overflowActions",
            replacement: [
                {
                    match: /(\i)\.\i(?=]\.filter)/,
                    replace: "$&,...$self.getOverflowMenuItems(this)",
                },
            ],
        },
    ],

    renderPostButtons(post: LitElement) {
        const buttons = getButtonsForPost(post);

        return html`${buttons.map((button) => getButtonResult((post as any).id, button))}`;
    },

    getOverflowMenuItems,
});
