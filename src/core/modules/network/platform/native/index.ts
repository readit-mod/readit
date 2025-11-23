import { Network } from "@modules/network/common";
import { ReadIt } from "@modules/readit";

export class NativeNetwork extends Network {
    constructor(readit: ReadIt) {
        super(readit);
    }

    fetch = fetch; // CSP is disabled by electron on native.

    downloadUrl = window.ReadItNative.network.downloadUrl;
}