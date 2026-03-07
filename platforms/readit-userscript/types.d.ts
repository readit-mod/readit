export {};

declare global {
    const GM_info: {
        script: {
            version: string;
        };
    };

    function GM_getValue<T>(key: string, def: T): T;
    function GM_setValue<T>(key: string, value: T): void;
}
