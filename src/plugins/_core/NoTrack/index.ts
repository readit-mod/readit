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
                // reports
                {
                    match: /(?<=disabled:\s*)Boolean\(\i\.DISABLE_W3_REPORTING\)/,
                    replace: "true",
                },
                // perfMetrics
                {
                    match: /(?<=notifyAndSendMetrics\(\i\){).{0,50}(?=})/,
                    replace: "",
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
