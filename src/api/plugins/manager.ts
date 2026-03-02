import { showSimpleDialog } from "@api/dialog";
import { expose } from "@api/expose";
import { Logger, logger } from "@api/logger";
import { showToast } from "@api/toasts";
import { splitArray } from "@api/utils/array";
import { html } from "@modules/common/lit";
import { addPatch } from "@modules/patches/factory";
import { isCorePlugin, PluginLifeCycle } from ".";
import { type InternalPlugin, PluginStates, type RawPluginModule } from "./types";

const pInstances = new Map<string, InternalPlugin>();

export function registerPluginDefinitions() {
    const plugins = import.meta.glob<RawPluginModule>(
        [
            "../../plugins/*/index.ts",
            "../../plugins/_core/*/index.ts",
            "../../plugins/_api/*/index.ts",
        ],
        {
            eager: true,
        },
    );

    for (const { default: definition } of Object.values(plugins)) {
        if (!pInstances.has(definition.id)) {
            pInstances.set(definition.id, definition);

            if (definition.patches) {
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
                                    content: html`
                                        <div>
                                            <p>
                                                A patch in <strong>${definition.name}</strong> had no effect on the factory it was targeting.
                                            </p>
                                            <p>
                                                <strong>Pattern:</strong><br/>
                                                <code>/${source}/</code>
                                            </p>
                                            <p>
                                                <strong>Module ID:</strong><br/>
                                                <code>${id}</code>
                                            </p>
                                        </div>
                                    `,
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
        (plugin) => plugin.lifeCycle === lifeCycle,
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
            if (property in target) return Reflect.get(target, property, reciever);

            const plugin = Array.from(pInstances.values()).find((p) => p.name === property);

            return plugin;
        },
    },
);

expose(
    {
        getPluginInstances,
        getPluginInstance,
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
