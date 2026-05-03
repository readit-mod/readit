import { defineSafeElement } from "@api/elements";
import { classNameFactory, clsx } from "@api/utils/classes";
import { LitElement } from "@modules/common/lit";
import type { TemplateResult } from "lit";
import { property } from "lit/decorators.js";

type TextSize =
    | "display"
    | "huge-display"
    | "headline"
    | "title-sm"
    | "title-md"
    | "title-lg"
    | "body-sm"
    | "body-md"
    | "label-sm"
    | "label-md"
    | "caption-sm"
    | "caption-md";

type TextStyle = "normal" | "medium" | "semibold" | "bold";
type TextTransform = "uppercase" | "lowercase" | "capitalize";

type TextVariant = `${TextSize}/${TextStyle}`;

const sizeMap: Record<TextSize, string> = {
    display: "display",
    "huge-display": "huge-display",
    headline: "headline",
    "title-sm": "title-3",
    "title-md": "title-2",
    "title-lg": "title-1",
    "body-sm": "body-2",
    "body-md": "body-1",
    "label-sm": "label-2",
    "label-md": "label-1",
    "caption-sm": "caption-2",
    "caption-md": "caption-1",
};

const textClass = classNameFactory("text-");
const fontClass = classNameFactory("font-");

export function Text({
    children,
    variant,
    transform,
    scalable = false,
    onSameLine = false,
}: {
    variant: TextVariant;
    transform?: TextTransform;
    scalable?: boolean;
    onSameLine?: boolean;
    children: string;
}) {
    const [size, style] = variant.split("/") as [TextSize, TextStyle];
    const mappedSize = sizeMap[size];
    const Tag = onSameLine ? "span" : "div";

    return (
        <Tag
            attr:class={clsx(
                fontClass({ [style]: style !== "normal" }),
                textClass(scalable ? `${mappedSize}-scalable` : mappedSize, {
                    [transform ?? ""]: transform !== undefined,
                }),
            )}
        >
            {children}
        </Tag>
    );
}

defineSafeElement("readit-text", () => {
    class Typography extends LitElement {
        @property({
            type: String,
        })
        variant = "body-sm/normal" as TextVariant;

        @property({
            type: String,
        })
        transform = null as TextTransform;

        @property({
            type: Boolean,
        })
        scalable = false;

        @property({
            type: Boolean,
        })
        onSameLine = false;

        protected render(): TemplateResult {
            return (
                <Text
                    variant={this.variant}
                    transform={this.transform}
                    scalable={this.scalable}
                    onSameLine={this.onSameLine}
                >
                    <slot></slot>
                </Text>
            );
        }
    }

    return Typography;
});
