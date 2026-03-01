import { memoize } from "./lazy";

export const functionFromString = memoize(async (functionString: string): Promise<Fn> => {
    const blob = new Blob(
        [
            `const func = ${functionString}; export default func;`,
        ],
        {
            type: "application/javascript",
        },
    );

    const blobUrl = URL.createObjectURL(blob);

    try {
        const module = await import(blobUrl);
        const func = module.default;

        if (typeof func !== "function") {
            throw new Error("function string invalid");
        }

        return func;
    } finally {
        URL.revokeObjectURL(blobUrl);
    }
});
