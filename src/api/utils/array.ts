export function splitArray<T>(
    array: readonly T[],
    predicate: (item: T) => boolean,
): [T[], T[]] {
    const pass: T[] = [];
    const fail: T[] = [];

    for (const item of array) {
        (predicate(item) ? pass : fail).push(item);
    }

    return [pass, fail];
}
