import { ReadIt } from "@modules/readit";

export class Posts {
    selector = "shreddit-post, shreddit-ad-post";
    postCallbacks: ((posts: PostMeta[]) => void)[] = [];
    _queuedPosts = new Set<Element>();
    _processedPosts = new WeakSet<Element>();
    _rafScheduled = false;

    constructor(private readit: ReadIt) {
        const observer = new MutationObserver((mutations: MutationRecord[]) => {
            for (const m of mutations) {
                for (const node of Array.from(m.addedNodes)) {
                    if (node.nodeType === 1 && node instanceof HTMLElement) {
                        if (node.matches(this.selector)) {
                            this._queuedPosts.add(node);
                        }
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
        this._callbackInitialScan(callback);
        return () => {
            const idx = this.postCallbacks.indexOf(callback);
            if (idx !== -1) this.postCallbacks.splice(idx, 1);
        };
    };

    async _callbackInitialScan(callback: (posts: PostMeta[]) => void) {
        const existing = document.querySelectorAll(this.selector);
        if (existing.length === 0) return;

        await Promise.all(
            Array.from(existing).map((el) =>
                customElements.whenDefined(el.tagName.toLowerCase()),
            ),
        );

        const posts = Array.from(existing) as (Element & InternalPostMeta)[];
        const typed = this._toTypedPosts(posts);
        callback(typed);
    }

    _scheduleEmit(): void {
        if (this._rafScheduled) return;
        this._rafScheduled = true;

        window.requestAnimationFrame(() => {
            if (this._queuedPosts.size > 0) {
                const newPosts: (Element & InternalPostMeta)[] = [];
                for (const post of this._queuedPosts) {
                    if (!this._processedPosts.has(post)) {
                        this._processedPosts.add(post);
                        newPosts.push(post as Element & InternalPostMeta);
                    }
                }

                if (newPosts.length > 0) {
                    const typed = this._toTypedPosts(newPosts);
                    this.postCallbacks.forEach((cb) => cb(typed));
                }

                this._queuedPosts.clear();
            }
            this._rafScheduled = false;
        });
    }

    _toTypedPosts(posts: (Element & InternalPostMeta)[]): PostMeta[] {
        return posts.map((post) => ({
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
        }));
    }
}
