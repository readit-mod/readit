import { createCustomCssSheet, removeCustomCssSheet } from "@api/css";
import { definePlugin, PluginLifeCycle } from "@api/plugins";
import styles from "./styles.css";

const sheet = createCustomCssSheet("readit.uienhancer", "");

export default definePlugin({
    name: "UI Enhancer",
    id: "readit.uienhancer",
    version: "1.0.0",
    lifeCycle: PluginLifeCycle.OnInit,
    start() {
        sheet.replaceSync(styles);
    },
    stop() {
        removeCustomCssSheet("readit.uienhancer", false);
    },
});
