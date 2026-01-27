import { FilterFn, InternalModule } from "@modules/types";

class InternalModuleRegistry {
    _moduleMap = new Map<string, InternalModule>();
    _moduleWaitersMap = new Map<FilterFn, Fn>();

    registerModule(module: InternalModule) {
        if (!this._moduleMap.has(module.id)) {
            this._moduleMap.set(module.id, module);
            for (const [filter, callback] of Array.from(
                this._moduleWaitersMap,
            )) {
                if (filter(module)) {
                    callback(module);
                    this._moduleWaitersMap.delete(filter);
                }
            }
        }
    }

    getModules() {
        return Object.fromEntries(Array.from(this._moduleMap));
    }

    getModuleById(id: string) {
        return this._moduleMap.has(id) ? this._moduleMap.get(id) : null;
    }

    addWaiter(filter: FilterFn, cb: (module: InternalModule) => void) {
        this._moduleWaitersMap.set(filter, cb);
    }

    require(id: string): any {
        return this.getModuleById(id)?.exports ?? {};
    }
}

export const registry = new InternalModuleRegistry();
