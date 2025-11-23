export const definePlugin = (config: ReadItPlugin): ReadItPlugin => {
    return {
        settings: [],
        ...config,
    };
};
