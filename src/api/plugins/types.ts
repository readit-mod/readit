import type { FactoryPatcher } from "@modules/types";
import { type PluginLifeCycle, SYM_CORE_PLUGIN } from ".";

export type Plugin = {
    name: string;
    id: string;
    version: string;
    patches?: FactoryPatcher.Patch[];
    [key: string]: any;
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
