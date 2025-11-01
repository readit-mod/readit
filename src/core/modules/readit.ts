import { Posts } from "@/core/modules/posts";
import { Plugins } from "@/core/modules/plugins";
import { Settings } from "@/core/modules/settings";
import { createStorage, createStorageSync } from "@/core/modules/storage";
import { Storage, StorageSync } from "@/core/modules/storage/common";
import { Logging } from "@/core/modules/logging";
import { CustomCss } from "@/core/modules/customcss";
import { setupCustomCss } from "@/core/modules/customcss/settings";
import { Patcher } from "@/core/modules/patcher";
import { withNative } from "@/lib/native";

export class ReadIt {
    version: string;
    logging: Logging;
    posts: Posts;
    plugins: Plugins;
    settings: Settings;
    storage: Storage;
    storageSync: StorageSync;
    customcss: CustomCss;
    patcher: Patcher;

    constructor() {
        this.version = __READIT_VERSION__;

        this.logging = new Logging(this);
        this.posts = new Posts(this);
        this.settings = new Settings(this);
        this.storage = createStorage(this);
        this.storageSync = createStorageSync(this);
        this.plugins = new Plugins(this);
        this.customcss = new CustomCss(this);
        this.patcher = new Patcher(this);

        withNative(() => {
            for (const { object, replacements } of window.ReadItNative
                .polyfills) {
                const target = globalThis[object] ?? globalThis;

                for (const [key, value] of Object.entries(replacements)) {
                    this.patcher.instead(target, key, value);
                }
            }
        });

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
