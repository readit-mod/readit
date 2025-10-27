import { definePlugin } from "@/lib/plugin";
import { meta } from "@/lib/meta";
import { TileProps } from "@/lib/types";
import { withNativeAsync } from "@/lib/native";

export default definePlugin({
    name: "ReadIt DevTools",
    description: "Adds some tools for developers.",
    id: "readit-devtools",
    version: "1.0.0",

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
            ...((await withNativeAsync(async () => {
                return [
                    {
                        title: "Current Bundle URL",
                        description:
                            await window.ReadItNative.bundle.getBundleURL(),
                    },
                    {
                        title: "Change ReadIt Bundle URL (DANGEROUS)",
                        description:
                            "Change where ReadIt Desktop gets the bundle from, can cause errors.",
                        async onClick() {
                            // settings.goTo("change-bundle");

                            let newBundle = await prompt(
                                "New Bundle URL",
                                await window.ReadItNative.bundle.getBundleURL(),
                            );
                            if (newBundle) {
                                await window.ReadItNative.bundle.setBundleURL(
                                    newBundle,
                                );
                                alert("Please restart to apply changes.");
                            }
                        },
                    },
                    {
                        title: "Reset ReadIt Bundle URL",
                        description:
                            "Reset where ReadIt Desktop gets the bundle.",
                        onClick() {
                            window.ReadItNative.bundle.resetBundleURL();
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

        cleanup(() => {
            unregisterFns.forEach((f) => f());
        });
    },
});
