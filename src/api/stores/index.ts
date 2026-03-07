import type { Listener, StoreInstance, StoreMethods } from "./types";

// biome-ignore lint/complexity/noBannedTypes: no type fits here
export class Store<T, M extends StoreMethods<T> = {}> {
    private proxyContexts = new WeakMap<
        object,
        {
            root: T;
            path: string;
        }
    >();
    private pathListeners = new Map<string, Set<Listener<T>>>();
    private globalListeners = new Set<Listener<T>>();

    public store: T;
    public plain: T;

    constructor(defaultData: T, methods?: M) {
        this.plain = defaultData;
        this.store = this.makeProxy(defaultData);

        if (methods) {
            for (const [name, fn] of Object.entries(methods)) {
                (this as any)[name] = (args: any) => fn(this.store, this.plain, args);
            }
        }
    }

    private makeProxy(obj: any, root: T = obj, path = "") {
        this.proxyContexts.set(obj, {
            root,
            path,
        });

        return new Proxy(obj, {
            get: (target, key) => {
                const value = target[key];

                if (typeof value === "object" && value != null) {
                    const newPath = path ? `${path}.${String(key)}` : String(key);

                    return this.makeProxy(value, root, newPath);
                }

                return value;
            },

            set: (target, key, value) => {
                if (target[key] === value) return true;

                target[key] = value;

                const newPath = path ? `${path}.${String(key)}` : String(key);

                this.notify(newPath, value, root);

                return true;
            },
        });
    }

    private notify(path: string, value: any, root: T) {
        this.pathListeners.get(path)?.forEach((cb) => {
            cb(value, path, root);
        });

        this.globalListeners.forEach((cb) => {
            cb(value, path, root);
        });
    }

    addPathListener(path: string, listener: Listener<T>) {
        const listeners = this.pathListeners.get(path) ?? new Set();
        listeners.add(listener);
        this.pathListeners.set(path, listeners);
    }

    addGlobalListener(listener: Listener<T>) {
        this.globalListeners.add(listener);
    }

    removeGlobalListener(listener: Listener<T>) {
        this.globalListeners.delete(listener);
    }
}

export function createStore<T, M extends StoreMethods<T>>(
    data: T,
    methods: M,
): StoreInstance<T, M> {
    return new Store(data, methods) as StoreInstance<T, M>;
}
