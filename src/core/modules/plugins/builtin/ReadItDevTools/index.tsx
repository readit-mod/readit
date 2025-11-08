import { definePlugin } from "@/lib/plugin";
import { meta } from "@/lib/meta";
import { TileProps } from "@/lib/types";
import { withNativeAsync } from "@/lib/native";
import { TestErrorBoundary } from "./TestErrorBoundary";

export default definePlugin({
    name: "ReadIt DevTools",
    description: "Adds some tools for developers.",
    id: "readit-devtools",
    version: "1.0.0",

    settings: [
        {
            title: "Test Toggle Setting",
            description: "A test of the toggle setting type.",
            id: "test-toggle",
            type: "toggle",
            default: true,
        },
        {
            title: "Test Input Setting",
            description: "A test of the input setting type.",
            id: "test-input",
            type: "input",
            default: "test",
        },
    ],

    async onLoad({ settings, cleanup }) {
        let devtoolsSettings: TileProps[] = [
            {
                title: "ReadIt Loader Version",
                description: meta.loaderVersion,
            },
            {
                title: "ReadIt Platform",
                description: meta.platform,
            },
            {
                title: "Test Error Boundary",
                description:
                    "Test if the error boundary catches render errors.",
                onClick: () => settings.goTo("test-error-boundary"),
            },
            ...((await withNativeAsync(async () => {
                return [
                    {
                        title: "Current Bundle Manifest URL",
                        description:
                            await window.ReadItNative.bundle.getManifestURL(),
                    },
                    {
                        title: "Change ReadIt Bundle URL (DANGEROUS)",
                        description:
                            "Change where ReadIt Desktop gets the bundle manifest from, can cause errors.",
                        async onClick() {
                            // settings.goTo("change-bundle");

                            let newBundle = await prompt(
                                "New Bundle URL",
                                await window.ReadItNative.bundle.getManifestURL(),
                            );
                            if (newBundle) {
                                await window.ReadItNative.bundle.setManifestURL(
                                    newBundle,
                                );
                                alert("Please restart to apply changes.");
                            }
                        },
                    },
                    {
                        title: "Reset ReadIt Bundle URL",
                        description:
                            "Reset where ReadIt Desktop gets the bundle manifest.",
                        onClick() {
                            window.ReadItNative.bundle.resetManifestURL();
                            alert(
                                "You should restart ReadIt Desktop to apply changes.",
                            );
                        },
                    },
                ];
            })) ?? []),
        ];

        const unregisterFns: (() => void)[] = [];

        unregisterFns.push(
            settings.registerSettingsPage({
                id: "devtools",
                title: "Devtools",
                items: devtoolsSettings,
            }),
        );

        unregisterFns.push(
            settings.registerNavigationTile({
                title: "ReadIt Devtools",
                description: "Some tools useful for developers.",
                icon: "🛠️",
                id: "devtools",
            }),
        );

        unregisterFns.push(
            settings.registerSettingsPage({
                id: "test-error-boundary",
                title: "Test Error Boundary",
                pageComponent: () => <TestErrorBoundary />,
            }),
        );

        cleanup(() => {
            unregisterFns.forEach((f) => f());
        });
    },
});
