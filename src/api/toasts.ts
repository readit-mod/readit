import type { TemplateResult } from "lit";
import { expose } from "./expose";

type ToastLevel = "info" | "success" | "warning" | "error";
type Toast = {
    level?: ToastLevel;
    message: string;
    duration?: number;
    icon?: TemplateResult;
    raw?: {
        [key: string]: any;
    };
};

type RawToast = {
    level: number;
    message: string;
    meta?: { duration?: number };
    namedContent?: {
        icon?: TemplateResult;
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

export type AlertController = HTMLElement & {
    triggerToast: (toast: RawToast) => void;
    toaster?: HTMLElement;
};

const toastQueue: Toast[] = [];
let toastsPushed = false;
let alertController: AlertController;

function sendToast(toast: Toast) {
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
    }

    alertController.triggerToast(rawToast);
}

export function pushQueuedToasts() {
    if (toastsPushed) return;
    toastsPushed = true;

    alertController = document.querySelector("alert-controller");
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
