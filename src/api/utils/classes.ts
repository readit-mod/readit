// inspired by vencord

export type ClassNameFactoryArg =
    | string
    | string[]
    | Record<string, unknown>
    | false
    | null
    | undefined
    | 0
    | "";

export const classNameFactory =
    (prefix: string = "") =>
    (...args: ClassNameFactoryArg[]) => {
        const classNames = new Set<string>();
        for (const arg of args) {
            if (arg && typeof arg === "string") classNames.add(arg);
            else if (Array.isArray(arg))
                arg.forEach((name) => {
                    classNames.add(name);
                });
            else if (arg && typeof arg === "object")
                Object.entries(arg).forEach(([name, value]) => {
                    value && classNames.add(name);
                });
        }
        return Array.from(classNames, (name) => prefix + name).join(" ");
    };

export const clsx = classNameFactory("");
