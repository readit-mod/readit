import { expose } from "@api/expose";
import { directive } from "@modules/common/lit";
import type { DirectiveClass } from "lit/directive.js";
import { stableStringify } from "./object";

export function lazyDirective(classFactory: Fn<DirectiveClass>): ReturnType<typeof directive> {
    let wrapped: ReturnType<typeof directive>;

    return (...args) => {
        if (!wrapped) {
            const DirectiveClass = classFactory();
            wrapped = directive(DirectiveClass);
        }

        return wrapped(...args);
    };
}

export function memoize<T extends Fn>(func: T): T {
    const cached = {};

    return ((...args) => {
        const key = stableStringify(args);

        if (!(key in cached)) {
            cached[key] = func(...args);
        }

        return cached[key];
    }) as T;
}

expose(
    {
        lazyDirective,
        memoize,
    },
    "readit.api.utils.lazy",
);
