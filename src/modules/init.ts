import { expose } from "@api/expose";
import { registry } from "./loader/_internals/registry";
import { installResolverPatch } from "./patches/resolver";
import { cache, find } from "./loader/lookup";

export function initModules() {
    installResolverPatch();

    // for (const [id, module] of Object.entries(window.SML.moduleRegistry) as [
    //     string,
    //     any,
    // ]) {
    //     const meta: InternalModule = {
    //         id: id as string,
    //         exports: module.moduleExports,
    //         deps: module.deps ?? [],
    //         isAsync: module.factory?.constructor?.name === "AsyncFunction",
    //         flags: {
    //             declared: !!module.isDeclared,
    //             evaluated: !!module.isEvaluated,
    //             resolved: !!module.isResolved,
    //             loading: !!module.isLoading,
    //         },
    //     };

    //     registry.registerModule(meta);
    // }

    expose(registry, "readit.modules._internals.registry");
    expose({ find, cache }, "readit.modules.lookup.manager");
}
