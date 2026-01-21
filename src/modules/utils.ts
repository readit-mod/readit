import { InternalModule } from "./types";

export function mapMangledModule<M = any>(
    module: InternalModule,
    mappers: Record<string, Fn>,
): M {
    const exports = module.exports;

    const mapped: Record<string, any> = {};
    for (const [key, mapper] of Object.entries(mappers)) {
        for (const [, exp] of Object.entries(exports)) {
            mapper(exp) && (mapped[key] = exp);
        }
    }

    return mapped as M;
}
