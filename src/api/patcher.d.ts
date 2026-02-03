import { PatchType } from "./patcher";

export type BeforeCallback<
    Parent extends Record<string, Fn>,
    F extends keyof Parent,
> = (
    context?: Parent,
    args?: Parameters<Parent[F]>,
    original?: Parent[F],
    unpatch?: () => void,
) => Parameters<Parent[F]> | void;
export type InsteadCallback<
    Parent extends Record<string, Fn>,
    F extends keyof Parent,
> = (
    context?: Parent,
    args?: Parameters<Parent[F]>,
    original?: Parent[F],
    unpatch?: () => void,
) => ReturnType<Parent[F]> | void;
export type AfterCallback<
    Parent extends Record<string, Fn>,
    F extends keyof Parent,
> = (
    context?: Parent,
    args?: Parameters<Parent[F]>,
    result?: ReturnType<Parent[F]>,
    unpatch?: () => void,
) => ReturnType<Parent[F]> | void;

export interface PatchOverwrite {
    mdl: Record<string, any> | Function;
    func: string;
    original: Function;
    unpatch: () => void;
    patches: {
        before: Patch[];
        after: Patch[];
        instead: Patch[];
    };
}

export interface Patch {
    caller: string;
    once: boolean;
    type: PatchType;
    id: number;
    callback: any;
    unpatch: () => void;
}
