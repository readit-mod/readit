import { expose } from "@api/expose";
import { createPatcher } from "@api/patcher";
import { registry } from "@modules/loader/_internals/registry";
import { InternalModule } from "@modules/types";

export function installResolverPatch() {
    const patcher = createPatcher("ResolverPatch");
    const modules = [];

    const PATCHED_SYMBOL = Symbol.for("readit_patched");

    patcher.after(
        window.ShredditModuleLoader.prototype,
        "addModulePromise",
        (self, [id]) => {
            const module = self.moduleRegistry[id as string];
            if (!module || module[PATCHED_SYMBOL]) return;

            const originalResolver = module.resolver;

            module.resolver = () => {
                originalResolver?.();

                async function register(exports: Promise<any>) {
                    const meta: InternalModule = {
                        id: id as string,
                        exports: (await exports) ?? {},
                        deps: module.deps ?? [],
                        factory: module.factory,
                        isAsync:
                            module.factory?.constructor?.name ===
                            "AsyncFunction",
                        flags: {
                            declared: !!module.isDeclared,
                            evaluated: !!module.isEvaluated,
                            resolved: !!module.isResolved,
                            loading: !!module.isLoading,
                        },
                    };

                    registry.registerModule(meta);
                }

                queueMicrotask(() => {
                    const exports = module.moduleExports;

                    if (exports !== undefined) {
                        register(exports);
                        return;
                    }

                    let _exports: any;

                    Object.defineProperty(module, "moduleExports", {
                        configurable: true,
                        enumerable: true,
                        get() {
                            return _exports;
                        },
                        set(v) {
                            _exports = v;

                            Object.defineProperty(module, "moduleExports", {
                                value: v,
                                writable: true,
                                configurable: true,
                                enumerable: true,
                            });

                            register(v);
                        },
                    });
                });

                module[PATCHED_SYMBOL] = true;
            };
        },
    );

    patcher.after(
        window.ShredditModuleLoader.prototype,
        "_evaluateModule",
        (self, args, ret) => {
            modules.push(args[0]);
        },
    );

    expose(modules, "readit.loaded");
}
