import { Icon, IconSizes, ReadItIcon } from "@assets/icons";
import type { TemplateResult } from "lit";
import { expose } from "./expose";
import type { TypedLitElement } from "./utils/element";

type ToastLevel = "info" | "success" | "warning" | "error";
type Toast = {
    level?: ToastLevel;
    message: string;
    duration?: number;
    icon?: TemplateResult;
    click?: () => void;
    raw?: {
        [key: string]: any;
    };
};

export type RawToast = {
    level: number;
    message: string;
    meta?: {
        duration?: number;
    };
    namedContent?: {
        icon?: TemplateResult;
    };
    readit?: {
        click?: () => void;
    };
    [key: string]: any;
};

// Directly from Reddit's exports, we only use these out of the 10.
export enum ToastLevels {
    error = 3,
    warning = 4,
    info = 6,
    success = 7,
}

export type AlertController = TypedLitElement<{
    triggerToast: (toast: RawToast) => void;
    toaster?: HTMLElement;
}>;

const toastQueue: Toast[] = [];
let toastsPushed = false;

function sendToast(toast: Toast) {
    const alertController = document.querySelector("alert-controller") as AlertController;

    const rawToast: RawToast = {
        level: ToastLevels[toast.level ?? "info"],
        message: toast.message,
    };

    if (toast.duration) {
        rawToast.meta = {
            duration: toast.duration,
        };
    }

    if (toast.icon) {
        rawToast.namedContent = {
            icon: toast.icon,
        };
    } else {
        rawToast.namedContent = {
            // So its obvious it came from ReadIt.
            icon: Icon(ReadItIcon, {
                size: IconSizes.Toast,
            }),
        };
    }

    if (toast.click) {
        rawToast.readit = {
            click: toast.click,
        };
    }

    alertController.triggerToast(rawToast);
}

// FIXME: broken due to timing
export function pushQueuedToasts() {
    if (toastsPushed) return;
    toastsPushed = true;

    for (const toast of toastQueue) {
        sendToast(toast);
    }
}

export function showToast(toast: Toast) {
    if (!toastsPushed) {
        toastQueue.push(toast);
    } else {
        sendToast(toast);
    }
}

expose(
    {
        showToast,
    },
    "readit.api.toasts",
);
