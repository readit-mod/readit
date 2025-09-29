import type { ReadItPlugin } from "@/lib/types";
import { importProxied } from "@/core/utils";
import { ReadIt } from "@/core/modules/readit";
import { createPluginContext } from "@/core/modules/plugins/api/context";

export class Plugins {
  constructor(private readit: ReadIt) {
    if (localStorage.getItem("plugins") == null)
      localStorage.setItem("plugins", "[]");
    const plugins = JSON.parse(localStorage.getItem("plugins")!);
    this.unloadedPluginList = plugins;
  }

  unloadedPluginList = [];
  loadedPluginList: ReadItPlugin[] = [];

  get pluginList() {
    return this.loadedPluginList;
  }

  async loadPlugins() {
    console.log(this.unloadedPluginList);
    await this.loadBuiltins();
    this.unloadedPluginList.forEach(async (plugin) => {
      try {
        await this.loadPlugin(plugin.url);
      } catch (e) {
        console.error("Plugin execution failed, URL:", plugin.url, e);
      }
    });
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
    alert("New Plugins require a reload!");
  }

  onLoadedPlugins() {
    this.readit.settings.registerSettingsTile({
      title: "Add Plugin",
      description: "Add a new plugin by RAW URL",
      onClick: () => {
        let url = prompt("Enter the valid RAW URL of the plugin:");
        if (url) this.addPlugin(url);
      }
    })
  }
}
