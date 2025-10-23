import { PluginContext } from "@/core/modules/plugins/api/types";
import { ReadIt } from "@/core/modules/readit";
import { FunctionalComponent, h } from "preact";

export type ReadItPlugin = {
    name: string;
    description: string;
    id: string;
    version?: string;

    enabled?: boolean;
    _ctx?: PluginContext;

    onLoad: (ctx: PluginContext) => Promise<void>;
    onUnload?: (ctx: PluginContext) => Promise<void>;
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
          pageComponent?: FunctionalComponent;
      };

type ReadItNative = {
    meta: ReadItMeta;
    storage: StorageNative;
    network: NetworkNative;
    logging: LogNative;
    bundle: BundleNative;
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
