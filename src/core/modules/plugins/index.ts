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
    this.loadBuiltins();
    this.unloadedPluginList.forEach(async (plugin) => {
      try {
        await this.loadPlugin(plugin.url);
      } catch (e) {
        console.error("Plugin execution failed, URL:", plugin.url, e);
      }
    });
  }

  loadBuiltins() {
    const modules = import.meta.glob("./builtin/*/index.ts", {eager: true})
    for(const module of Object.values(modules)) {
      const plugin: ReadItPlugin = (module as any).default;
      const ctx = createPluginContext(this.readit);

      this.loadedPluginList.push(plugin);
      plugin.onLoad(ctx);
    }
  }

  async loadPlugin(url: string) {
    const ctx = createPluginContext(this.readit);
    try {
      const module = await importProxied(url);

      const config: ReadItPlugin = module.default
      this.loadedPluginList.push(config)
      config.onLoad(ctx) // Pass in the API context
    } catch (e) {
      console.error("Failed to load plugin:", e);
    }
  }

  addPlugin(url: string) {
    if (localStorage.getItem("plugins") == null)
      localStorage.setItem("plugins", "[]");
    const plugins = JSON.parse(localStorage.getItem("plugins")!);
    plugins.push({ url });
    localStorage.setItem("plugins", JSON.stringify(plugins));
    alert("New Plugins require a reload!");
  }
}
