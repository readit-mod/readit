import { Network } from "@modules/network/common";
import { ReadIt } from "@modules/readit";
import { GM_fetch } from "./gmfetch";
import { downloadUrl } from "./downloadurl";

export class WebNetwork extends Network {
    constructor(readit: ReadIt) {
        super(readit);
    }

    fetch = GM_fetch;

    downloadUrl = downloadUrl;
}
