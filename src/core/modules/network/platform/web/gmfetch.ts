function parseHeaders(raw: string | undefined): Headers {
    const headers = new Headers();
    if (!raw) return headers;

    for (const line of raw.trim().split("\n")) {
        const index = line.indexOf(":");
        if (index === -1) continue;
        const key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim();
        headers.append(key, value);
    }
    return headers;
}

async function makeResponse(
    blob: Blob,
    status: number,
    statusText: string,
    headersRaw: string,
    url: string
): Promise<Response> {
    const arrayBuffer = await blob.arrayBuffer();
    const headers = parseHeaders(headersRaw);

    return new Response(arrayBuffer, {
        status,
        statusText,
        headers,
    });
}

export function GM_fetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
    return new Promise((resolve, reject) => {
        const url = input.toString();

        const opts: any = {
            method: init.method ?? "GET",
            url,
            headers: init.headers as any,
            data: init.body,
            responseType: "blob",
            binary: true,
        };

        opts.onload = async (resp: any) => {
            try {
                const blob: Blob = resp.response;

                const response = await makeResponse(
                    blob,
                    resp.status,
                    resp.statusText || "",
                    resp.responseHeaders,
                    url
                );

                resolve(response);
            } catch (err) {
                reject(err);
            }
        };

        opts.onerror = () => reject(new TypeError("GM_fetch: Network error"));
        opts.ontimeout = () => reject(new TypeError("GM_fetch: Timeout"));
        opts.onabort = () => reject(new DOMException("GM_fetch: Aborted", "AbortError"));

        GM_xmlhttpRequest(opts);
    });
}
