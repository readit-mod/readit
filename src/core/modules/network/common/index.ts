import { ReadIt } from "@modules/readit";

export abstract class Network {
    constructor(readit: ReadIt) {}

    fetch: typeof fetch;

    downloadUrl: (options: DownloadOptions) => Promise<void>;
}
