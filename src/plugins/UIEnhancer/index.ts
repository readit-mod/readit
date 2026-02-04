import { createCustomCssSheet, removeCustomCssSheet } from "@api/customcss";
import { definePlugin, PluginLifeCycle } from "@api/plugins";

const sheet = createCustomCssSheet("readit.uienhancer", "");

export default definePlugin({
    name: "UI Enhancer",
    id: "readit.uienhancer",
    version: "1.0.0",
    lifeCycle: PluginLifeCycle.OnInit,
    start() {
        sheet.insertRule(`
            * {
                &::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 4px;
                    border: 2px solid #1a1a1a;
                }
                
                &::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
            }
        `);
        sheet.insertRule(`
            #user-drawer-content {
                max-height: 90vh !important;
                overflow-y: auto !important;
            }
        `);
    },
    stop() {
        removeCustomCssSheet("readit.uienhancer", false);
    },
});
