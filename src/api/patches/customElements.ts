import { expose } from "@api/expose";
import { createPatcher } from "@api/patcher";
import { LitElement } from "lit";

type PatchCallback = (self: LitElement, args: any[], ret: any) => any;

interface FaceplatePartialInstance extends HTMLElement {
    __src: string;
}

/**
 * Generic patcher for the "render" method of Lit custom elements.
 *
 * @param element The name of the custom element.
 * @param callback The patch that will be run after the render method, anything returned from here will be the result of the render method.
 */
export function componentRenderPatch(
    element: string,
    callback: PatchCallback,
): () => void {
    const patcher = createPatcher(`componentPatcher:${element}`);
    let shouldPatch = true;

    customElements.whenDefined(element).then((ElementClass) => {
        patcher.after(
            ElementClass.prototype,
            "render",
            (self, args, result) => {
                return shouldPatch ? callback(self, args, result) : result;
            },
        );
        updateInstances();
    });
    function updateInstances() {
        // Propogate changes in case there are elements already rendered.
        document
            .querySelectorAll(element)
            .forEach((elem: LitElement) => elem.requestUpdate());
    }

    return () => {
        shouldPatch = false;
        updateInstances();
    };
}

const lazyComponentPatches = new Map<
    (instance: HTMLElement) => boolean,
    (partial: Document) => any
>();

/**
 * A patcher for lazy loaded components in Reddit which are loaded with `faceplate-partial`.
 * @param filter A function to determine whether the current `faceplate-partial` is the right one, you can use properties such as `__src`.
 * @param callback The function that will be called after the component is fetched, before it is injected, the argument being a {@link Document} which can be manipulated (note that it will be parsed in a way that means it will include `html` and `body` tags, the component contents will be in the `body`).
 * @returns A function to unpatch, only useful if it's in the same time as the patch is added, once the component has been loaded, it's too late.
 */
export function lazyComponentPatch(
    filter: (instance: FaceplatePartialInstance) => boolean,
    callback: (partial: Document) => any,
): () => void {
    if (!lazyComponentPatches.has(filter)) {
        lazyComponentPatches.set(filter, callback);
    }

    return () => lazyComponentPatches.delete(filter);
}

/** @internal */
export async function initLazyPatches() {
    const FaceplatePartial =
        await customElements.whenDefined("faceplate-partial");
    const patcher = createPatcher("lazyComponentPatcher");

    patcher.after(
        FaceplatePartial.prototype,
        "_loadContent",
        async (self, _, resultPromise) => {
            if (resultPromise === void 0) return;
            const result = await resultPromise;

            for (const [filter, callback] of lazyComponentPatches.entries()) {
                const shouldPatch = filter(self);

                if (shouldPatch) {
                    const parsedPartial = new DOMParser().parseFromString(
                        result,
                        "text/html",
                    );
                    callback(parsedPartial);

                    return parsedPartial.body.innerHTML;
                }
            }

            return result;
        },
    );
}

export const filters = {
    bySrcIncludes: (text: string) => (instance: FaceplatePartialInstance) =>
        instance.__src.toLowerCase().includes(text.toLowerCase()),

    byName(name: string) {
        return (instance: FaceplatePartialInstance) => {
            const [_, instanceName] =
                /^([^_]+)_/.exec(instance.getAttribute("name")) || [];

            return instanceName === name;
        };
    },
};

expose(
    { componentRenderPatch, lazyComponentPatch, filters },
    "readit.api.patches.customElements",
);
