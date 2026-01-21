import { expose } from "@api/expose";
import { normaliseMatch } from "@api/regexp";

export const chain = {
    all(...factories: Fn[]): Fn {
        return (m) => factories.every((f) => f(m));
    },

    any(...factories: Fn[]): Fn {
        return (m) => factories.some((f) => f(m));
    },

    none(...factories: Fn[]): Fn {
        return (m) => !chain.any(...factories)(m);
    },
};

export const filters = {
    byCode(...matches: CodeFilter[]): (fn: Fn) => boolean {
        return (fn: Fn) => {
            if (!filters.byIsFunctional(true)(fn)) return false;

            const code = fn.toString();

            return matches.every((match) =>
                match instanceof RegExp
                    ? normaliseMatch(match).test(code)
                    : code.includes(match),
            );
        };
    },

    byProps(...props: string[]): (obj: Record<string, any>) => boolean {
        return (obj: Record<string, any>) =>
            props.every((prop) => obj[prop] !== void 0);
    },

    byPrototypeKeys(...props: string[]): (obj: AnyClass) => boolean {
        return (obj: AnyClass) =>
            filters.byProps(...props)(obj.prototype ?? {});
    },

    byIsFunctional(functional: boolean): (fn: Fn) => boolean {
        return (fn: Fn) => {
            return (typeof fn == "function") == functional;
        };
    },

    /**
     * This should only be used with functions which don't have rest
     * parameters (i.e. `function (...args)`) and don't have a default parameter
     * (i.e. `function (x = 1)`), in such cases the parameters can not be
     * reliably counted.
     */
    byParameterCount(count: number): (fn: Fn) => boolean {
        return (fn: Fn) =>
            filters.byIsFunctional(true)(fn) && fn.length == count;
    },
};

expose(filters, "readit.modules.filters");
expose(chain, "readit.modules.filters.chain");
