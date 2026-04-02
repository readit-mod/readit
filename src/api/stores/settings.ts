import { expose } from "@api/expose";
import { settings } from "@api/platform";
import { isCorePlugin } from "@api/plugins";
import { rawPlugins } from "@api/plugins/manager";
import { createStore } from ".";

type Settings = {
    plugins: Record<string, any>;
};

const DefaultSettings: Settings = {
    plugins: {},
};

const stored = settings.get();

export const SettingsStore = createStore(
    {
        ...DefaultSettings,
        ...stored,
    },
    {
        getPluginSettings(store, _plain, [pluginId]) {
            const pluginSettings = store.plugins[pluginId];
            const plugin = rawPlugins.find((p) => p.default.id === pluginId);
            const isRequired = isCorePlugin(plugin.default);

            if (!pluginSettings) {
                store.plugins[pluginId] = {
                    enabled: isRequired,
                };

                return store.plugins[pluginId];
            }

            return pluginSettings;
        },
    },
);

SettingsStore.addGlobalListener(() => {
    settings.set(SettingsStore.plain);
});

export const Settings = SettingsStore.store;

expose(
    {
        SettingsStore,
        Settings,
    },
    "readit.api.stores",
);
