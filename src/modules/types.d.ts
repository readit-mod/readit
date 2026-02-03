export type InternalModule<T = any> = {
    id: string;
    exports?: T;
    deps: string[];
    factory?: Function;
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
        abstract dm(id: ModuleID, deps: ModuleID[], factory: Function): void;
        abstract addModulePromise(id: ModuleID): void;
        abstract moduleRegistry: Record<ModuleID, Module>;
    }
}
