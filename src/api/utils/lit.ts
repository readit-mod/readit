import { expose } from "@api/expose";
import { render } from "@modules/common/lit";
import type { TemplateResult } from "lit";

export function DOMify(template: TemplateResult): HTMLElement {
    const container = document.createElement("div");

    render(template, container);

    return container.firstElementChild as HTMLElement;
}

expose({ DOMify }, "readit.api.utils.lit");
