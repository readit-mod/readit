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
