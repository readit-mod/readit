import { expose } from "@api/expose";
import { Icon, IconSizes } from "@assets/icons";
import { html, nothing } from "@modules/common/lit";
import type { LitElement, TemplateResult } from "lit";

function updateInstances() {
    document.querySelectorAll<LitElement>("shreddit-post").forEach((i) => {
        i.requestUpdate();
    });
}

type PostButtonConfig = {
    icon?: IconDefinition;
    predicate?: (post: LitElement) => boolean;
    label: string;
    onClick: (id: string) => void;
};

const postButtons: PostButtonConfig[] = [];

export function addPostButton(buttonConfig: PostButtonConfig): () => void {
    postButtons.push(buttonConfig) - 1;

    updateInstances();
    return () => {
        const idx = postButtons.indexOf(buttonConfig);

        if (idx !== -1) {
            postButtons.splice(idx, 1);
            updateInstances();
        }
    };
}

export function getButtonsForPost(post: LitElement): PostButtonConfig[] {
    return postButtons.filter((button) => (button.predicate ? button.predicate(post) : true));
}

export function getButtonResult(id: string, button: PostButtonConfig): TemplateResult<1> {
    return html`
        <button class="button border-md overflow-visible flex flex-row justify-center items-center h-xl font-semibold relative text-caption-1 button-secondary  inline-flex items-center px-sm" style="height: var(--size-button-sm-h); font: var(--font-button-sm)" type="button" @click=${() => button.onClick?.(id)}>
            <span class="flex items-center">
                
                    ${
                        button.icon
                            ? html`
                                <span class="flex text-body-1 me-[var(--rem6)]">
                                    ${Icon(button.icon, {
                                        size: IconSizes.Small,
                                    })}
                                </span>
                              `
                            : nothing
                    }
                <span> ${button.label} </span> 
            </span>
        </button>
    `;
}

expose(
    {
        addPostButton,
    },
    "readit.api.patches.postButtons",
);
