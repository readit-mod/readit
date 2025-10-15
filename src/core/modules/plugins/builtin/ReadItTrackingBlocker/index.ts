import { definePlugin } from "@/lib/plugin";

export default definePlugin({
    name: "ReadIt Tracking Blocker",
    description: "Builtin plugin to block tracking scripts.",
    id: "readit-tracking-blocker",
    version: "1.1.0",

    async onLoad ({ cleanup }) {
        const blockedPatterns = [
            /\/svc\/shreddit\/events\b/i,
            /https:\/\/w3-reporting\.reddit\.com\/reports\b/i,
            /\/svc\/shreddit\/perfMetrics\b/i
        ];

        const originalFetch = window.fetch;
        const originalSendBeacon = window.navigator.sendBeacon;

        const fetchProxy = new Proxy(originalFetch, {
            apply(target, thisArg, args: Parameters<typeof fetch>) {
                const [input] = args;
                let init = args[1];
                const url = input.toString();

                if (url.includes("/svc/shreddit/events") && init?.body) {
					try {
						const bodyObj = JSON.parse(init.body as string);

						bodyObj.info = [];

						init = { ...init, body: JSON.stringify(bodyObj) };
					} catch {

					}
				}

                return Reflect.apply(target, thisArg, [input, init]);
            },
        });

        const sendBeaconProxy = new Proxy(originalSendBeacon, {
            apply(target, thisArg, args: Parameters<typeof navigator.sendBeacon>) {
                const [url] = args;

                if (blockedPatterns.some(re => re.test(url.toString()))) {
                    return true;
                }

                return Reflect.apply(target, thisArg, args);
            },
        });

		window.fetch = fetchProxy;
		window.navigator.sendBeacon = sendBeaconProxy;


        cleanup = () => {
            window.fetch = originalFetch;
            window.navigator.sendBeacon = originalSendBeacon;
        };
    },
});
