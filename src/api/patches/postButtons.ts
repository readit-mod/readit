import { expose } from "@api/expose";
import { Icon, IconSizes } from "@assets/icons";
import { html, nothing } from "@modules/common/lit";
import type { LitElement, SVGTemplateResult, TemplateResult } from "lit";

// TODO: actually type shreddit-post and shreddit-post-overflow-menu elements

function updateInstances(element: string) {
    document.querySelectorAll<LitElement>(element).forEach((i) => {
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

export function addPostActionButton(
    buttonConfig: PostButtonConfig,
): () => void {
    postButtons.push(buttonConfig) - 1;

    updateInstances("shreddit-post");
    return () => {
        const idx = postButtons.indexOf(buttonConfig);

        if (idx !== -1) {
            postButtons.splice(idx, 1);
            updateInstances("shreddit-post");
        }
    };
}

export function getActionButtonsForPost(post: LitElement): PostButtonConfig[] {
    return postButtons.filter((button) => button.predicate?.(post) ?? true);
}

export function getButtonResult(
    id: string,
    button: PostButtonConfig,
): TemplateResult<1> {
    return html`
        <button
            class="button border-md overflow-visible flex flex-row justify-center items-center h-xl font-semibold relative text-caption-1 button-secondary  inline-flex items-center px-sm"
            style="height: var(--size-button-sm-h); font: var(--font-button-sm)"
            type="button"
            @click=${() => button.onClick?.(id)}
        >
            <span class="flex items-center">
                ${button.icon
                    ? html`
                          <span class="flex text-body-1 me-[var(--rem6)]">
                              ${Icon(button.icon, {
                                  size: IconSizes.Small,
                              })}
                          </span>
                      `
                    : nothing}
                <span> ${button.label} </span>
            </span>
        </button>
    `;
}

export type InternalOverflowMenuItem = {
    id: string;
    label: string;
    leadingIconRenderer: () => SVGTemplateResult;
    isUserEligible: () => boolean;
    onClick: () => void;
    href?: string;
    description?: string;
    disabled?: boolean;
};

export type OverflowMenuItem = {
    id: string;
    label: string;
    description?: string;
    icon: IconDefinition;
    predicate?: (post: LitElement) => boolean;
    onClick: (post: LitElement) => void;
};

const overflowMenuItems: OverflowMenuItem[] = [];

export function addOverflowMenuItem(item: OverflowMenuItem): () => void {
    overflowMenuItems.push(item);
    updateInstances("shreddit-post-overflow-menu");

    return () => {
        const idx = overflowMenuItems.indexOf(item);

        if (idx !== 0) {
            overflowMenuItems.splice(idx, 1);
            updateInstances("shreddit-post-overflow-menu");
        }
    };
}

export function getOverflowMenuItems(
    menu: LitElement,
): InternalOverflowMenuItem[] {
    const post = (menu as any).getParentPost();

    return overflowMenuItems.map((item) => {
        return {
            id: item.id,
            label: item.label,
            description: item.description,
            leadingIconRenderer: () =>
                Icon(item.icon, {
                    size: IconSizes.Medium,
                }),
            isUserEligible: () => item.predicate?.(post) ?? true,
            onClick() {
                item.onClick(post);
            },
        };
    });
}

expose(
    {
        addPostButton: addPostActionButton,
        addOverflowMenuItem,
    },
    "readit.api.patches.postButtons",
);
