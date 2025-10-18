import { ReadIt } from "@/core/modules/readit";

export class Posts {
    selector = "shreddit-post, shreddit-ad-post";
    postCallbacks: ((posts: Element[]) => void)[] = [];
    _queuedPosts = new Set<Element>();
    _rafScheduled = false;

    constructor(private readit: ReadIt) {
        // MutationObserver for dynamically added posts/ads
        const observer = new MutationObserver((mutations: MutationRecord[]) => {
            for (const m of mutations) {
                for (const node of Array.from(m.addedNodes)) {
                    if (node.nodeType === 1 && node instanceof HTMLElement) {
                        // Node itself matches
                        if (node.matches(this.selector)) {
                            this._queuedPosts.add(node);
                        }
                        // Or its descendants match
                        const matchingDescendants = node.querySelectorAll(
                            this.selector,
                        );
                        matchingDescendants.forEach((p) =>
                            this._queuedPosts.add(p),
                        );
                    }
                }
            }
            this._scheduleEmit();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    registerOnPostsLoaded = (
        callback: (posts: Element[]) => void,
    ): (() => void) => {
        this.postCallbacks.push(callback);
        // each plugin scans the current post list as its loaded
        this._callbackInitialScan();
        return () => {
            const idx = this.postCallbacks.indexOf(callback);
            if (idx !== -1) {
                this.postCallbacks.splice(idx, 1);
            }
        };
    };

    _callbackInitialScan(): void {
        const existing = document.querySelectorAll(this.selector);
        if (existing.length > 0) {
            this._emitPosts(Array.from(existing));
        }
    }

    _scheduleEmit(): void {
        if (this._rafScheduled) {
            return;
        }
        this._rafScheduled = true;
        window.requestAnimationFrame(() => {
            if (this._queuedPosts.size > 0) {
                this._emitPosts(Array.from(this._queuedPosts));
                this._queuedPosts.clear();
            }
            this._rafScheduled = false;
        });
    }

    _emitPosts(posts: Element[]): void {
        this.postCallbacks.forEach((cb) => cb(posts));
    }
}
