import { ReadIt } from "@modules/readit";
import { StorageSync } from "@modules/storage/common";

export class WebStorageSync extends StorageSync {
    constructor(readit: ReadIt) {
        super(readit);
        const val = GM_getValue("readit-storage");
        if (!val) {
            GM_setValue("readit-storage", {});
        }
    }

    private load(): Record<string, any> {
        return GM_getValue("readit-storage") ?? {};
    }

    private save(data: Record<string, any>): void {
        GM_setValue("readit-storage", data);
    }

    get<T = unknown>(namespace: string, key: string, defaultValue?: T): T {
        const data = this.load();
        if (data[namespace] && key in data[namespace]) {
            return data[namespace][key] as T;
        }
        return defaultValue as T;
    }

    set<T = unknown>(namespace: string, key: string, value: T): void {
        const data = this.load();
        if (!data[namespace]) data[namespace] = {};
        data[namespace][key] = value;
        this.save(data);
    }

    delete(namespace: string, key: string): void {
        const data = this.load();
        if (data[namespace]) {
            delete data[namespace][key];
            this.save(data);
        }
    }

    keys(namespace: string): string[] {
        const data = this.load();
        return data[namespace] ? Object.keys(data[namespace]) : [];
    }

    clear(namespace: string): void {
        const data = this.load();
        if (data[namespace]) {
            delete data[namespace];
            this.save(data);
        }
    }
}
