import { Posts } from "@/core/modules/posts";
import { Plugins } from "@/core/modules/plugins";
import { Settings } from "@/core/modules/settings";
import { Storage } from "@/core/modules/storage";
import { Logging } from "@/core/modules/logging";

export class ReadIt {
  version: string;
  logging: Logging;
  posts: Posts;
  plugins: Plugins;
  settings: Settings;
  storage: Storage;

  constructor() {
    this.version = GM_info.script.version;

    this.logging = new Logging(this);
    this.posts = new Posts(this);
    this.settings = new Settings(this);
    this.plugins = new Plugins(this);
    this.storage = new Storage(this);

    this.plugins.loadPlugins();
    this.settings.registerSettingsTile({
        title: "ReadIt Version",
        description: this.version
    });

    this.settings.registerSettingsPage({
        id: "plugins",
        title: "Plugins",
        items: this.plugins.loadedPluginList.map((p) => ({
          title: p.name,
          description: p.version ? `v${p.version}` : "No version",
        }))
    })

    this.settings.registerNavigationTile({
      id: "plugins",
      title: "Plugins",
      description: "Manage your installed plugins",
      icon: "🧩",
    })

    this.plugins.onLoadedPlugins();

  }
}

export const readit = new ReadIt();

(unsafeWindow as any).readit = readit;
