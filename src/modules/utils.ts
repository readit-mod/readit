import { expose } from "@api/expose";
import type { InternalModule, SML } from "./types";

export function mapMangledModule<M = any>(module: InternalModule, mappers: Record<string, Fn>): M {
    const exports = module.exports;

    const mapped: Record<string, any> = {};
    for (const [key, mapper] of Object.entries(mappers)) {
        for (const [, exp] of Object.entries(exports)) {
            mapper(exp) && (mapped[key] = exp);
        }
    }

    return mapped as M;
}

export function getModuleFactory(id: SML.ModuleID, includePatches: boolean = true) {
    const module = window.SML.moduleRegistry[id];

    const SYM_PATCHED_FACTORY = Symbol.for("readit_patched_factory");
    const SYM_ORIGINAL_FACTORY = Symbol.for("readit_original_factory");

    const factory =
        includePatches || !module[SYM_PATCHED_FACTORY]
            ? module.factory
            : module[SYM_ORIGINAL_FACTORY];

    return factory;
}

expose(
    {
        getModuleFactory,
    },
    "readit.modules.utils",
);
