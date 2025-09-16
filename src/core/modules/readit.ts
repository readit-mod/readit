import { Posts } from "@/core/modules/posts";
import { Plugins } from "@/core/modules/plugins";
import { Settings } from "@/core/modules/settings";

class ReadIt {
  version: string;
  posts: Posts;
  plugins: Plugins;
  settings: Settings;
  constructor() {
    this.version = GM_info.script.version;

    this.posts = new Posts();
    this.settings = new Settings();
    this.plugins = new Plugins();

    this.plugins.loadPlugins();
  }
}

export const readit = new ReadIt();

(unsafeWindow as any).readit = readit;
