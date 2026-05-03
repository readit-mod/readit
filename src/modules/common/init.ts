export function initCommonModules() {
    // Run the side effects, adding module waiters.
    import.meta.glob("./*.ts", {
        eager: true,
    });
}
