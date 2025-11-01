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

export declare function definePlugin(config: ReadItPlugin): ReadItPlugin;

export type SettingsAPI = {
    registerSettingsTile: (tile: TileProps) => () => void;
    registerSettingsPage: (page: SettingsPage) => () => void;
    registerNavigationTile: (tile: NavigationTileProps) => () => void;
};

export type PostsAPI = {
    registerLoadCallback: (cb: (posts: Element[]) => void) => () => void;
};

export type LoggingAPI = {
    info(message: string): void;
    error(message: string): void;
    warn(message: string): void;
};

export type StorageAPI = {
    get<T = unknown>(key: string, defaultValue?: T): Promise<T>;
    set<T = unknown>(key: string, value: T): Promise<void>;
    delete(key: string): Promise<void>;
    keys(): Promise<string[]>;
};

export type CssAPI = {
    addRule(rule: string): void;
    clearRules(): void;
};

export type PatcherAPI = {
    before: <P extends Record<PropertyKey, any>, N extends keyof P>(
        funcParent: P,
        funcName: N,
        callback: (
            args: P[N] extends infer T
                ? T extends P[N]
                    ? T extends (...args: infer P_1) => any
                        ? unknown[] extends P_1
                            ? any
                            : P_1
                        : never
                    : never
                : never,
        ) =>
            | void
            | (P[N] extends infer T_1
                  ? T_1 extends P[N]
                      ? T_1 extends (...args: infer P_1) => any
                          ? unknown[] extends P_1
                              ? any
                              : P_1
                          : never
                      : never
                  : never)
            | undefined,
        oneTime?: boolean,
    ) => () => boolean;
    after: <P extends Record<PropertyKey, any>, N extends keyof P>(
        funcParent: P,
        funcName: N,
        callback: (
            args: P[N] extends infer T
                ? T extends P[N]
                    ? T extends (...args: infer P_1) => any
                        ? unknown[] extends P_1
                            ? any
                            : P_1
                        : never
                    : never
                : never,
            ret: ReturnType<P[N]>,
        ) => void | ReturnType<P[N]> | undefined,
        oneTime?: boolean,
    ) => () => boolean;
    instead: <P extends Record<PropertyKey, any>, N extends keyof P>(
        funcParent: P,
        funcName: N,
        callback: (
            args: P[N] extends infer T
                ? T extends P[N]
                    ? T extends (...args: infer P_1) => any
                        ? unknown[] extends P_1
                            ? any
                            : P_1
                        : never
                    : never
                : never,
            origFunc: NonNullable<P[N]>,
        ) => ReturnType<P[N]>,
        oneTime?: boolean,
    ) => () => boolean;
    unpatchAll: () => boolean;
};

export type PluginContext = {
    settings: SettingsAPI;
    posts: PostsAPI;
    storage: StorageAPI;
    storageSync: StorageSyncAPI;
    store: StoreAPI;
    logging: LoggingAPI;
    customcss: CssAPI;
    patcher: PatcherAPI;
    cleanup: (fn: () => void) => void;
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

type StorageSyncAPI = {
    get<T>(key: string, defaultValue?: T): T;
    set<T>(key: string, value: T): void;
    delete(key: string): void;
    keys(): string[];
};

type StoreAPI = {
    get: <T>(id: string) => T;
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
    interface Window {
        ReadItNative?: ReadItNative;
    }
}
