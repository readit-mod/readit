import { expose } from "./expose";

type ToastLevel = "info" | "success" | "warning" | "error";
type Toast = {
    level?: ToastLevel;
    message: string;
    duration?: number;
};

// Directly from Reddit's exports, we only use these out of the 10.
export enum ToastLevels {
    error = 3,
    warning = 4,
    info = 6,
    success = 7,
}

export type AlertController = HTMLElement & {
    triggerToast: (toast: {
        level: number;
        message: string;
        meta?: { duration?: number };
    }) => void;
    toaster?: HTMLElement;
};

const toastQueue: Toast[] = [];
let toastsPushed = false;
let alertController: AlertController;

function sendToast(toast: Toast) {
    alertController.triggerToast({
        level: ToastLevels[toast.level ?? "info"],
        message: toast.message,
        ...(toast.duration && {
            meta: {
                duration: toast.duration,
            },
        }),
    });
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
