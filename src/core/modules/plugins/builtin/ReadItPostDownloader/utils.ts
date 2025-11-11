import { readit } from "@modules/readit";
import { isNative } from "@lib/native";
import { PostMeta } from "@lib/types";

export async function waitForShadowRoot(
    element: HTMLElement,
): Promise<ShadowRoot> {
    if (element.shadowRoot) return Promise.resolve(element.shadowRoot);

    return new Promise((resolve, _) => {
        const observer = new MutationObserver(() => {
            if (element.shadowRoot) {
                observer.disconnect();
                resolve(element.shadowRoot);
            }
        });
        observer.observe(element, {
            childList: true,
        });
    });
}

export async function downloadPost(post: PostMeta) {
    if (isNative()) {
        alert(
            "This currently isn't supported on native due to the xmlHttpRequest polyfill not being advanced enough.",
        );
        readit.logging.error(
            "This currently isn't supported on native due to the xmlHttpRequest polyfill not being advanced enough.",
        );
        return;
    }
    const mediaBlobUrl: string = await new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: "GET",
            url:
                post.postType == "image"
                    ? post.url
                    : `${post.url}/CMAF_480.mp4?source=fallback`,
            responseType: "blob",
            onload: (res) => {
                const blobUrl = URL.createObjectURL(res.response);
                resolve(blobUrl);
            },
            onerror: (err) => reject(err),
        });
    });

    const a = document.createElement("a");
    a.href = mediaBlobUrl;
    a.download = `${post.id}.${post.postType == "image" ? "jpg" : "mp4"}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
}
