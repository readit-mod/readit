import { PluginContext } from "@/core/modules/plugins/api/types";
import { ReadIt } from "@/core/modules/readit";
import { FunctionalComponent, h } from "preact";

export type ReadItPlugin = {
    name: string;
    description: string;
    id: string;
    version?: string;

    settings?: PluginSetting[];

    onLoad: (ctx: PluginContext) => Promise<void>;
    onUnload?: (ctx: PluginContext) => Promise<void>;

    enabled?: boolean;
    _ctx?: PluginContext;
};

export type PluginSetting =
    | {
          id: string;
          title: string;
          description: string;
          type: "input";
          default: string;
          value?: string;
      }
    | {
          id: string;
          title: string;
          description: string;
          type: "toggle";
          default: boolean;
          value?: boolean;
      };

export type TileProps = {
    title: string;
    description: string;
    icon?: string;
    onClick?: () => void;
};

export type NavigationTileProps = TileProps & {
    id: string;
};

export const definePlugin: (config: ReadItPlugin) => ReadItPlugin;

export type SettingsPage =
    | {
          id: string;
          title: string;
          items?: TileProps[];
          pageComponent?: never;
      }
    | {
          id: string;
          title: string;
          items?: never;
          pageComponent?: any;
      };

type ReadItNative = {
    meta: ReadItMeta;
    storage: StorageNative;
    network: NetworkNative;
    logging: LogNative;
    bundle: BundleNative;
    polyfills: Polyfill[];
};

type Polyfill = {
    object: string;
    replacements: Record<string, any>;
};

type StorageNative = {
    getValue: <T = unknown>(key: string, def?: T) => Promise<T>;
    setValue: <T = unknown>(key: string, value: T) => Promise<boolean>;
    getAll: () => Promise<Record<string, any>>;
};

type NetworkNative = {
    xmlHttpRequest: (options: RequestOptions) => Promise<RequestReturn | null>;
};

type BundleNative = {
    setBundleURL: (url: string) => Promise<boolean>;
    getBundleURL: () => Promise<string>;
    resetBundleURL: () => Promise<boolean>;
};

type LogNative = {
    log: (log: string) => Promise<void>;
};

type RequestOptions = {
    url: string;
    method?: string;
    headers?: HeadersInit;
    body?: BodyInit;
    onload?: (res: RequestReturn) => void;
    onerror?: (res: any) => void;
};

type RequestReturn = {
    responseText?: string;
    status?: number;
    headers?: {
        [k: string]: string;
    };
};

type ReadItMeta = {
    loaderVersion: string;
    platform: string;
};

type NamespacedStorage = {
    get<T>(key: string, def: T): T;
    set<T>(key: string, val: T): void;
    delete(key: string): void;
    keys(): string[];
    clear(): void;
};

type NamespacedStorageAsync = {
    get<T>(key: string, def: T): Promise<T>;
    set<T>(key: string, val: T): Promise<void>;
    delete(key: string): Promise<void>;
    keys(): Promise<string[]>;
    clear(): Promise<void>;
};

type PostMeta = {
    /** Post ID */
    id: string;
    /** Post Title */
    title: string;
    /** Post subreddit (without "r/") */
    subreddit: string;
    /** Post link */
    url: string;
    /** Total post score (upvotes - downvotes) */
    score: number;
    /** Has user upvoted this post */
    upvoted: boolean;
    /** Has user downvoted this post */
    downvoted: boolean;
    /** ISO timestamp of post creation */
    createdAt: string;
    /** Is post marked as NSFW */
    nsfw: boolean;
    /** Is post marked as a spoiler */
    spoiler: boolean;
    /** Is post promoted (i.e. is it an ad) */
    promoted: boolean;
    /** Number of comments on the post */
    commentCount: number;
    /** What type of post is it (e.g. image, video) */
    postType: string;
    /** Post's HTML element */
    element: Element & InternalPostMeta;
};

type InternalPostMeta = {
    // The meta provided in the element.
    __id?: string;
    __postTitle?: string;
    __subredditName?: string;
    __contentHref?: string;
    __score?: number;
    __postVoteType?: string | undefined;
    __createdTimestamp?: string;
    __nsfw?: boolean;
    __spoiler?: boolean;
    __promoted?: boolean;
    __commentCount?: number;
    __postType?: string;
};

declare global {
    const __READIT_VERSION__: string;
    interface Window {
        readit: ReadIt;
        ReadItNative?: ReadItNative; // Should be injected by electron's preload.
    }
    namespace preact {
        namespace JSX {
            interface IntrinsicElements {
                "faceplate-tracker": any;
                "rpl-tooltip": any;
                "faceplate-screen-reader-content": any;
            }
        }
    }
}
