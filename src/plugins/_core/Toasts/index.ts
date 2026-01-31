import { chain } from "@api/filters";
import { defineCorePlugin, PluginLifeCycle } from "@api/plugins";
import { LitModuleID } from "@modules/common/lit";
import { filters, find } from "@modules/loader/lookup";
import { filters as exportFilters } from "@api/filters";
import { mapMangledModule } from "@modules/utils";
import { InternalModule } from "@modules/types";
import { pushQueuedToasts } from "@api/toasts";
import { waitForElement } from "@api/elements";

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
    },
    stop() {},
});
