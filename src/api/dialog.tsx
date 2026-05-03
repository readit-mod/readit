import { render } from "@modules/common/lit";
import type { TemplateResult } from "lit";
import { createRef } from "lit/directives/ref.js";
import { Button, IconButton } from "@/components/button";
import { ensureStyles } from "./css";
import styles from "./dialog.css";
import { expose } from "./expose";
import type { TypedLitElement } from "./utils/element";

function CloseButton({ onClick }): TemplateResult<1> {
    return (
        <IconButton
            size="sm"
            variant="tertiary"
            icon="Close"
            onClick={onClick}
            attr:slot="close-button"
        />
    );
}

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

ensureStyles(styles);

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

    const buttons = (
        <>
            {buttonConfig.primary && (
                <IconButton
                    onClick={buttonConfig.primary.onClick.bind(null, close)}
                    icon="Info"
                    attr:slot="primary-button"
                >
                    {buttonConfig.primary.text}
                </IconButton>
            )}
            {buttonConfig.secondary && (
                <Button
                    variant="secondary"
                    onClick={buttonConfig.secondary.onClick.bind(null, close)}
                    attr:slot="secondary-button"
                >
                    {buttonConfig.secondary.text}
                </Button>
            )}
            {buttonConfig.tertiary && (
                <Button
                    variant="tertiary"
                    onClick={buttonConfig.tertiary.onClick.bind(null, close)}
                    attr:slot="tertiary-button"
                >
                    {buttonConfig.tertiary.text}
                </Button>
            )}
        </>
    );

    return (
        <rpl-modal-card
            attr:style={`width: ${dialog.size?.width ?? "auto"}; height: ${
                dialog.size?.height ?? "auto"
            }`}
            attr:appearance={dialog.appearance ?? "normal"}
            attr:class="readit-modal-card"
        >
            <CloseButton onClick={onClose} />
            <div attr:slot="title">{dialog.title}</div>
            <rpl-scrollbox>
                {typeof dialog.content === "string" ? (
                    <p>{dialog.content}</p>
                ) : (
                    dialog.content
                )}
            </rpl-scrollbox>
            {buttons}
        </rpl-modal-card>
    );
}

type RPLDialog = TypedLitElement<{
    hide: () => void;
    showModal: () => Promise<void>;
}>;

export function showDialog(id: string, dialogResult: TemplateResult) {
    const shredditApp = document.querySelector("shreddit-app");
    const container = shredditApp.appendChild(document.createElement("div"));
    const sheetRef = createRef<RPLDialog>();

    const content = (
        <rpl-dialog-sheet
            attr:dialog-id={id}
            ref={sheetRef}
            litTemplateChildren={dialogResult}
        ></rpl-dialog-sheet>
    );

    render(content, container as HTMLElement);

    setTimeout(() => sheetRef.value?.showModal(), 0);

    return sheetRef.value;
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
            setTimeout(() => modal.remove(), 0);
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
    {
        showDialog,
        showSimpleDialog,
        showConfirmationDialog,
    },
    "readit.api.dialog",
);
