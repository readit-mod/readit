export function withNative<T>(fun: () => T): T | undefined {
    if (window.ReadItNative) return fun();
}

export function isNative() {
    return window.ReadItNative ? true : false;
}
