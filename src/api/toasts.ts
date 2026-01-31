import { ToastLevels } from "@/plugins/_core/Toasts";
import { expose } from "./expose";

type ToastLevel = "info" | "success" | "warning" | "error";
type Toast = {
    level?: ToastLevel;
    message: string;
    duration?: number;
};

type ToastController = HTMLElement & {
    triggerToast: (toast: {
        level: number;
        message: string;
        meta?: { duration?: number };
    }) => void;
};

const toastQueue: Toast[] = [];
let toastsPushed = false;
let toastController: ToastController;

function sendToast(toast: Toast) {
    toastController.triggerToast({
        // Level has no effect on toasts (only banners), but we set it as it's expected.
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

    toastController = document.querySelector("alert-controller");
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
