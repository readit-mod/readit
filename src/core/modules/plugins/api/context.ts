import { Settings } from "@/core/modules/settings";
import { Posts } from "@/core/modules/posts";
import { Storage, StorageSync } from "@/core/modules/storage/common";
import { Logging } from "@/core/modules/logging";
import { CustomCss } from "@/core/modules/customcss";

import { render, FunctionalComponent } from "preact";

import {
    SettingsAPI,
    PostsAPI,
    PluginContext,
    StorageAPI,
    LoggingAPI,
    CssAPI,
    DomAPI,
    StorageSyncAPI,
    StoreAPI,
} from "@/core/modules/plugins/api/types";
import { PluginSetting, ReadItPlugin } from "@/lib/types";
import { ReadIt } from "@/core/modules/readit";

export function createPostsAPI(internal: Posts): PostsAPI {
    return {
        registerLoadCallback: (cb) => internal.registerOnPostsLoaded(cb),
    };
}

export function createSettingsAPI(internal: Settings): SettingsAPI {
    return {
        registerSettingsTile: (tile) => internal.registerSettingsTile(tile),
        registerSettingsPage: (page) => internal.registerSettingsPage(page),
        registerNavigationTile: (tile) => internal.registerNavigationTile(tile),
        goTo: (page) => internal.goToPage(page),
    };
}

export function createLoggingAPI(
    internal: Logging,
    plugin: ReadItPlugin,
): LoggingAPI {
    return {
        info: (message: string) => internal.info(`[${plugin.name}] ${message}`),
        error: (message: string) =>
            internal.error(`[${plugin.name}] ${message}`),
        warn: (message: string) => internal.warn(`[${plugin.name}] ${message}`),
    };
}

export function createStorageAPI(internal: Storage, id: string): StorageAPI {
    return internal.withNamespace(`plugin:${id}`);
}

export function createStorageSyncAPI(
    internal: StorageSync,
    id: string,
): StorageSyncAPI {
    return internal.withNamespace(`plugin:${id}`);
}

export function createStoreAPI(
    internal: StorageSync,
    settings: PluginSetting[],
    id: string,
): StoreAPI {
    let store = internal.withNamespace(`plugin:${id}`);
    return {
        get: <T>(id: string): T => {
            let def = settings.find((s) => s.id == id).default as T;
            return store.get<T>(id, def);
        },
    };
}

export function createCssAPI(internal: CustomCss): CssAPI {
    let sheet = internal.createStyleSheet();
    return {
        addRule(rule: string) {
            sheet.insertRule(rule, 0);
        },
        clearRules() {
            sheet.replaceSync("");
        },
    };
}

export function createDomApi(): DomAPI {
    return {
        render(component: FunctionalComponent, element: HTMLElement) {
            render(component, element);
        },
    };
}

export type PluginContextWithCleanup = PluginContext & {
    _internalCleanup?: () => void;
};

export function createPluginContext(
    deps: ReadIt,
    plugin: ReadItPlugin,
): PluginContextWithCleanup {
    const cleanupCallbacks: (() => void)[] = [];

    const ctx: PluginContextWithCleanup = {
        posts: createPostsAPI(deps.posts),
        settings: createSettingsAPI(deps.settings),
        storage: createStorageAPI(deps.storage, plugin.id),
        storageSync: createStorageSyncAPI(deps.storageSync, plugin.id),
        store: createStoreAPI(deps.storageSync, plugin.settings, plugin.id),
        logging: createLoggingAPI(deps.logging, plugin),
        customcss: createCssAPI(deps.customcss),
        dom: createDomApi(),
        cleanup: (fn: () => void) => {
            cleanupCallbacks.push(fn);
        },
        _internalCleanup: () => {
            cleanupCallbacks.forEach((fn) => {
                try {
                    fn();
                } catch (e) {
                    console.error(`[${plugin.name}] Cleanup error:`, e);
                }
            });
            cleanupCallbacks.length = 0;
        },
    };

    return ctx;
}
