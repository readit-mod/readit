import { expose } from "@api/expose";
import { createPatcher } from "@api/patcher";
import { normaliseMatch } from "@api/regexp";
import { isArrayEqual } from "@api/utils/array";
import { functionFromString } from "@api/utils/function";
import type { FactoryPatcher, SML } from "@modules/types";

type DirectPatch = FactoryPatcher.Patch & {
    globals?: {
        [key: string]: any;
    };
};

const Patches: FactoryPatcher.Patch[] = [];

export const stores = {};

expose((name, store) => (stores[name] = store), "readit.api.stores.add");
expose(stores, "readit.api.stores.obj");

export function addDirectPatch(name: string, patch: DirectPatch) {
    if (patch.globals) {
        window.__readit_patch_globals__ ??= {};

        Object.assign(window.__readit_patch_globals__, {
            [name]: patch.globals,
        });
    }

    addPatch(patch, `__readit_patch_globals__.${name}`);
}

export function addPatch(patch: FactoryPatcher.Patch, helpersPath: string) {
    for (const replacement of patch.replacement) {
        if (typeof replacement.replace === "string") {
            const replace = replacement.replace;

            replacement.replace = replace.replaceAll("$self", `${helpersPath}`);
        }
    }

    Patches.push(patch);
}

declare global {
    interface Window {
        __readit_patch_globals__: Record<string, any>;
    }
}

export function installFactoryPatches(ModuleLoaderClass: typeof SML.ModuleLoader) {
    const patcher = createPatcher("ModulePatcher");

    const SYM_PATCHED_FACTORY = Symbol.for("readit_patched_factory");

    patcher.instead(
        ModuleLoaderClass.prototype,
        "_evaluateModule",
        async (self, [id, skipResolve], _evaluateModule) => {
            const module = self.moduleRegistry[id];

            if (!module.factory || module[SYM_PATCHED_FACTORY])
                return _evaluateModule(id, skipResolve);
            module[SYM_PATCHED_FACTORY] = true;

            let factoryString = module.factory?.toString();

            const patches = Patches.flatMap((patch) => {
                if (factoryString.includes(patch.find)) {
                    return patch.replacement;
                } else {
                    return [];
                }
            });

            const hasPatches = !isArrayEqual(patches, []);
            if (!hasPatches) return _evaluateModule(id, skipResolve);

            console.log(patches, hasPatches);

            for (const patch of patches) {
                const find =
                    typeof patch.match === "string" ? patch.match : normaliseMatch(patch.match);

                factoryString = patch.matchAll
                    ? factoryString.replaceAll(find, patch.replace as any)
                    : factoryString.replace(find, patch.replace as any);
            }
            const newFactory = await functionFromString(factoryString);

            module.factory = newFactory;
            module[SYM_PATCHED_FACTORY] = true;
            return _evaluateModule(id, skipResolve);
        },
    );
}
