import { DownloadOptions } from "@lib/types";

export async function downloadUrl(options: DownloadOptions) {
    GM_download({
        url: options.url,
        name: options.name ?? "",
        saveAs: true,
    });
}
