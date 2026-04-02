import { showConfirmationDialog, showSimpleDialog } from "@api/dialog";
import { expose } from "@api/expose";
import { chain } from "@api/filters";
import { Logger, logger } from "@api/logger";
import { SettingsStore } from "@api/stores/settings";
import { showToast } from "@api/toasts";
import { splitArray } from "@api/utils/array";
import { addPatch } from "@modules/patches/factory";
import { Text } from "@/components/text";
import { isCorePlugin, PluginLifeCycle } from ".";
import {
    type InternalPlugin,
    PluginStates,
    type RawPluginModule,
} from "./types";

const pInstances = new Map<string, InternalPlugin>();
export let rawPlugins: RawPluginModule[];

export function registerPluginDefinitions() {
    rawPlugins = Object.values(
        import.meta.glob<RawPluginModule>(
            [
                "../../plugins/*/index.ts{,x}",
                "../../plugins/_core/*/index.ts{,x}",
                "../../plugins/_api/*/index.ts{,x}",
            ],
            {
                eager: true,
            },
        ),
    );

    for (const { default: definition } of rawPlugins) {
        if (!pInstances.has(definition.id)) {
            pInstances.set(definition.id, definition);

            const settings = SettingsStore.getPluginSettings(definition.id);

            if (settings.enabled && definition.patches) {
                const helpersPath = `readit.api.plugins.manager.plugins["${definition.name}"]`;

                for (const patch of definition.patches) {
                    addPatch(patch, helpersPath, (source, id) => {
                        logger.warn(
                            `Patch ${source} at plugin ${definition.name} had no effect. Module ID: ${id}.`,
                        );

                        showToast({
                            level: "warning",
                            message: `Patch in plugin ${definition.name} had no effect. Click for more information.`,
                            duration: 8e3,
                            click() {
                                showSimpleDialog({
                                    id: "patch-no-effect-dialog",
                                    title: `Patch had no effect`,
                                    content: (
                                        <div>
                                            <p>
                                                A patch in{" "}
                                                <Text variant={"sm/bold"}>
                                                    {definition.name}
                                                </Text>{" "}
                                                had no effect on the factory it
                                                was targeting.
                                            </p>
                                            <hr />
                                            <p>
                                                <Text variant={"sm/bold"}>
                                                    Patch Source:
                                                </Text>
                                                {`\n`}
                                                <code>/{source}/</code>
                                            </p>
                                            <p>
                                                <Text variant={"sm/bold"}>
                                                    Module ID:
                                                </Text>
                                                {`\n`}
                                                <code>{id}</code>
                                            </p>
                                        </div>
                                    ),
                                });
                            },
                        });
                    });
                }
            }
        }
    }
}

export function getPluginInstances(): InternalPlugin[] {
    return Array.from(pInstances.values());
}

export function startPluginsFromLifeCycle(lifeCycle: PluginLifeCycle) {
    const pluginsForLifeCycle = getPluginInstances().filter(
        chain.all(
            (plugin) => plugin.lifeCycle === lifeCycle,
            (plugin) => SettingsStore.getPluginSettings(plugin.id).enabled,
        ),
    );
    logger.log("Starting plugins for", lifeCycle, pluginsForLifeCycle);
    const [core, regular] = splitArray(pluginsForLifeCycle, isCorePlugin);

    tryStartPluginBulk(core.map((p) => p.id));
    tryStartPluginBulk(regular.map((p) => p.id));
}

export function tryStartPlugin(id: string) {
    const plugin = pInstances.get(id);
    if (!plugin) return;

    try {
        plugin.start?.();
        plugin.state &= ~PluginStates.Stopped;
        plugin.state |= PluginStates.Started;
    } catch (e: any) {
        plugin.state |= PluginStates.Stopped | PluginStates.Errored;
        new Logger(plugin.name).error(e);
    }
}

export function tryStartPluginBulk(ids: string[]) {
    ids.forEach(tryStartPlugin);
}

export function tryStopPlugin(id: string) {
    const plugin = pInstances.get(id);
    if (!plugin) return;

    try {
        plugin.stop?.();
        plugin.state &= ~PluginStates.Started;
        plugin.state |= PluginStates.Stopped;
    } catch (e) {
        // Not much we can do if this fails.
        new Logger(plugin.name).error(e);
    }
}

export function tryStopPluginBulk(ids: string[]) {
    ids.forEach(tryStopPlugin);
}

export function getPluginInstance(id: string) {
    return pInstances.get(id);
}

export const plugins = new Proxy(
    {},
    {
        get(target, property, reciever) {
            if (property in target)
                return Reflect.get(target, property, reciever);

            const plugin = Array.from(pInstances.values()).find(
                (p) => p.name === property,
            );

            return plugin;
        },
    },
);

export function enablePlugin(id: string) {
    const settings = SettingsStore.getPluginSettings(id);
    if (settings.enabled) return;

    settings.enabled = true;
    const plugin = getPluginInstance(id);

    if (plugin.patches) {
        showConfirmationDialog({
            id: "enable-plugin-with-patches",
            title: "Are you sure you want to restart?",
            description:
                "This plugin has patches, so it requires a restart to enable.",
            onResult(result) {
                if (result) {
                    window.location.reload();
                }
            },
        });
    } else {
        tryStartPlugin(id);
    }
}

expose(
    {
        getPluginInstances,
        getPluginInstance,
        enablePlugin,
        startPluginsFromLifeCycle,
        tryStartPlugin,
        tryStartPluginBulk,
        tryStopPlugin,
        tryStopPluginBulk,
        plugins,
        pInstances,
        PluginLifeCycle,
        PluginStates,
    },
    "readit.api.plugins.manager",
);
