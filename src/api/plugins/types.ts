import { SYM_CORE_PLUGIN, PluginLifeCycle } from ".";

export type Plugin = {
    name: string;
    id: string;
    version: string;
    lifeCycle?: PluginLifeCycle;
    start: () => void;
    stop: () => void;
};

export type CorePlugin = Omit<Plugin, "stop"> & {
    stop?: () => void;
};

export type RawPluginModule = {
    default: InternalPlugin;
};

export enum PluginStates {
    Registered = 1 << 0,
    Started = 1 << 1,
    Stopped = 1 << 2,
    Errored = 1 << 3,
}

export type InternalPlugin = CorePlugin & {
    state: number;
    [SYM_CORE_PLUGIN]?: boolean;
};
