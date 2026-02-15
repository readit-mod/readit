declare const __READIT_VERSION__: string;
declare type Fn<T = any> = (...args: any) => T;
declare type AnyClass = new (...args: any[]) => any;

declare type LitElementCtor = CustomElementConstructor &
    typeof import("lit").LitElement;

declare type PropOf<M> = {
    [K in keyof M]: M[K] extends Fn ? Extract<K, string> : never;
}[keyof M];

declare type Constructor<T extends any = any> = new () => T;

declare type CodeFilter = string | RegExp;

interface Window {
    ShredditModuleLoader: import("@modules/types").SML.ModuleLoader;
}
