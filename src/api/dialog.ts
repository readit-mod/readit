import { Icon, Icons, IconSizes } from "@assets/icons";
import { html, nothing } from "@modules/common/lit";
import type { LitElement, TemplateResult } from "lit";
import { expose } from "./expose";
import { DOMify } from "./utils/lit";
import { createCustomCssSheet } from "./customcss";

function CloseButton(onClick: () => void): TemplateResult<1> {
    return html`
        <button
            rpl=""
            aria-label="Close dialog"
            class="button-small px-[calc(var(--rem10)-var(--button-border-width,0px))] button-secondary icon items-center justify-center button inline-flex"
            @click="${() => onClick()}"
            slot="close-button"
        >
            <span class="flex items-center justify-center">
                <span class="flex">
                    ${Icon(Icons.Close, {
                        size: IconSizes.Small,
                    })}
                </span>
            </span>
        </button>
    `;
}

const Button = (
    text: string,
    type = "primary",
    onClick: () => void,
    slot?: string,
) =>
    html`<button
        @click="${() => onClick()}"
        class="button-medium px-[calc(var(--rem12)-var(--button-border-width,0px))] button-${type} items-center justify-center button inline-flex"
        slot="${slot ?? ""}"
    >
        ${text}
    </button>`;

type Dialog = {
    title: string;
    appearance?: "normal" | "modal";
    beforeCloseButton?: () => void;
    buttons?: {
        primary?: {
            text: string;
            onClick: (onClose: () => void) => void;
        };
        secondary?: {
            text: string;
            onClick: (onClose: () => void) => void;
        };
        tertiary?: {
            text: string;
            onClick: (onClose: () => void) => void;
        };
    };
    size?: {
        width: string;
        height: string;
    };
    content: string | TemplateResult;
};

const modalStyle = createCustomCssSheet("modal", "");
modalStyle.insertRule(`
    .readit-modal-card[appearance=modal] {
        width: min(95vw, 440px);
        max-height: min(660px, 90vh);
    }
`);

function buildDialog(dialog: Dialog, close: () => void): TemplateResult {
    const onClose = () => {
        dialog.beforeCloseButton?.();
        close();
    };

    const buttonConfig: Dialog["buttons"] = {
        primary: {
            text: "Done",
            onClick: close,
        },
        ...dialog.buttons,
    };

    const buttons = html`
        ${buttonConfig.primary
            ? Button(
                  buttonConfig.primary.text,
                  "primary",
                  buttonConfig.primary.onClick.bind(null, close),
                  "primary-button",
              )
            : nothing}
        ${buttonConfig.secondary
            ? Button(
                  buttonConfig.secondary.text,
                  "secondary",
                  buttonConfig.secondary.onClick.bind(null, close),
                  "secondary-button",
              )
            : nothing}
        ${buttonConfig.tertiary
            ? Button(
                  buttonConfig.tertiary.text,
                  "tertiary",
                  buttonConfig.tertiary.onClick.bind(null, close),
                  "tertiary-button",
              )
            : nothing}
    `;

    return html`
        <rpl-modal-card
            style="width: ${dialog.size?.width ?? "auto"}; height: ${dialog.size
                ?.height ?? "auto"}"
            appearance="${dialog.appearance ?? "normal"}"
            class="readit-modal-card"
        >
            ${CloseButton(onClose)}
            <div slot="title">${dialog.title}</div>
            ${typeof dialog.content == "string"
                ? html`<p>${dialog.content}</p>`
                : dialog.content}
            ${buttons}
        </rpl-modal-card>
    `;
}

type RPLDialog = LitElement & {
    hide: () => void;
    showModal: () => Promise<void>;
};

export function showDialog(id: string, dialogResult: TemplateResult) {
    const container = document.querySelector("shreddit-app");

    const modal = container.appendChild(
        DOMify(
            html`<rpl-dialog
                dialog-id="${id}"
                blocking
                .litTemplateChildren=${dialogResult}
            ></rpl-dialog>`,
        ) as RPLDialog,
    );

    modal.showModal();
    return modal;
}

type SimpleDialog = {
    title: string;
    id: string;
    content: string | TemplateResult;
    beforeCloseButton?: () => void;
    buttons?: Dialog["buttons"];
    size?: Dialog["size"];
};

export function showSimpleDialog(dialog: SimpleDialog) {
    const dialogResult = buildDialog(
        {
            ...dialog,
            appearance: "modal",
        },
        () => {
            modal.hide();
            modal.remove();
        },
    );

    const modal = showDialog(dialog.id, dialogResult);
}

type ConfirmationDialog = {
    title: string;
    description?: string;
    id: string;
    onResult: (result: boolean) => void;
};

export function showConfirmationDialog(dialog: ConfirmationDialog) {
    const { title, description = "Yes or no?", id, onResult } = dialog;

    showSimpleDialog({
        title,
        id,
        content: description,
        beforeCloseButton() {
            onResult(false);
        },
        buttons: {
            primary: {
                text: "Yes",
                onClick(close) {
                    onResult(true);
                    close();
                },
            },
            secondary: {
                text: "No",
                onClick(close) {
                    onResult(false);
                    close();
                },
            },
        },
    });
}

expose(
    { showDialog, showSimpleDialog, showConfirmationDialog },
    "readit.api.dialog",
);
