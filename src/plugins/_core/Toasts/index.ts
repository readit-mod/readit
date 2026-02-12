import {
    filters as elementFilters,
    findChild,
    findInElementTree,
    waitForElement,
} from "@api/elements";
import { chain } from "@api/filters";
import { defineCorePlugin, PluginLifeCycle } from "@api/plugins";
import { AlertController, pushQueuedToasts, ToastLevels } from "@api/toasts";

export default defineCorePlugin({
    name: "Toasts",
    id: "readit.toasts",
    version: "1.0.0",
    lifeCycle: PluginLifeCycle.ModulesReady,
    start() {
        waitForElement(() =>
            document
                .querySelector("alert-controller")
                ?.shadowRoot?.querySelector("toaster-lite"),
        ).then(pushQueuedToasts);

        document.addEventListener("show-toast", (event: ToastEvent) => {
            // #region Style the toast according to its level.

            /*
             * Before, the toast even recieved a level property but it would
             * not be used at all as it was probably a side effect of toasts
             * and banners being the same type (I'm guessing). To improve
             * this, here, we listen for new toasts and apply the appropriate
             * colors based on the level which is passed in.
             */
            const alertController = event.target as AlertController;
            const toast = alertController.toaster
                ?.lastElementChild as HTMLElement;
            if (!toast) return;

            const { level = 1, meta } = event.detail;
            let colorVariables: string[];

            switch (ToastLevels[level]) {
                case "error":
                    colorVariables = [
                        "--color-banner-error",
                        "--color-banner-error-text",
                    ];
                    break;
                case "warning":
                    colorVariables = [
                        "--color-banner-caution",
                        "--color-banner-caution-text",
                    ];
                    break;
                case "success":
                    colorVariables = [
                        "--color-banner-success",
                        "--color-banner-success-text",
                    ];
                    break;
                case "info":
                default:
                    colorVariables = [
                        "--color-banner-plain",
                        "--color-banner-plain-text",
                    ];
                    break;
            }

            toast.style.backgroundColor = `var(${colorVariables[0]})`;
            toast.style.color = `var(${colorVariables[1]})`;

            //#endregion

            //#region Fix dismiss button colors.

            const dismissButtonContainer = findInElementTree(
                toast,
                elementFilters.byAttribute("slot", "action"),
            );

            if (!dismissButtonContainer) return;

            const dismissButton = findChild(
                dismissButtonContainer,
                chain.all(elementFilters.byTagName("button")),
            ) as HTMLButtonElement;

            // Fix button hover color.
            if (ToastLevels[level] != "info") {
                dismissButton?.style.setProperty(
                    "--button-color-background-hover",
                    `color-mix(in srgb, var(${colorVariables[0]}) 100%, #FFFFFF 50%)`,
                );
            } else {
                dismissButton?.classList.remove("button-plain-inverted");
                dismissButton?.classList.add("button-plain");
            }

            const dismissButtonImageContainer = findChild(
                dismissButton,
                chain.all(
                    elementFilters.byTagName("span"),
                    elementFilters.byClasses(
                        "flex",
                        "items-center",
                        "justify-center",
                    ),
                ),
            ) as HTMLElement;
            if (!dismissButtonImageContainer) return;

            dismissButtonImageContainer.style.color = `var(${colorVariables[1]})`;

            // #endregion

            //#region Dismiss error toasts if duration was explicitly set.
            /*
             * Reddit doesn't dismiss error toasts even when the duration
             * is set, probably so users don't miss important error messages.
             * But if the duration was set, obviously the developer expects
             * the toast to be dimissed.
             */
            if (meta?.duration && ToastLevels[level] === "error") {
                setTimeout(() => {
                    toast.setAttribute("_fading", "");
                }, meta.duration);
            }

            //#endregion
        });
    },
});

type ToastEvent = CustomEvent<{
    level: number;
    message: string;
    meta?: {
        duration?: number;
    };
}>;
