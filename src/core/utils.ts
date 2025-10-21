import { isNative, withNative } from "@/lib/native";

export async function importProxied(url: string) {
    const jsContents: string =
        (await withNative(async () => {
            return await new Promise((resolve, reject) => {
                window.ReadItNative.network.xmlHttpRequest({
                    method: "GET",
                    url,
                    onload: (res) => resolve(res.responseText),
                    onerror: (err) => reject(err),
                });
            });
        })) ??
        (await new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url,
                onload: (res) => resolve(res.responseText),
                onerror: (err) => reject(err),
            });
        }));

    const blob = new Blob(
        [`${isNative() ? "" : "const window = unsafeWindow;"}${jsContents}`],
        {
            type: "text/javascript",
        },
    );
    const blobUrl = URL.createObjectURL(blob);

    try {
        const module = await import(blobUrl);
        return module;
    } finally {
        URL.revokeObjectURL(blobUrl);
    }
}
