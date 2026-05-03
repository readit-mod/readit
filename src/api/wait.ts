import { expose } from "@api/expose";
import type { LiteralUnion } from "type-fest";

type KeyOfOrAny<P, T extends object> = P extends keyof T ? T[P] : any;

export function hookDefineProperty<T extends object, P extends LiteralUnion<keyof T, PropertyKey>>(
    target: T,
    property: LiteralUnion<keyof T, PropertyKey>,
    cb: (val: KeyOfOrAny<P, T>) => KeyOfOrAny<P, T>,
) {
    const targetAsAny = target as any;

    if (property in target) {
        targetAsAny[property] = cb(targetAsAny[property]) ?? targetAsAny[property];
        return;
    }

    let value: unknown;

    Object.defineProperty(targetAsAny, property, {
        get: () => value,
        set(v) {
            value = cb(v) ?? v;
        },
        configurable: true,
        enumerable: false,
    });
}

expose(hookDefineProperty, "readit.api.hookDefineProperty");
