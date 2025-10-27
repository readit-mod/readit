import { NativeStorage } from "./platform/native/NativeStorage";
import { NativeStorageSync } from "./platform/native/NativeStorageSync";
import { WebStorage } from "./platform/web/WebStorage";
import { WebStorageSync } from "./platform/web/WebStorageSync";
import {
    Storage as StorageType,
    StorageSync as StorageSyncType,
} from "./common";
import { ReadIt } from "@/core/modules/readit";
import { withNative } from "@/lib/native";

export function createStorage(readit: ReadIt): StorageType {
    return (
        withNative(() => new NativeStorage(readit)) ?? new WebStorage(readit)
    );
}

export function createStorageSync(readit: ReadIt): StorageSyncType {
    return (
        withNative(() => new NativeStorageSync(readit)) ??
        new WebStorageSync(readit)
    );
}
