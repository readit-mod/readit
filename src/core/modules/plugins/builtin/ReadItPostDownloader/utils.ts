import { readit } from "@modules/readit";
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
    await readit.network.downloadUrl({
        url: post.postType == "image"
            ? post.url
            : `${post.url}/CMAF_480.mp4?source=fallback`,
        title: "Download Post",
        name: `${post.id}.${post.postType == "image" ? "jpg" : "mp4"}`
    });
}
