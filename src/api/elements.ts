import { expose } from "./expose";

const elementFactoryMap = new Map<string, () => LitElementCtor>();

/**
 * A way to defer defining the element until Lit is initialised.
 * @param name The name to register the element with.
 * @param factory The factory which returns the element.
 */
export function defineSafeElement(name: string, factory: () => LitElementCtor) {
    if (!elementFactoryMap.has(name)) elementFactoryMap.set(name, factory);
}

export function waitForElement(filter: () => Element | null): Promise<Element> {
    return new Promise((resolve) => {
        if (filter()) resolve(filter());

        const observer = new MutationObserver(() => {
            const element = filter();
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}

export function defineElements() {
    for (const [name, elementFactory] of elementFactoryMap) {
        const element = elementFactory();

        customElements.define(name, element);
    }
}

type ElementFilter = (element: Element) => boolean;

export function findInElementTree(
    element: Element | ShadowRoot,
    filter: ElementFilter,
): Element {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
        acceptNode(node) {
            return filter(node as Element)
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_SKIP;
        },
    });

    return walker.nextNode() as Element;
}

export function findChild(
    element: Element,
    childFilter: ElementFilter,
): Element {
    return Array.from(element.children).find((c) => childFilter(c));
}

export const filters = {
    byTagName(tag: string): ElementFilter {
        return (element) => element.tagName.toLowerCase() == tag;
    },

    byClasses(...classes: string[]): ElementFilter {
        return (element) => classes.every((c) => element.classList.contains(c));
    },

    byAttribute(attr: string, value?: string): ElementFilter {
        return (element) =>
            value === undefined
                ? element.hasAttribute(attr)
                : element.getAttribute(attr) == value;
    },

    byChild(childFilter: ElementFilter): ElementFilter {
        return (element) => Boolean(findChild(element, childFilter));
    },
};

expose(
    {
        findInElementTree,
        filters,
    },
    "readit.api.elements",
);
