import { ReadIt } from "@/core/modules/readit";
import { NamespacedStorage, NamespacedStorageAsync } from "@/lib/types";

export abstract class Storage {
    constructor(private readit: ReadIt) {}
    abstract get<T = unknown>(
        namespace: string,
        key: string,
        defaultValue?: T,
    ): Promise<T>;

    abstract set<T = unknown>(
        namespace: string,
        key: string,
        value: T,
    ): Promise<void>;

    abstract delete(namespace: string, key: string): Promise<void>;

    abstract keys(namespace: string): Promise<string[]>;

    abstract clear(namespace: string): Promise<void>;

    withNamespace(namespace: string): NamespacedStorageAsync {
        return {
            get: async <T>(key: string, def: T) =>
                this.get(namespace, key, def),
            set: async <T>(key: string, val: T) =>
                this.set(namespace, key, val),
            delete: async (key: string) => this.delete(namespace, key),
            keys: async () => this.keys(namespace),
            clear: async () => this.clear(namespace),
        };
    }
}

export abstract class StorageSync {
    constructor(private readit: ReadIt) {}
    abstract get<T = unknown>(
        namespace: string,
        key: string,
        defaultValue?: T,
    ): T;

    abstract set<T = unknown>(namespace: string, key: string, value: T): void;

    abstract delete(namespace: string, key: string): void;

    abstract keys(namespace: string): string[];

    abstract clear(namespace: string): void;

    withNamespace(namespace: string): NamespacedStorage {
        return {
            get: <T>(key: string, def: T) => this.get(namespace, key, def),
            set: <T>(key: string, val: T) => this.set(namespace, key, val),
            delete: (key: string) => this.delete(namespace, key),
            keys: () => this.keys(namespace),
            clear: () => this.clear(namespace),
        };
    }
}
