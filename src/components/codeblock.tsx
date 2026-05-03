import { clsx } from "@api/utils/classes";

export function CodeBlock({ children }) {
    return (
        <code attr:class={clsx("block", "p-xs", "mt-xs", "rounded-none")}>
            {children}
        </code>
    );
}
