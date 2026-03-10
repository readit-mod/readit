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
                // perfMetrics
                {
                    match: /notifyAndSendMetrics\(\i\){/,
                    replace: "$&return;",
                },
                // events
                {
                    match: /(?<=fetch\(\i,\s*{body:\s*)(\i)/,
                    replace: "$self.mutateBody($1)",
                },
            ],
        },

        {
            find: "alb.reddit.com/track",
            replacement: [
                {
                    match: /fetch.{0,20}alb\.reddit\.com\/track.{0,475}"failed".+?\)}\)[;,]/,
                    replace: "",
                },
            ],
        },
    ],

    mutateBody(bodyString: string) {
        const body = JSON.parse(bodyString);

        body.info = [];
        return JSON.stringify(body);
    },

    start() {
        hookDefineProperty(window, "SENTRY_CONFIG", (config) => {
            config.enabled = false;
        });

        hookDefineProperty(window, "CLIENT_CONFIG", (config) => {
            config.DISABLE_W3_REPORTING = true;
        });
    },
});

declare global {
    interface Window {
        SENTRY_CONFIG: any;
        CLIENT_CONFIG: any;
    }
}
