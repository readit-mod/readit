import type { ReadItPlugin } from "@/lib/types";
import { importProxied } from "@/core/utils";
import { ReadIt } from "@/core/modules/readit";
import { createPluginContext } from "@/core/modules/plugins/api/context";

export class Plugins {
  constructor(private readit: ReadIt) {
    this.readit.storage.get("core", "plugins", []).then((plugins: { url: string }[]) => {
      this.unloadedPluginList = plugins;
    })
  }

  unloadedPluginList = [];
  loadedPluginList: ReadItPlugin[] = [];

  get pluginList() {
    return this.loadedPluginList;
  }

  async loadPlugins() {
  console.log(this.unloadedPluginList);
  await this.loadBuiltins();
  await Promise.all(
    this.unloadedPluginList.map(async (plugin) => {
      try {
        await this.loadPlugin(plugin.url);
      } catch (e) {
        console.error("Plugin execution failed, URL:", plugin.url, e);
      }
    })
  );
}

  async loadBuiltins() {
    const modules = import.meta.glob("./builtin/*/index.ts", {eager: true})
    for(const module of Object.values(modules)) {
      const plugin: ReadItPlugin = (module as any).default;
      const ctx = createPluginContext(this.readit, plugin);

      this.loadedPluginList.push(plugin);
      await plugin.onLoad(ctx);
    }
  }

  async loadPlugin(url: string) {
    try {
      const module = await importProxied(url);

      const config: ReadItPlugin = module.default
      this.loadedPluginList.push(config)
      const ctx = createPluginContext(this.readit, config)
      await config.onLoad(ctx) // Pass in the API context
    } catch (e) {
      console.error("Failed to load plugin:", e);
    }
  }

  async addPlugin(url: string) {
    const plugins = await this.readit.storage.get("core", "plugins", []);
    plugins.push({url});
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
            let url = prompt("Enter the valid RAW URL of the plugin:");
            if (url) this.addPlugin(url);
          }
        },
        {
          title: "Add from GitHub Repo",
          description: "Add a new plugin by GitHub Repo URL",
          onClick: () => {
            let repo = prompt("Enter the GitHub Repo URL of the plugin")
            if (repo) {
              function toRawBuildsUrl(repoUrl) {
                const match = repoUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)(?:\/.*)?$/);
                if (!match) {
                  throw new Error("Invalid GitHub repo URL");
                }
                const [, user, repo] = match;
                // Plugins should use and fork the readit-plugin template to make plugins.
                // Builds are automatically generated and stored in the builds branch of the repo.
                return `https://raw.githubusercontent.com/${user}/${repo}/builds/plugin.js`;
              }
              let rawUrl = toRawBuildsUrl(repo);
              this.addPlugin(rawUrl);
            }

          }
        }
      ]
    })
    this.readit.settings.registerNavigationTile({
      id: "add-plugin",
      title: "Add Plugin",
      description: "Add a new plugin to ReadIt",
      icon: "➕"
    })
    this.readit.settings.registerSettingsPage({
        id: "plugins",
        title: "Plugins",
        items: this.loadedPluginList.map((p) => ({
          title: p.name,
          description: p.version ? `v${p.version}` : "No version",
        }))
    })
    
    console.log(this.loadedPluginList);

    this.readit.settings.registerNavigationTile({
      id: "plugins",
      title: "Plugins",
      description: "Manage your installed plugins",
      icon: "🧩",
    })
  }

  async initPlugins() {
    await this.loadPlugins();
    this.onLoadedPlugins();
  }
}
