import type { Store } from ".";

export type Listener<T> = (value: any, path: string, root: T) => void;

export type StoreMethod<T, A = any, R = any> = (store: T, plain: T, args: A) => R;

export type StoreMethods<T> = Record<string, StoreMethod<T, any, any>>;

export type StoreInstance<T, Methods extends StoreMethods<T>> = Store<T, Methods> & {
    [Key in keyof Methods]: Methods[Key] extends (
        s: T,
        p: T,
        a: infer Args extends any[],
    ) => infer Return
        ? (...args: Args) => Return
        : never;
};
