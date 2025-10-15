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
}

export type NavigationTileProps = TileProps & {
    id: string;
}

export type SettingsPage = {
    id: string;
    title: string;
    items?: TileProps[];
    pageComponent?: never
} | {
	id: string;
	title: string;
	items?: never;
	pageComponent?: any;
};

export declare function definePlugin (config: ReadItPlugin): ReadItPlugin;

export type SettingsAPI = {
	registerSettingsTile: (tile: TileProps) => () => void,
	registerSettingsPage: (page: SettingsPage) => () => void,
	registerNavigationTile: (tile: NavigationTileProps) => () => void,
}

export type PostsAPI = {
	registerLoadCallback: (cb: (posts: Element[]) => void) => () => void,
}

export type LoggingAPI = {
	info(message: string): void,
	error(message: string): void,
	warn(message: string): void,
}

export type StorageAPI = {
	get<T = unknown>(key: string, defaultValue?: T): Promise<T>,
	set<T = unknown>(key: string, value: T): Promise<void>,
	delete(key: string): Promise<void>,
	keys(): Promise<string[]>,
}

export type CssAPI = {
	addRule(rule: string): void,
	clearRules(): void,
}

export type PluginContext = {
	settings: SettingsAPI,
	posts: PostsAPI,
	storage: StorageAPI,
	logging: LoggingAPI,
	customcss: CssAPI,
	cleanup: () => void,
}