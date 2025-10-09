import { definePlugin } from "@/lib/plugin";

export default definePlugin({
    name: "ReadIt Tracking Blocker",
    description: "Builtin plugin to block tracking scripts.",
    id: "readit-tracking-blocker",
    version: "1.0.0",
    onLoad: async () => {
        // There are some URLs Reddit uses for tracking
        const blockedURLs = [
            "/svc/shreddit/events",
            "https://w3-reporting.reddit.com/reports",
            "/svc/shreddit/perfMetrics"
        ]

        // Override fetch to block requests to these URLs
        const originalFetch = window.fetch;

        window.fetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
            let url = typeof input === "string" ? input : input.url;
        
            if(blockedURLs.some(blocked => url.includes(blocked))) {
                return new Response("OK", { status: 200, statusText: "OK" });
            }
            return originalFetch(input, init);
        }

        const originalSendBeacon = window.navigator.sendBeacon;

        // Some requests use navigator.sendBeacon
        window.navigator.sendBeacon = (url: string, data?: BodyInit | null): boolean => {
            if(blockedURLs.some(blocked => url.includes(blocked))) {
                return true; // Indicate success without sending
            }
            return originalSendBeacon.call(unsafeWindow.navigator, url, data);
        }
    }
});