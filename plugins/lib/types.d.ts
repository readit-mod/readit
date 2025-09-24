export type ReadItPlugin = {
  name: string;
  description: string;
  id: string;
  version?: string;

  onLoad: (ctx: PluginContext) => Promise<void>;
};

export type TileProps = {
  title: string;
  description: string;
  icon?: string;
}

export const definePlugin: (config: ReadItPlugin) => ReadItPlugin;

export type SettingsAPI = {
    registerSettingsTile: (tile: TileProps) => void,
}

export type PostsAPI = {
    registerLoadCallback: (cb: (posts: Element[]) => void) => void,
}

export type StorageAPI = {
    get<T = unknown>(key: string, defaultValue?: T): Promise<T>,
    set<T = unknown>(key: string, value: T): Promise<void>,
    delete(key: string): Promise<void>,
    keys(): Promise<string[]>,
}

export type PluginContext = {
    settings: SettingsAPI,
    posts: PostsAPI,
    storage: StorageAPI,
}