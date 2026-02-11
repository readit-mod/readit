import { expose } from "@api/expose";
import { svg } from "@modules/common/lit";
import type { SVGTemplateResult } from "lit";

function renderNode(node: SvgNode): SVGTemplateResult {
    if (typeof node === "string") return svg`${node}`;

    // Reddit's lit exports have no static directives so we have to trick
    // the `svg` function to take our full string, resulting in this mess.
    function makeRaw(n: SvgNode): string {
        if (typeof n === "string") return n;

        const { tag, attrs = {}, children = [] } = n;
        const attrString = Object.entries(attrs)
            .map(([k, v]) => `${k}="${v}"`)
            .join(" ");

        return `<${tag}${attrString ? " " + attrString : ""}>${children.map(makeRaw).join("")}</${tag}>`;
    }

    const strings = [makeRaw(node)];
    strings["raw"] = strings;

    return svg(strings as unknown as TemplateStringsArray);
}

export function Icon(
    definition: IconDefinition,
    options: IconOptions = {},
): SVGTemplateResult {
    const { size = 24, color = "currentColor", styles = "" } = options;

    return svg`
        <svg
            viewBox="${definition.viewBox}"
            width="${size}"
            height="${size}"
            fill="${color}"
            style="${styles}"
        >
            ${definition.nodes.map(renderNode)}
        </svg>
    `;
}

export function svgToIcon(svg: string): IconDefinition {
    const parsedSvg = new DOMParser()
        .parseFromString(svg, "image/svg+xml")
        .children.item(0) as SVGElement;
    const icon: IconDefinition = {
        viewBox: parsedSvg.getAttribute("viewBox"),
        nodes: convertChildren(parsedSvg),
    };

    return icon;
}

function convertChildren(element: Element): SvgNode[] {
    return Array.from(element.childNodes).map((node) => {
        if (node.nodeType === 3) return (node as Text).data.trim();

        const attributes = Array.from((node as Element).attributes).reduce<
            Record<string, string>
        >((acc, attr) => {
            acc[attr.name] = attr.value;
            return acc;
        }, {});

        return {
            tag: (node as Element).tagName,
            attrs: attributes,
            children: convertChildren(node as Element),
        };
    });
}

expose({ Icon, svgToIcon }, "readit.api.icons.nodes");
