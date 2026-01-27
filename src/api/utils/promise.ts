/**
 * Creates a promise, then returns it's instance, resolver and rejector.
 * @returns The instance, resolve and reject.
 */
export function deferredPromise<T = void>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: any) => void;

    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return { promise, resolve, reject };
}
