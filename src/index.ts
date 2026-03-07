import { expose } from "@api/expose";
import { initLazyPatches } from "@api/patches/customElements";
import { PluginLifeCycle } from "@api/plugins";
import { registerPluginDefinitions, startPluginsFromLifeCycle } from "@api/plugins/manager";
import { hookDefineProperty } from "@api/wait";
import { initCommonModules } from "@modules/common/init";
import { initModules } from "@modules/init";
import { modulesReady } from "@modules/patches/dm";

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
