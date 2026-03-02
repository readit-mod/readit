import { logger } from "@api/logger";
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

export function addDirectPatch(name: string, patch: DirectPatch) {
    if (patch.globals) {
        window.__readit_patch_globals__ ??= {};

        Object.assign(window.__readit_patch_globals__, {
            [name]: patch.globals,
        });
    }

    addPatch(patch, `__readit_patch_globals__.${name}`, (source, id) =>
        logger.warn(`Patch ${source} at ${name} had no effect. Module ID: ${id}.`),
    );
}

function warnNoChange(source: string, moduleId: SML.ModuleID) {
    logger.warn(`Unnamed patch ${source} had no effect. Module ID: ${moduleId}.`);
}

export function addPatch(
    patch: FactoryPatcher.Patch,
    helpersPath: string,
    noChangeWarner = warnNoChange,
) {
    for (const replacement of patch.replacement) {
        if (typeof replacement.replace === "string") {
            const replace = replacement.replace;

            replacement.replace = replace.replaceAll("$self", `${helpersPath}`);
        }

        replacement.noChangeWarner = noChangeWarner;
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
            const finalResult = () => _evaluateModule(id, skipResolve);
            const module = self.moduleRegistry[id];

            if (!module.factory || module[SYM_PATCHED_FACTORY]) return finalResult();
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
            if (!hasPatches) return finalResult();

            for (const patch of patches) {
                let newFactory = factoryString;
                const find =
                    typeof patch.match === "string" ? patch.match : normaliseMatch(patch.match);

                const source = typeof find === "string" ? find : (patch.match as RegExp).source;

                newFactory = patch.matchAll
                    ? newFactory.replaceAll(find, patch.replace as any)
                    : newFactory.replace(find, patch.replace as any);

                if (newFactory === factoryString) {
                    patch.noChangeWarner(source, id);
                }

                factoryString = newFactory;
            }
            const newFactory = await functionFromString(factoryString);

            module.factory = newFactory;
            module[SYM_PATCHED_FACTORY] = true;
            return finalResult();
        },
    );
}
