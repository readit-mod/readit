export type ReadItPlugin = {
  name: string;
  description: string;
  version?: string;

  onLoad: (ctx: PluginContext) => void;
};

export type TileProps = {
  title: string;
  description: string;
  icon?: string;
}

export declare function definePlugin(config: ReadItPlugin): ReadItPlugin;


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
