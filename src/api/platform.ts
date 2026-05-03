declare global {
    const readit: {
        platform: ReadItPlatform;
    };
}

const { info, settings } = readit.platform;

export { info, settings };
