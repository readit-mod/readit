export default {
    settings: {
        get() {
            return JSON.parse(localStorage.getItem("readit-settings") || "{}");
        },
        async set(settings: any) {
            localStorage.setItem("readit-settings", JSON.stringify(settings));
        },
    } satisfies ReadItPlatform["settings"],
};
