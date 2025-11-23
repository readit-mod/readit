import { Posts } from "@modules/posts";
import { Plugins } from "@modules/plugins";
import { Settings } from "@modules/settings";
import { createStorage } from "@modules/storage";
import { Storage } from "@modules/storage/common";
import { Logging } from "@modules/logging";
import { CustomCss } from "@modules/customcss";
import { setupCustomCss } from "@modules/customcss/settings";
import { Patcher } from "@modules/patcher";
import { withNative } from "@lib/native";
import { Network } from "@modules/network/common";
import { createNetwork } from "@modules/network";

export class ReadIt {
    version: string;
    logging: Logging;
    posts: Posts;
    plugins: Plugins;
    settings: Settings;
    storage: Storage;
    network: Network;
    customcss: CustomCss;
    patcher: Patcher;

    constructor() {
        this.version = __READIT_VERSION__;

        this.logging = new Logging(this);
        this.posts = new Posts(this);
        this.settings = new Settings(this);
        this.storage = createStorage(this);
        this.network = createNetwork(this);
        this.plugins = new Plugins(this);
        this.customcss = new CustomCss(this);
        this.patcher = new Patcher(this);

        withNative(() => {
            for (const { object, replacements } of window.ReadItNative
                .polyfills) {
                const target = globalThis[object] ?? globalThis;

                for (const [key, value] of Object.entries(replacements)) {
                    this.patcher.instead(target, key, ([...args]) =>
                        value(...args),
                    );
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
