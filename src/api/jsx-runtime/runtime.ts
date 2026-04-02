import { createElement } from "./element";

function jsx(type, props) {
    if (typeof type === "function") {
        return type(props);
    }

    return createElement(type, props);
}

type SpecialProps = {
    [K in `attr:${string}`]?: any;
} & {
    [K in `bool:${string}`]?: boolean;
} & {
    [K in `on:${string}`]?: (e: Event) => void;
};

declare namespace JSX {
    interface IntrinsicElements {
        [key: string]: SpecialProps;
    }
}

export { jsx, jsx as jsxs };
