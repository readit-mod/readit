import { defineCorePlugin, PluginLifeCycle } from "@api/plugins";
import { hookDefineProperty } from "@api/wait";

export default defineCorePlugin({
    name: "NoTrack",
    id: "readit.no-track",
    version: "1.0.0",
    lifeCycle: PluginLifeCycle.OnInit,

    patches: [
        {
            find: "notifyAndSendMetrics",
            replacement: [
                {
                    match: /(?<=disabled:\s*)Boolean\(\i\.DISABLE_W3_REPORTING\)/,
                    replace: "true",
                },
                {
                    match: /(?<=notifyAndSendMetrics\(\i\){).{0,50}(?=})/,
                    replace: "",
                },
            ],
        },
    ],

    start() {
        hookDefineProperty(window, "Sentry", (Sentry) => {
            for (const key of Object.keys(Sentry)) {
                delete Sentry[key];
            }

            setTimeout(() => {
                Reflect.deleteProperty(window, "Sentry");
            }, 0);
        });
    },
});

declare global {
    interface Window {
        Sentry: any;
    }
}
