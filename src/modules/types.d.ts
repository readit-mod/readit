export type InternalModule<T = any> = {
    id: string;
    exports?: T;
    deps: string[];
    factory?: Fn;
    isAsync: boolean;
    flags: {
        declared: boolean;
        evaluated: boolean;
        resolved: boolean;
        loading: boolean;
    };
};

export type FilterFn = (module: InternalModule) => boolean;

declare namespace SML {
    type ModuleID = string;

    interface Module {
        id: ModuleID;
        deps: ModuleID[];
        factory: Fn;
        resolver: Fn;
        isDeclared?: boolean;
        isEvaluated?: boolean;
        isResolved?: boolean;
        isLoading?: boolean;
        moduleExports?: any;
    }

    abstract class ModuleLoader {
        abstract dm(id: ModuleID, deps: ModuleID[], factory: Fn): void;
        abstract _evaluateModule(
            id: ModuleID,
            skipResolve: boolean,
        ): Promise<void>;
        abstract addModulePromise(id: ModuleID): void;
        abstract moduleRegistry: Record<ModuleID, Module>;
    }
}

declare namespace FactoryPatcher {
    type Replacer = string | ((substring: string, ...args: any[]) => string);

    type Patch = {
        find: string | RegExp;
        replacement: InternalPatchReplacement[];
    };

    type InternalPatchReplacement = PatchReplacement & {
        noChangeWarner?: (source: string, moduleId: SML.ModuleID) => void;
    };

    type PatchReplacement = {
        match: string | RegExp;
        matchAll?: boolean;
        replace: Replacer;
    };
}
