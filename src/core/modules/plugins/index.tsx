import type { ReadItPlugin } from "@/lib/types";
import { importProxied } from "@/core/utils";
import { ReadIt } from "@/core/modules/readit";
import PluginPage from "@/core/components/PluginPage";
import { createPluginContext } from "@/core/modules/plugins/api/context";

export class Plugins {
    private unloadedPluginList: { url: string }[] = [];
    private loadedPluginMap: Map<string, ReadItPlugin> = new Map();

    constructor(private readit: ReadIt) {
        this.readit.storage
            .get("core", "plugins", [])
            .then((plugins: { url: string }[]) => {
                this.unloadedPluginList = plugins;
            });
    }

    get pluginList() {
        return Array.from(this.loadedPluginMap.values());
    }

    getPluginById(id: string) {
        return this.loadedPluginMap.get(id);
    }

    updatePlugin(id: string, updater: (plugin: ReadItPlugin) => void) {
        const plugin = this.loadedPluginMap.get(id);
        if (!plugin) return;
        updater(plugin);
        this.loadedPluginMap.set(id, plugin);
    }

    private loadPluginByExport(plugin: ReadItPlugin) {
        if (this.loadedPluginMap.has(plugin.id)) return;

        const rawCtx = createPluginContext(this.readit, plugin);
        const ctx = new Proxy(rawCtx, {
            set(target, prop: string, value) {
                target[prop] = value;
                return true;
            },
            get(target, prop: string) {
                return target[prop];
            },
        });

        plugin._ctx = ctx;

        const disabledPlugins = this.readit.storageSync.get<string[]>(
            "core",
            "disabledPlugins",
            [],
        );

        if (disabledPlugins.includes(plugin.id)) {
            plugin.enabled = false;
        } else {
            plugin.enabled = true;
            plugin.onLoad?.(ctx);
        }

        this.readit.settings.registerSettingsPage({
            id: `plugin:${plugin.id}`,
            title: plugin.name,
            pageComponent: () => <PluginPage plugin={plugin} />,
        });

        this.loadedPluginMap.set(plugin.id, plugin);
    }

    async disablePlugin(plugin: ReadItPlugin) {
        let disabledPlugins = await this.readit.storage.get<string[]>(
            "core",
            "disabledPlugins",
            [],
        );

        if (!disabledPlugins.includes(plugin.id)) {
            disabledPlugins.push(plugin.id);
        }

        await this.readit.storage.set(
            "core",
            "disabledPlugins",
            disabledPlugins,
        );

        plugin._ctx?._internalCleanup();
        plugin.onUnload?.(plugin._ctx);

        this.updatePlugin(plugin.id, (p) => {
            p.enabled = false;
        });
    }

    enablePlugin(plugin: ReadItPlugin) {
        let disabledPlugins = this.readit.storageSync.get<string[]>(
            "core",
            "disabledPlugins",
            [],
        );

        disabledPlugins = disabledPlugins.filter((id) => id !== plugin.id);
        this.readit.storageSync.set("core", "disabledPlugins", disabledPlugins);

        plugin.enabled = true;
        plugin.onLoad(plugin._ctx);

        this.updatePlugin(plugin.id, (p) => {
            p.enabled = true;
        });
    }

    async loadPlugins() {
        await this.loadBuiltins();
        await Promise.all(
            this.unloadedPluginList.map(async (plugin) => {
                try {
                    await this.loadPlugin(plugin.url);
                } catch (e) {
                    console.error(
                        "Plugin execution failed, URL:",
                        plugin.url,
                        e,
                    );
                }
            }),
        );
    }

    async loadBuiltins() {
        const modules = import.meta.glob("./builtin/*/index.ts{,x}", {
            eager: true,
        });
        for (const module of Object.values(modules)) {
            const plugin: ReadItPlugin = (module as any).default;
            this.loadPluginByExport(plugin);
        }
    }

    async loadPlugin(url: string) {
        try {
            const module = await importProxied(url);
            const plugin: ReadItPlugin = module.default;
            this.loadPluginByExport(plugin);
        } catch (e) {
            console.error("Failed to load plugin:", e);
        }
    }

    async addPlugin(url: string) {
        const plugins = await this.readit.storage.get("core", "plugins", []);
        plugins.push({ url });
        await this.readit.storage.set("core", "plugins", plugins);
        alert("Plugin added! Page will now reload to apply changes.");
        unsafeWindow.location.reload();
    }

    onLoadedPlugins() {
        this.readit.settings.registerSettingsPage({
            id: "add-plugin",
            title: "Add Plugin",
            items: [
                {
                    title: "Add with RAW URL",
                    description: "Add a new plugin by RAW URL",
                    onClick: () => {
                        const url = prompt(
                            "Enter the valid RAW URL of the plugin:",
                        );
                        if (url) this.addPlugin(url);
                    },
                },
                {
                    title: "Add from GitHub Repo",
                    description: "Add a new plugin by GitHub Repo URL",
                    onClick: () => {
                        const repo = prompt(
                            "Enter the GitHub Repo URL of the plugin",
                        );
                        if (repo) {
                            function toRawBuildsUrl(repoUrl: string) {
                                const match = repoUrl.match(
                                    /^https:\/\/github\.com\/([^/]+)\/([^/]+)(?:\/.*)?$/,
                                );
                                if (!match)
                                    throw new Error("Invalid GitHub repo URL");
                                const [, user, repo] = match;
                                return `https://raw.githubusercontent.com/${user}/${repo}/builds/plugin.js`;
                            }
                            const rawUrl = toRawBuildsUrl(repo);
                            this.addPlugin(rawUrl);
                        }
                    },
                },
            ],
        });

        this.readit.settings.registerNavigationTile({
            id: "add-plugin",
            title: "Add Plugin",
            description: "Add a new plugin to ReadIt",
            icon: "➕",
        });

        this.readit.settings.registerSettingsPage({
            id: "plugins",
            title: "Plugins",
            items: this.pluginList.map((p) => ({
                title: p.name,
                description: p.version ? `v${p.version}` : "No version",
                onClick: () => this.readit.settings.goToPage(`plugin:${p.id}`),
            })),
        });

        this.readit.settings.registerNavigationTile({
            id: "plugins",
            title: "Plugins",
            description: "Manage your installed plugins",
            icon: "🧩",
        });
    }

    async initPlugins() {
        await this.loadPlugins();
        this.onLoadedPlugins();
    }
}
