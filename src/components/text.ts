import { defineSafeElement } from "@api/elements";
import { html, LitElement } from "@modules/common/lit";
import type { TemplateResult } from "lit";
import { property } from "lit/decorators.js";

type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | number;

type TextStyle = "normal" | "italic" | "bold";

type TextVariant = `${TextSize}/${TextStyle}`;

const Sizes: { [key in TextSize]: string } = {
    xs: "12px",
    sm: "14px",
    md: "18px",
    lg: "22px",
    xl: "32px",
};

const Styles: { [key in TextStyle]: string } = {
    normal: "",
    italic: "font-style:italic;",
    bold: "font-weight:bold;",
};

export function Text(text: string, variant: TextVariant = "sm/normal") {
    return html`
        <readit-text variant="${variant}">${text}</readit-text>
    `;
}

defineSafeElement("readit-text", () => {
    class Typography extends LitElement {
        @property({
            type: String,
        })
        variant = "sm/normal";

        protected render(): TemplateResult {
            const [size, style] = this.variant.split("/") as [
                TextSize,
                TextStyle,
            ];

            const sizePx = size in Sizes ? Sizes[size] : `${size}px`;

            return html`
                <span style="font-size:${sizePx};${Styles[style]}">
                    <slot></slot>
                </span>
            `;
        }
    }

    return Typography;
});
