export function withNative<T>(fun: () => T): T | undefined {
    if (window.ReadItNative) return fun();
}

export async function withNativeAsync<T>(
    fun: () => Promise<T>,
): Promise<T | undefined> {
    if (window.ReadItNative) return await fun();
}

export function isNative() {
    return window.ReadItNative ? true : false;
}
