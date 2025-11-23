import { isNative } from "@lib/native";
import { ReadIt } from "@modules/readit";
import { NativeNetwork } from "./platform/native";
import { WebNetwork } from "./platform/web";
import { Network } from "./common";

export function createNetwork(readit: ReadIt): Network {
    return isNative() ? new NativeNetwork(readit) : new WebNetwork(readit);
}
