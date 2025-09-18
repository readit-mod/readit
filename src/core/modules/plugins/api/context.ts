import { Settings } from "@/core/modules/settings"
import { Posts } from "@/core/modules/posts"

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

export function createPluginContext(deps: {posts: Posts, settings: Settings}): PluginContext {
    return {
        posts: createPostsAPI(deps.posts),
        settings: createSettingsAPI(deps.settings),
    }
}