import { type InternalPlugin, type Plugin, PluginStates } from "./types";

export const SYM_CORE_PLUGIN = Symbol("readit-core-plugin");

export enum PluginLifeCycle {
    OnInit = "OnInit",
    LitReady = "LitReady",
    ModulesReady = "ModulesReady",
}

export function definePlugin(definition: Plugin): InternalPlugin {
    return {
        lifeCycle: PluginLifeCycle.ModulesReady,
        ...definition,
        state: PluginStates.Registered,
    } satisfies InternalPlugin;
}

export function defineCorePlugin(definition: Plugin): InternalPlugin {
    return {
        lifeCycle: PluginLifeCycle.ModulesReady,
        ...definition,
        state: PluginStates.Registered,
        [SYM_CORE_PLUGIN]: true,
    } satisfies InternalPlugin;
}

export function isCorePlugin(plugin: InternalPlugin): boolean {
    return Boolean(plugin[SYM_CORE_PLUGIN]);
}
