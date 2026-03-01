import { expose } from "@api/expose";
import { registry } from "./loader/_internals/registry";
import { cache, find } from "./loader/lookup";
import { installDMPatch } from "./patches/dm";
import { installFactoryPatches } from "./patches/factory";
import { installResolverPatch } from "./patches/resolver";

export function initModules(ModuleLoaderClass) {
    installResolverPatch(ModuleLoaderClass);
    installDMPatch(ModuleLoaderClass);
    installFactoryPatches(ModuleLoaderClass);

    expose(registry, "readit.modules._internals.registry");
    expose(
        {
            find,
            cache,
        },
        "readit.modules.lookup.manager",
    );
}
