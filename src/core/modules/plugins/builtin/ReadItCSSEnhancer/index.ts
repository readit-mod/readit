import { definePlugin } from "@/lib/plugin"

export default definePlugin({
    name: "ReadIt CSS Enhancer",
    description: "Builtin plugin to add some CSS enhancements.",
    id: "readit-css-enhancer",
    version: "1.0.0",
    onLoad: async (api) => {
        api.customcss.addRule(`#user-drawer-content {
                max-height: 90vh !important;
                overflow-y: auto !important;
        }`)
        
        api.customcss.addRule(`*::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 4px;
                border: 2px solid #1a1a1a;
        }`)

        api.customcss.addRule(`
            *::-webkit-scrollbar {
                width: 8px;
                height: 8px;
        }`)
    }
})