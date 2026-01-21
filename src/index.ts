import { expose } from "@api/expose";
import { initLazyPatches } from "@api/patches/customElements";
import "@modules/common/matrix";
import { initModules } from "@modules/init";
import { matrixReady } from "@modules/common/matrix";
import {
    registerPluginDefinitions,
    startPluginsFromLifeCycle,
} from "@api/plugins/manager";
import { PluginLifeCycle } from "@api/plugins";

expose(__READIT_VERSION__, "readit.version");
initModules();
registerPluginDefinitions();
startPluginsFromLifeCycle(PluginLifeCycle.OnInit);
initLazyPatches();

async function init() {
    await matrixReady;
    startPluginsFromLifeCycle(PluginLifeCycle.ModulesReady);

    document.addEventListener("DOMContentLoaded", () => {
        console.log(Object.entries((window as any).SML?.moduleRegistry).length);
    });
}

init();
