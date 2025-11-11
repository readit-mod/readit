import { ReadIt } from "@modules/readit";
import { InternalPostMeta, PostMeta } from "@lib/types";

export class Posts {
    selector = "shreddit-post, shreddit-ad-post";
    postCallbacks: ((posts: PostMeta[]) => void)[] = [];
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
        callback: (posts: PostMeta[]) => void,
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
            this._emitPosts(
                Array.from(existing) as (Element & InternalPostMeta)[],
            );
        }
    }

    _scheduleEmit(): void {
        if (this._rafScheduled) {
            return;
        }
        this._rafScheduled = true;
        window.requestAnimationFrame(() => {
            if (this._queuedPosts.size > 0) {
                this._emitPosts(
                    Array.from(this._queuedPosts) as (Element &
                        InternalPostMeta)[],
                );
                this._queuedPosts.clear();
            }
            this._rafScheduled = false;
        });
    }

    _emitPosts(posts: (Element & InternalPostMeta)[]): void {
        let typedPosts: PostMeta[] = [];

        for (const post of posts) {
            typedPosts.push({
                id: post.__id,
                title: post.__postTitle,
                subreddit: post.__subredditName,
                url: post.__contentHref,
                score: post.__score,
                upvoted: post.__postVoteType == "upvote",
                downvoted: post.__postVoteType == "downvote",
                createdAt: post.__createdTimestamp,
                nsfw: post.__nsfw,
                spoiler: post.__spoiler,
                promoted: post.__promoted,
                commentCount: post.__commentCount,
                postType: post.__postType,
                element: post,
            });
        }

        this.postCallbacks.forEach((cb) => cb(typedPosts));
    }
}
