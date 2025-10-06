import { definePlugin } from "@/lib/plugin";

export default definePlugin({
    name: "ReadIt Tracking Blocker",
    description: "Builtin plugin to block tracking scripts.",
    id: "readit-tracking-blocker",
    version: "1.0.0",
    onLoad: async (api) => {
        // There are some URLs Reddit uses for tracking
        const blockedURLs = [
            "/svc/shreddit/events",
            "https://w3-reporting.reddit.com/reports",
            "/svc/shreddit/perfMetrics"
        ]

        // Override fetch to block requests to these URLs
        const originalFetch = unsafeWindow.fetch;

        unsafeWindow.fetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
            let url = typeof input === "string" ? input : input.url;
        
            if(blockedURLs.some(blocked => url.includes(blocked))) {
                return new Response(null, { status: 204, statusText: "No Content" });
            }
            return originalFetch(input, init);
        }

        const originalSendBeacon = unsafeWindow.navigator.sendBeacon;

        // Some requests use navigator.sendBeacon
        unsafeWindow.navigator.sendBeacon = (url: string, data?: BodyInit | null): boolean => {
            if(blockedURLs.some(blocked => url.includes(blocked))) {
                return true; // Indicate success without sending
            }
            return originalSendBeacon.call(unsafeWindow.navigator, url, data);
        }
    }
});