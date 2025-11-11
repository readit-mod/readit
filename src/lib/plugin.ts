import { ReadItPlugin } from "@lib/types";

export const definePlugin = (config: ReadItPlugin): ReadItPlugin => {
    return {
        settings: [],
        ...config,
    };
};
