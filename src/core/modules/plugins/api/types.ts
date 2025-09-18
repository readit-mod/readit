import { TileProps } from "@/lib/types"

export type SettingsAPI = {
    registerSettingsTile: (tile: TileProps) => void,
}

export type PostsAPI = {
    registerLoadCallback: (cb: (posts: Element[]) => void) => void,
}

export type PluginContext = {
    settings: SettingsAPI,
    posts: PostsAPI,
}