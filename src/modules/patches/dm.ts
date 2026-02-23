import { createPatcher } from "@api/patcher";
import { deferredPromise } from "@api/utils/promise";
import type { SML } from "@modules/types";

export const { promise: modulesReady, resolve: fireModulesReady } = deferredPromise();

export function installDMPatch(ModuleLoaderClass: typeof SML.ModuleLoader) {
    const patcher = createPatcher("DMPatch");
    let timer: number;
    let fired = false;

    /*
        `dm` is the method which registers a module,
        here, once enough time has passed without a
        new module definition, we decide the modules
        are ready.
    */
    patcher.after(ModuleLoaderClass.prototype, "dm", () => {
        clearTimeout(timer);

        timer = setTimeout(() => {
            if (!fired) {
                fireModulesReady();
                fired = true;
            }
        }, 750);
    });
}
