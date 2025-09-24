import { Settings } from "@/core/modules/settings"
import { Posts } from "@/core/modules/posts"
import { Storage } from "@/core/modules/storage"

import { SettingsAPI, PostsAPI, PluginContext } from "@/core/modules/plugins/api/types"

export function createPostsAPI(internal: Posts): PostsAPI {
    return {
        registerLoadCallback: (cb) => internal.registerOnPostsLoaded(cb)
    }
}

export function createSettingsAPI(internal: Settings): SettingsAPI {
    return {
        registerSettingsTile: (tile) => internal.registerSettingsTile(tile)
    }
}

export function createStorageAPI(internal: Storage, id: string) {
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

export function createPluginContext(deps: {posts: Posts, settings: Settings, storage: Storage}, pluginId: string): PluginContext {
    return {
        posts: createPostsAPI(deps.posts),
        settings: createSettingsAPI(deps.settings),
        storage: createStorageAPI(deps.storage, pluginId),
    }
}