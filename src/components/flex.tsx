import { ensureStyles } from "@api/css";

type FlexProps = {
    direction?: "row" | "column";
    justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
    align?: "start" | "end" | "center" | "stretch" | "baseline";
    gap?: number;
    wrap?: boolean;

    class?: string;
    children?: any;
};

const justifyMap: Record<string, string> = {
    start: "flex-start",
    end: "flex-end",
    center: "center",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly",
};

const alignMap: Record<string, string> = {
    start: "flex-start",
    end: "flex-end",
    center: "center",
    stretch: "stretch",
    baseline: "baseline",
};

function hashProps(obj: any): string {
    return btoa(JSON.stringify(obj)).replace(/=/g, "").slice(0, 10);
}

function generateFlexCSS(className: string, props: FlexProps) {
    const {
        direction = "row",
        justify = "start",
        align = "stretch",
        gap = 0,
        wrap = false,
    } = props;

    return `
.${className} {
    display: flex;
    flex-direction: ${direction};
    justify-content: ${justifyMap[justify]};
    align-items: ${alignMap[align]};
    gap: ${gap}px;
    flex-wrap: ${wrap ? "wrap" : "nowrap"};
}
`;
}

export function Flex(props: FlexProps) {
    const hash = hashProps(props);
    const className = `readit-flex-${hash}`;

    const css = generateFlexCSS(className, props);

    ensureStyles(css);

    return (
        <div attr:class={`${className}${props.class ? ` ${props.class}` : ""}`}>
            {props.children}
        </div>
    );
}
