import type { ReadItPlugin } from "@/lib/types";
import { readit } from "@/core/modules/readit";
import { importProxied } from "@/core/utils";

export class Plugins {
  constructor() {
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

  loadPlugins() {
    console.log(this.unloadedPluginList);
    this.unloadedPluginList.forEach((plugin) => {
      try {
        this.loadPlugin(plugin.url);
      } catch (e) {
        console.error("Plugin execution failed, URL:", plugin.url, e);
      }
    });
  }

  async loadPlugin(url: string) {
    try {
      const module = await importProxied(url);

      if (module.default) {
        module.default(readit); // pass your instance into plugin
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
