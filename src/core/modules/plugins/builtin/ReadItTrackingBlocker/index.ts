import { definePlugin } from "@/lib/plugin";

type BodyReplacementItem = {
    name: string;
    replacement: any;
};

type BlockedPattern =
    | {
          match: RegExp;
          bodyReplacements?: BodyReplacementItem[];
          body?: never;
      }
    | {
          match: RegExp;
          bodyReplacements?: never;
          body?: any;
      };

export default definePlugin({
    name: "ReadIt Tracking Blocker",
    description: "Builtin plugin to block tracking scripts.",
    id: "readit-tracking-blocker",
    version: "1.1.0",

    async onLoad({ cleanup, patcher }) {
        const blockedPatterns: BlockedPattern[] = [
            {
                match: /\/svc\/shreddit\/events\b/i,
                bodyReplacements: [{ name: "info", replacement: [] }],
            },
            {
                match: /\/svc\/shreddit\/perfMetrics\b/i,
                bodyReplacements: [
                    { name: "meta", replacement: [] },
                    { name: "metrics", replacement: [] },
                ],
            },
            {
                match: /https:\/\/w3-reporting\.reddit\.com\/reports\b/i,
                body: [
                    {
                        age: 1,
                        type: "reddit-w3reporting",
                        url: "",
                        user_agent:
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) GenericBrowser/100.0 Safari/537.36",
                        body: {
                            sampling_fraction: 0.0,
                            type: "histogram",
                            name: "shreddit_first_contentful_paint_seconds",
                            value: 0.0,
                            labels: {
                                device_type: "desktop",
                                is_logged_in: "false",
                                microapp_deployment: "production",
                                microapp_name: "none",
                                microapp_pool: "none",
                                page_type: "none",
                                route_name: "none",
                                hybrid_nav: "false",
                                comments_lit_ssr: "unknown",
                                is_cached: "false",
                            },
                        },
                    },
                ],
            },
        ];

        patcher.before(
            window,
            "fetch",
            (args): [RequestInfo | URL, RequestInit?] => {
                let [input, init] = args;
                const url = input.toString();

                for (const pattern of blockedPatterns) {
                    if (
                        pattern.match.test(url) &&
                        (pattern.bodyReplacements || pattern.body) &&
                        init?.body
                    ) {
                        try {
                            let bodyObj = JSON.parse(init.body as string);

                            if (pattern.bodyReplacements) {
                                for (const replacement of pattern.bodyReplacements) {
                                    bodyObj[replacement.name] =
                                        replacement.replacement;
                                }
                            } else {
                                bodyObj = pattern.body;
                            }

                            init = { ...init, body: JSON.stringify(bodyObj) };
                        } catch {}
                    }
                }

                return [input, init];
            },
        );

        patcher.before(
            window.navigator,
            "sendBeacon",
            ([url, data]): [string | URL, BodyInit?] => {
                for (const pattern of blockedPatterns) {
                    if (
                        pattern.match.test(url.toString()) &&
                        (pattern.bodyReplacements || pattern.body) &&
                        typeof data === "string"
                    ) {
                        try {
                            let bodyObj = JSON.parse(data);

                            if (pattern.bodyReplacements) {
                                for (const replacement of pattern.bodyReplacements) {
                                    bodyObj[replacement.name] =
                                        replacement.replacement;
                                }
                            } else {
                                bodyObj = pattern.body;
                            }

                            const newBody = JSON.stringify(bodyObj);
                            return [url, newBody];
                        } catch {}
                    }
                }

                return [url, data];
            },
        );

        if (window.Sentry) {
            for (const key of Object.keys(window.Sentry)) {
                patcher.instead(window.Sentry, key, () => {});
            }
        }

        cleanup(() => patcher.unpatchAll());
    },
});

declare global {
    interface Window {
        Sentry: Record<string, Function>;
    }
}
