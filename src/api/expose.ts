/**
 * Exposes a value to a path on the global scope.
 * @example
 * ```ts
 *  expose(5, "readit.version");
 *  readit.version;
 *  // 5
 * ```
 *
 * @param value The value to expose.
 * @param path The path on the global scope to expose the value as.
 */
export function expose(value: any, path: string) {
    const parts = path.split(".");
    let current: any = window;

    for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];

        if (current[key] === undefined) {
            current[key] = {};
        }

        current = current[key];
    }

    current[parts[parts.length - 1]] = value;
}
