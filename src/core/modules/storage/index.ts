import { NativeStorage } from "./platform/native/NativeStorage";
import { WebStorage } from "./platform/web/WebStorage";
import { Storage as StorageType } from "./common";
import { ReadIt } from "@modules/readit";
import { isNative } from "@lib/native";

export function createStorage(readit: ReadIt): StorageType {
    return isNative() ? new NativeStorage(readit) : new WebStorage(readit);
}
