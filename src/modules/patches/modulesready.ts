import { createPatcher } from "@api/patcher";
import { deferredPromise } from "@api/utils/promise";
import type { SML } from "@modules/types";

export const { promise: modulesReady, resolve: fireModulesReady } = deferredPromise();

export function installModulesReadyPatch(ModuleLoaderClass: typeof SML.ModuleLoader) {
    const patcher = createPatcher("DMPatch");
    let timer: number;
    let fired = false;

    /*
        `_evaluateModule` is the method which can
        be called to evaluate a module if it's hasn't
        been already and get it's exports. Here, if it
        hasn't been called for some time, we decide 
        modules are ready.
    */
    patcher.after(
        ModuleLoaderClass.prototype,
        "_evaluateModule",
        async (_self, _args, resultPromise) => {
            clearTimeout(timer);

            timer = setTimeout(() => {
                if (!fired) {
                    fireModulesReady();
                    fired = true;
                }
            }, 750);

            return await resultPromise;
        },
    );
}
