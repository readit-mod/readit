import { FilterFn, InternalModule } from "@modules/types";
import { registry } from "./_internals/registry";
import { normaliseMatch } from "@api/regexp";
import { expose } from "@api/expose";
import { isArrayEqual } from "@api/utils/array";

export const cache = new Map<string, string | null>();
export const multiCache = new Map<string, string[]>();

type FindOptions = {
    findAll?: boolean;
    key: string;
};

export function find(factory: FilterFn, options: FindOptions) {
    const { key, findAll = false } = options;
    const result: InternalModule[] = [];

    // Has this been searched already?
    if (!findAll && cache.has(key)) {
        return registry.getModuleById(cache.get(key));
    } else if (findAll && multiCache.has(key)) {
        return multiCache.get(key).map((id) => registry.getModuleById(id));
    }

    // Start a new search.
    for (const [_, module] of Object.entries(registry.getModules())) {
        if (factory(module)) {
            if (findAll) {
                result.push(module);
            } else {
                cache.set(key, module.id);
                return module;
            }
        }
    }

    if (findAll) {
        result.length != 0 &&
            multiCache.set(
                key,
                result.map((m) => m.id),
            );
        return result;
    } else {
        return null;
    }
}

export const filters = {
    byCode(...matches: CodeFilter[]): FilterFn {
        return (module: InternalModule) => {
            const factoryString = module.factory?.toString() ?? "";

            return matches.every((match) =>
                match instanceof RegExp
                    ? normaliseMatch(match).test(factoryString)
                    : factoryString.includes(match),
            );
        };
    },

    byProps(...props: string[]): FilterFn {
        return (module: InternalModule) => {
            const exports = module.exports;
            return props.every((prop) => exports?.[prop] !== void 0);
        };
    },

    byDepsCount(count: number): FilterFn {
        return (module: InternalModule) => module.deps.length == count;
    },

    byHasExports(hasExports: boolean): FilterFn {
        return (module: InternalModule) =>
            (Object.keys(module.exports).length != 0) == hasExports;
    },

    byDependecies(...deps: string[] | [string[]]): FilterFn {
        return (module: InternalModule) =>
            deps.length == 1 && Array.isArray(deps[0])
                ? isArrayEqual(module.deps, deps[0])
                : deps.every((d) => module.deps.includes(d as string));
    },

    byAsyncFactory(async: boolean): FilterFn {
        return (module: InternalModule) => module.isAsync == async;
    },
};

export const finders = {
    findByCode(...code: (RegExp | string)[]): InternalModule {
        const key = `code:${code
            .map((c) => (c instanceof RegExp ? c.source : c))
            .join(",")}`;

        return find(filters.byCode(...code), { key }) as InternalModule;
    },

    findByProps(...props: string[]): InternalModule {
        const key = `props:${props.join(",")}`;
        return find(filters.byProps(...props), { key }) as InternalModule;
    },

    findByCodeAll(...code: (RegExp | string)[]): InternalModule {
        const key = `code:${code
            .map((c) => (c instanceof RegExp ? c.source : c))
            .join(",")}`;

        return find(filters.byCode(...code), {
            key,
            findAll: true,
        }) as InternalModule;
    },

    findByPropsAll(...props: string[]): InternalModule {
        const key = `props:${props.join(",")}`;
        return find(filters.byProps(...props), {
            key,
            findAll: true,
        }) as InternalModule;
    },
};

expose(filters, "readit.modules.lookup.filters");
expose(finders, "readit.modules.lookup.finders");

export const waitForModule = (...args: Parameters<typeof registry.addWaiter>) =>
    registry.addWaiter(...args);

// Convenience
export function waitForModuleAsync(filter: FilterFn): Promise<InternalModule> {
    return new Promise<InternalModule>((resolve) => {
        waitForModule(filter, resolve);
    });
}

expose(
    {
        waitForModule,
        waitForModuleAsync,
    },
    "readit.modules.lookup.waiters",
);
