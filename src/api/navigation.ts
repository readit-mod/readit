import type { TemplateResult } from "lit";
import { expose } from "./expose";
import { logger } from "./logger";
import { destructureClass } from "./utils/class";
import type { TypedLitElement } from "./utils/element";

type ShredditApp = TypedLitElement<{
    _navigationController: {
        navigateTo(destination: string): void;
    };
}>;

export function navigateTo(url: string) {
    const shredditApp = document.querySelector("shreddit-app") as ShredditApp;

    const { navigateTo } = destructureClass(shredditApp._navigationController);

    navigateTo(url);
}

export function navigateToReadItRoute(id: string) {
    if (!routes.has(id)) return logger.warn(`Route ${id} does not exist!`);

    navigateTo(`?readit-route=${id}`);
}

export type Route = {
    id: string;
    render: (params: URLSearchParams) => TemplateResult;
};

const routes = new Map<string, Route>();

export function registerRoute(route: Route) {
    if (!routes.has(route.id)) routes.set(route.id, route);
}

export function maybeGetRoute(id: string): Route | undefined {
    return routes.get(id);
}

expose(
    {
        registerRoute,
        navigateTo,
        navigateToReadItRoute,
    },
    "readit.navigation",
);
