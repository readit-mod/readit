import type { ReadItPlugin } from "@/lib/types";
import { importProxied } from "@/core/utils";
import { ReadIt } from "./readit";

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

  definePlugin({ name, description }: ReadItPlugin) {
    this.loadedPluginList.push({ name, description });
  }

  async loadPlugins() {
    console.log(this.unloadedPluginList);
    this.unloadedPluginList.forEach(async (plugin) => {
      try {
        await this.loadPlugin(plugin.url);
      } catch (e) {
        console.error("Plugin execution failed, URL:", plugin.url, e);
      }
    });
  }

  async loadPlugin(url: string) {
    try {
      const module = await importProxied(url);

      if (module.default) {
        module.default(this.readit); // pass readit instance into plugin
      }
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
