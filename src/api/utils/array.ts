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

export function isArrayEqual(a: any[], b: any[]): boolean {
    if (a.length !== b.length) return false;

    return a.every((value) => b.includes(value));
}
