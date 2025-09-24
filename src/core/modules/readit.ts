import { Posts } from "@/core/modules/posts";
import { Plugins } from "@/core/modules/plugins";
import { Settings } from "@/core/modules/settings";
import { Storage } from "@/core/modules/storage";

export class ReadIt {
  version: string;
  posts: Posts;
  plugins: Plugins;
  settings: Settings;
  storage: Storage;

  constructor() {
    this.version = GM_info.script.version;

    this.posts = new Posts(this);
    this.settings = new Settings(this);
    this.plugins = new Plugins(this);
    this.storage = new Storage(this);

    this.plugins.loadPlugins();
    this.settings.registerSettingsTile({
        title: "ReadIt Version",
        description: this.version
    })
    
  }
}

export const readit = new ReadIt();

(unsafeWindow as any).readit = readit;
