import { expose } from "@api/expose";
import { initLazyPatches } from "@api/patches/customElements";
import { initModules } from "@modules/init";
import {
    registerPluginDefinitions,
    startPluginsFromLifeCycle,
} from "@api/plugins/manager";
import { PluginLifeCycle } from "@api/plugins";
import { hookDefineProperty } from "@api/wait";
import { modulesReady } from "@modules/patches/dm";
import { initCommonModules } from "@modules/common/init";

expose(__READIT_VERSION__, "readit.version");

hookDefineProperty(window, "ShredditModuleLoader", (ModuleLoaderClass) => {
    initModules(ModuleLoaderClass);
    registerPluginDefinitions();
    startPluginsFromLifeCycle(PluginLifeCycle.OnInit);
    initLazyPatches();
    initCommonModules();
    init();

    return ModuleLoaderClass;
});

async function init() {
    await modulesReady;
    startPluginsFromLifeCycle(PluginLifeCycle.ModulesReady);
}
