import { Settings } from "@/core/modules/settings"
import { Posts } from "@/core/modules/posts"
import { Storage } from "@/core/modules/storage"
import { Logging } from "@/core/modules/logging"
import { CustomCss } from "../../customcss"

import { SettingsAPI, PostsAPI, PluginContext, StorageAPI, LoggingAPI, CssAPI } from "@/core/modules/plugins/api/types"
import { ReadItPlugin } from "@/lib/types"
import { ReadIt } from "@/core/modules/readit"

export function createPostsAPI(internal: Posts): PostsAPI {
    return {
        registerLoadCallback: (cb) => internal.registerOnPostsLoaded(cb)
    }
}

export function createSettingsAPI(internal: Settings): SettingsAPI {
    return {
        registerSettingsTile: (tile) => internal.registerSettingsTile(tile),
        registerSettingsPage: (page) => internal.registerSettingsPage(page),
        registerNavigationTile: (tile) => internal.registerNavigationTile(tile),
    }
}

export function createLoggingAPI(internal: Logging, plugin: ReadItPlugin): LoggingAPI {
    return {
        info: (message: string) => internal.info(`[${plugin.name}] ${message}`),
        error: (message: string) => internal.error(`[${plugin.name}] ${message}`),
        warn: (message: string) => internal.warn(`[${plugin.name}] ${message}`),
    }
}

export function createStorageAPI(internal: Storage, id: string): StorageAPI {
    return {
        async get<T = unknown>(key: string, defaultValue?: T): Promise<Awaited<T>> {
            return await  internal.get<T>(`plugin:${id}`, key, defaultValue);
        },
        async set<T = unknown>(key: string, value: T): Promise<void> {
            return await internal.set<T>(`plugin:${id}`, key, value);
        },
        async delete(key: string): Promise<void> {
            return await internal.delete(`plugin:${id}`, key);
        },
        async keys(): Promise<string[]> {
            return await internal.keys(`plugin:${id}`);
        }
    }
}

export function createCssAPI(internal: CustomCss): CssAPI{
    let sheet = internal.createStyleSheet();
    return {
        addRule(rule: string) {
            sheet.insertRule(rule, 0)
        }
    }
}

export function createPluginContext(deps: ReadIt, plugin: ReadItPlugin): PluginContext {
    return {
        posts: createPostsAPI(deps.posts),
        settings: createSettingsAPI(deps.settings),
        storage: createStorageAPI(deps.storage, plugin.id),
        logging: createLoggingAPI(deps.logging, plugin),
        customcss: createCssAPI(deps.customcss),
    }
}