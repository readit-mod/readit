import { createPatcher } from "@api/patcher";
import { registry } from "@modules/loader/_internals/registry";
import { InternalModule, SML } from "@modules/types";

export function installResolverPatch(
    ModuleLoaderClass: typeof SML.ModuleLoader,
) {
    const patcher = createPatcher("ResolverPatch");

    const PATCHED_SYMBOL = Symbol.for("readit_patched");

    patcher.after(
        ModuleLoaderClass.prototype,
        "addModulePromise",
        (self, [id]) => {
            const module = self.moduleRegistry[id];
            if (!module || module[PATCHED_SYMBOL]) return;

            patcher.after(module, "resolver", (module) => {
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
            });
        },
    );
}
