import { ReadIt } from "@modules/readit";
import { Storage } from "@modules/storage/common";
import { StorageNative } from "@lib/types";

export class NativeStorage extends Storage {
    private nativeStorage: StorageNative;
    constructor(readit: ReadIt) {
        super(readit);
        this.nativeStorage = window.ReadItNative?.storage;
    }

    private async load(): Promise<Record<string, any>> {
        return (await this.nativeStorage.getAll()) ?? {};
    }

    private async save(data: Record<string, any>): Promise<void> {
        await Promise.all(
            Object.entries(data).map(([key, value]) =>
                this.nativeStorage.setValue(key, value),
            ),
        );
    }

    async get<T = unknown>(
        namespace: string,
        key: string,
        defaultValue?: T,
    ): Promise<T> {
        const data = await this.load();
        if (data[namespace] && key in data[namespace]) {
            return data[namespace][key] as T;
        }
        return defaultValue as T;
    }

    async set<T = unknown>(
        namespace: string,
        key: string,
        value: T,
    ): Promise<void> {
        const data = await this.load();
        if (!data[namespace]) data[namespace] = {};
        data[namespace][key] = value;
        await this.save(data);
    }

    async delete(namespace: string, key: string): Promise<void> {
        const data = await this.load();
        if (data[namespace]) {
            delete data[namespace][key];
            await this.save(data);
        }
    }

    async keys(namespace: string): Promise<string[]> {
        const data = await this.load();
        return data[namespace] ? Object.keys(data[namespace]) : [];
    }

    async clear(namespace: string): Promise<void> {
        const data = await this.load();
        if (data[namespace]) {
            delete data[namespace];
            await this.save(data);
        }
    }
}
