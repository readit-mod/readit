import { ReadIt } from "@/core/modules/readit";
import { StorageSync } from "@/core/modules/storage/common";
import { StorageNative } from "@/lib/types";

export class NativeStorageSync extends StorageSync {
    private nativeStorage: StorageNative;
    constructor(readit: ReadIt) {
        super(readit);
        this.nativeStorage = window.ReadItNative?.storage;
    }

    private load(): Record<string, any> {
        let values = {};
        this.nativeStorage.getAll().then((v) => {
            values = v;
        });
        return values;
    }

    private save(data: Record<string, any>): void {
        Object.entries(data).forEach(([key, value]) => {
            this.nativeStorage.setValue(key, value);
        });
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
