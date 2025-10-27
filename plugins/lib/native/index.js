export function isNative() {
    return window.ReadItNative ? true : false;
}

export function withNative(fn) {
    return isNative() ? fn() : undefined;
}

export async function withNativeAsync(fn) {
    return isNative() ? await fn() : undefined;
}