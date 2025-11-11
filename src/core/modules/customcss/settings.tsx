import { CSSEditor } from "@components/CSSEditor";
import { ReadIt } from "@modules/readit";

export function setupCustomCss(readit: ReadIt) {
    let userDefinedCSS = "";

    readit.storage.get("core", "customcss", "").then((css) => {
        userDefinedCSS = css;
        readit.customcss.setRootStyle(userDefinedCSS);
    });

    readit.settings.registerSettingsPage({
        id: "custom-css",
        title: "Custom CSS",
        pageComponent: () => <CSSEditor />,
    });

    readit.settings.registerNavigationTile({
        id: "custom-css",
        title: "Custom CSS",
        description: "Add your own custom CSS to ReadIt",
        icon: "🎨",
    });
}
