import { ReadIt } from "@/core/modules/readit";

export class Storage {
    constructor(private readit: ReadIt) {
        GM.getValue("readit-storage").then((val) => {
            if (!val) {
                GM.setValue("readit-storage", {});
            }
        });
    }

    private async load(): Promise<Record<string, any>> {
        return (await GM.getValue("readit-storage")) ?? {};
    }

    private async save(data: Record<string, any>): Promise<void> {
        await GM.setValue("readit-storage", data);
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

export class StorageSync {
    constructor(private readit: ReadIt) {
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
