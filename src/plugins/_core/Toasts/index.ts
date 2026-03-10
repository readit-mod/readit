import {
    filters as elementFilters,
    findChild,
    findInElementTree,
    waitForElement,
} from "@api/elements";
import { chain } from "@api/filters";
import { defineCorePlugin } from "@api/plugins";
import { pushQueuedToasts, type RawToast, ToastLevels } from "@api/toasts";
import { addSingleListener } from "@api/utils/events";

export default defineCorePlugin({
    name: "Toasts",
    id: "readit.toasts",
    version: "1.0.0",

    patches: [
        {
            find: "this.handleToast=",
            replacement: [
                {
                    match: /this.handleToast=(\i)=>{const /,
                    replace: "$&details=$1.detail,",
                },
                {
                    match: /([;,])this\.appendChild\((\i)\)/,
                    replace: "$1$self.handleToast(details, $2)$&",
                },

                /*
                 * Reddit doesn't dismiss error toasts even when the duration
                 * is set, probably so users don't miss important error messages.
                 * But if the duration was set, obviously the developer expects
                 * the toast to be dimissed.
                 */
                {
                    match: /(\i)&&\1.+disableAutoDismiss(?=.{0,40}(\i)\?\.duration)/,
                    replace: "($2?.duration||($&))",
                },
            ],
        },
    ],

    handleToast(detail: RawToast, toast: HTMLElement) {
        const { level = 6, meta, readit = {} } = detail;
        const [background, foreground] = getColorVariables(level);

        toast.style.backgroundColor = `var(${background})`;
        toast.style.color = `var(${foreground})`;

        // Fix dismiss button colors.
        applyDismissButtonFixes(toast, level, [
            background,
            foreground,
        ]);

        // Fix icon positioning issues.
        applyToastIconFix(toast);

        // Apply our custom toast stuff.
        applyReadItStuff(toast, readit);
    },

    start() {
        waitForElement(() =>
            document.querySelector("alert-controller")?.shadowRoot?.querySelector("toaster-lite"),
        ).then(() => {
            setTimeout(pushQueuedToasts, 0);
        });
    },
});

function getColorVariables(level: number): [
    string,
    string,
] {
    switch (ToastLevels[level]) {
        case "error":
            return [
                "--color-banner-error",
                "--color-banner-error-text",
            ];
        case "warning":
            return [
                "--color-banner-caution",
                "--color-banner-caution-text",
            ];
        case "success":
            return [
                "--color-banner-success",
                "--color-banner-success-text",
            ];
        default:
            return [
                "--color-banner-plain",
                "--color-banner-plain-text",
            ];
    }
}

function applyDismissButtonFixes(
    toast: HTMLElement,
    level: number,
    colorVariables: [
        string,
        string,
    ],
) {
    const dismissButtonContainer = findInElementTree<HTMLDivElement>(
        toast,
        elementFilters.byAttribute("slot", "action"),
    );

    if (!dismissButtonContainer) return;

    const dismissButton = findChild<HTMLButtonElement>(
        dismissButtonContainer,
        elementFilters.byTagName("button"),
    );

    if (!dismissButton) return;

    // Fix button hover color.
    if (ToastLevels[level] !== "info") {
        dismissButton.style.setProperty(
            "--button-color-background-hover",
            `color-mix(in srgb, var(${colorVariables[0]}) 100%, #FFFFFF 50%)`,
        );
    } else {
        dismissButton.classList.remove("button-plain-inverted");
        dismissButton.classList.add("button-plain");
    }

    const dismissButtonImageContainer = findChild<HTMLSpanElement>(
        dismissButton,
        chain.all(
            elementFilters.byTagName("span"),
            elementFilters.byClasses("flex", "items-center", "justify-center"),
        ),
    );
    if (!dismissButtonImageContainer) return;

    dismissButtonImageContainer.style.color = `var(${colorVariables[1]})`;
}

function applyToastIconFix(toast: HTMLElement) {
    const iconContainer = findInElementTree<HTMLDivElement>(
        toast,
        elementFilters.byAttribute("slot", "icon"),
    );

    if (!iconContainer) return;

    iconContainer.style.display = "flex";
}

function applyReadItStuff(toast: HTMLElement, readit: RawToast["readit"]) {
    if (readit.click) {
        addSingleListener(toast, "click", readit.click);
        toast.classList.add("cursor-pointer");
    }
}

type ToastEvent = CustomEvent<RawToast>;
