import { Posts } from "@/core/modules/posts";
import { Plugins } from "@/core/modules/plugins";
import { Settings } from "@/core/modules/settings";
import { meta } from "@/lib/meta";
import { createStorage, createStorageSync } from "@/core/modules/storage";
import { Storage, StorageSync } from "@/core/modules/storage/common";
import { Logging } from "@/core/modules/logging";
import { CustomCss } from "@/core/modules/customcss";
import { setupCustomCss } from "@/core/modules/customcss/settings";
import { isNative } from "@/lib/native";

export class ReadIt {
    version: string;
    logging: Logging;
    posts: Posts;
    plugins: Plugins;
    settings: Settings;
    storage: Storage;
    storageSync: StorageSync;
    customcss: CustomCss;

    constructor() {
        this.version = __READIT_VERSION__;

        this.logging = new Logging(this);
        this.posts = new Posts(this);
        this.settings = new Settings(this);
        this.storage = createStorage(this);
        this.storageSync = createStorageSync(this);
        this.plugins = new Plugins(this);
        this.customcss = new CustomCss(this);

        this.settings.registerSettingsTile({
            title: "ReadIt Version",
            description: this.version,
        });

        setupCustomCss(this);

        this.plugins.initPlugins();
    }
}

export const readit = new ReadIt();

Object.defineProperty(window, "readit", {
    value: readit,
    writable: false,
    configurable: false,
});
