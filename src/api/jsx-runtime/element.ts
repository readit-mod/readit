import { ref } from "lit/directives/ref.js";
import { html, unsafeStatic } from "lit/static-html.js";
import { spreadProps } from "./props";

export function createElement(type: string, { children, ...props }: Record<string, any>) {
    const tagName = unsafeStatic(type);

    return html`
        <${tagName}
            ${ref(props.ref)}
            ${spreadProps(props)}
        >
            ${children}
        </${tagName}>
    `;
}
