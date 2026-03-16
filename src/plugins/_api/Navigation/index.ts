import { logger } from "@api/logger";
import type { Route } from "@api/navigation";
import { maybeGetRoute, navigateTo } from "@api/navigation";
import { defineCorePlugin, PluginLifeCycle } from "@api/plugins";
import { showToast } from "@api/toasts";
import { DOMify } from "@api/utils/lit";

type CachedRoute = {
    fragment: DocumentFragment;
    scrollOffsets: Map<any, any>;
    lastAccessed: number;
};

export default defineCorePlugin({
    name: "NavigationAPI",
    id: "readit.navigation",
    version: "1.0.0",
    lifeCycle: PluginLifeCycle.LitReady,

    patches: [
        {
            find: "async hybridNavigate",
            replacement: [
                {
                    // maybeCachedRoute = historyCache.get(routeKey)
                    match: /(?<=\.destination\.key,\i=)\i\.get\(\i\)/,
                    replace: "$self.getRoute(this.pendingUrl,$&)",
                },
            ],
        },
    ],

    getRoute(url: string, original: CachedRoute) {
        const params = new URL(url).searchParams;
        const routeId = params.get("readit-route");

        if (routeId) {
            params.delete("readit-route");

            const route = maybeGetRoute(routeId);
            if (!route) {
                logger.warn(`ReadIt Route "${routeId}" could not be found.`);

                showToast({
                    message: `ReadIt Route "${routeId}" could not be found.`,
                    level: "warning",
                    duration: 8e3,
                });

                return original;
            }

            const routeFragment = prepareRouteFragment(route, params);
            const injectedRoute = prepareRoute(routeFragment);

            return injectedRoute;
        }

        return original;
    },

    start() {
        const params = new URL(location.href).searchParams;
        const route = params.get("readit-route");

        if (route) {
            navigateTo(window.location.pathname);
        }
    },
});

function prepareRouteFragment(route: Route, params: URLSearchParams): DocumentFragment {
    const fragment = new DocumentFragment();
    const routeContents = DOMify(route.render(params));

    fragment.appendChild(routeContents);

    const alertController = document.createElement("alert-controller");
    fragment.appendChild(alertController);

    return fragment;
}

const prepareRoute = (fragment: DocumentFragment): CachedRoute => ({
    fragment,
    scrollOffsets: new Map(),
    lastAccessed: Date.now(),
});
