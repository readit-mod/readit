type SvgObjectNode = {
    tag: string;
    attrs?: Record<string, string | number | boolean>;
    children?: SvgNode[];
};

type SvgNode = SvgObjectNode | string;

type IconDefinition = {
    viewBox: string;
    nodes: SvgNode[];
};

type IconOptions = {
    size?: number;
    color?: string;
    styles?: string;
};
