import { chain } from "@api/filters";
import { defineCorePlugin, PluginLifeCycle } from "@api/plugins";
import { LitModuleID } from "@modules/common/lit";
import { filters, find } from "@modules/loader/lookup";
import { filters as exportFilters } from "@api/filters";
import { mapMangledModule } from "@modules/utils";
import { InternalModule } from "@modules/types";
import { AlertController, pushQueuedToasts } from "@api/toasts";
import { waitForElement } from "@api/elements";
import { createPatcher } from "@api/patcher";

type ToastLevel = "info" | "success" | "warning" | "error";

type ToastLevelEnum = {
    [key in ToastLevel]: number;
};

export let ToastLevels: ToastLevelEnum;

export default defineCorePlugin({
    name: "Toasts",
    id: "readit.toasts",
    version: "1.0.0",
    lifeCycle: PluginLifeCycle.ModulesReady,
    start() {
        // It's unclear what this module really is, but it contains the enum which has toast levels.
        const Module = find(
            chain.all(
                filters.byAsyncFactory(true),
                filters.byCode("info", "alert", "error", "directive"),
                filters.byDependecies([LitModuleID]),
                filters.byHasExports(true),
            ),
            {
                key: "toasts-module",
            },
        ) as InternalModule;

        const exports: { ToastLevels: ToastLevelEnum } = mapMangledModule(
            Module,
            {
                ToastLevels: exportFilters.byProps(
                    "info",
                    "success",
                    "warning",
                    "error",
                ),
            },
        );

        ToastLevels = exports.ToastLevels;
        waitForElement(() =>
            document
                .querySelector("alert-controller")
                ?.shadowRoot?.querySelector("toaster-lite"),
        ).then(pushQueuedToasts);

        /*
         * Before, the toast even recieved a level property but it would
         * not be used at all as it was probably a side effect of toasts
         * and banners being the same type (I'm guessing). To improve
         * this, here, we listen for new toasts and apply the appropriate
         * colors based on the level which is passed in.
         */
        document.addEventListener("show-toast", (event: ToastEvent) => {
            const alertController = event.target as AlertController;
            const toast = alertController.toaster
                ?.lastElementChild as HTMLElement;
            if (!toast) return;

            const { level = 1 } = event.detail;
            const levelString = Object.keys(ToastLevels).find(
                (key) => ToastLevels[key as ToastLevel] === level,
            ) as ToastLevel;
            let colorVariables: string[];

            switch (levelString) {
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
                        "--color-banner-plain-inverted",
                        "--color-banner-plain-inverted-text",
                    ];
                    break;
            }

            toast.style.backgroundColor = `var(${colorVariables[0]})`;
            toast.style.color = `var(${colorVariables[1]})`;
        });
    },
    stop() {},
});

type ToastEvent = CustomEvent<{
    level: number;
    message: string;
    meta?: {
        duration?: number;
    };
}>;
