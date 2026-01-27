import { createPatcher } from "@api/patcher";
import { deferredPromise } from "@api/utils/promise";

export const { promise: modulesReady, resolve: fireModulesReady } =
    deferredPromise();

export function installDMPatch(ModuleLoaderClass) {
    const patcher = createPatcher("DMPatch");
    let timer: any;
    let fired = false;

    /*
        `dm` is the method which registers a module,
        here we debounce it's call, once enough time
        has passed without a new module definition, 
        we decide the modules are ready.
    */
    patcher.after(ModuleLoaderClass.prototype, "dm", () => {
        clearTimeout(timer);

        timer = setTimeout(() => {
            if (!fired) {
                fireModulesReady();
                fired = false;
            }
        }, 750);
    });
}
