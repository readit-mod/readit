import { FunctionalComponent } from "preact";
import * as strawberry from "@marshift/strawberry";
import { NavigationTileProps, SettingsPage, TileProps } from "@/lib/types";

export type SettingsAPI = {
    registerSettingsTile: (tile: TileProps) => () => void;
    registerSettingsPage: (page: SettingsPage) => () => void;
    registerNavigationTile: (tile: NavigationTileProps) => () => void;
    goTo: (page: string) => void;
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
    get<T>(key: string, defaultValue?: T): Promise<T>;
    set<T>(key: string, value: T): Promise<void>;
    delete(key: string): Promise<void>;
    keys(): Promise<string[]>;
};

export type StorageSyncAPI = {
    get<T>(key: string, defaultValue?: T): T;
    set<T>(key: string, value: T): void;
    delete(key: string): void;
    keys(): string[];
};

export type CssAPI = {
    addRule(rule: string): void;
    clearRules(): void;
};

export type DomAPI = {
    render(component: FunctionalComponent, element: HTMLElement): void;
};

export type StoreAPI = {
    get: <T>(id: string) => T;
};

export type PatcherAPI = strawberry.Patcher;

export type PluginContext = {
    settings: SettingsAPI;
    posts: PostsAPI;
    storage: StorageAPI;
    storageSync: StorageSyncAPI;
    store: StoreAPI;
    logging: LoggingAPI;
    customcss: CssAPI;
    dom: DomAPI;
    patcher: PatcherAPI;
    cleanup: (fn: () => void) => void;
    _internalCleanup: () => void;
};
