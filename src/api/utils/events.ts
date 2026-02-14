export function addSingleListener(
    root: Element,
    event: string,
    callback: (...args: any[]) => void,
) {
    root.removeEventListener(event, callback);
    root.addEventListener(event, callback);
}
