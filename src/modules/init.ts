import { expose } from "@api/expose";
import { registry } from "./loader/_internals/registry";
import { installResolverPatch } from "./patches/resolver";
import { cache, find } from "./loader/lookup";
import { installDMPatch } from "./patches/dm";

export function initModules(ModuleLoaderClass) {
    installResolverPatch(ModuleLoaderClass);
    installDMPatch(ModuleLoaderClass);

    expose(registry, "readit.modules._internals.registry");
    expose({ find, cache }, "readit.modules.lookup.manager");
}
