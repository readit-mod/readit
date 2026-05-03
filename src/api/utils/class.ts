export function destructureClass<T extends object>(instance: T): T {
    return new Proxy(instance, {
        get(target, prop, reciever) {
            const value = Reflect.get(target, prop, reciever);

            if (typeof value === "function") {
                return value.bind(instance);
            }

            return value;
        },
    });
}
