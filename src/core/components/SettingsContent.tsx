import { useEffect, useState } from "preact/hooks";
import { SettingsTile } from "@/core/components/SettingsTile";
import { TileProps, SettingsPage } from "@/lib/types";
import { readit } from "@/core/modules/readit";

interface SettingsProps {
    pages?: SettingsPage[];
    items?: TileProps[];
    activePage?: string;
    onGoBack?: () => void;
}

export function SettingsContent({
    pages,
    items,
    activePage,
    onGoBack,
}: SettingsProps) {
    const [isClicked, setIsClicked] = useState(false);

    if (isClicked) {
        throw new Error("This is an example of the error boundary.");
    }

    pages.unshift({
        id: "general",
        title: "General",
        items:
            items.concat([
                {
                    title: "Test Error Boundary",
                    description: "Press to test the error boundary.",
                    icon: "🚧",
                    onClick: () => {
                        setIsClicked(true);
                    },
                },
            ]) || [],
    });

    const currentPage = pages.find((p) => p.id === activePage) || pages[0];
    const isFirstPage = currentPage.id === "general";

    // readit.settings.setTitle(currentPage.title);

    return (
        <div>
            {!isFirstPage && (
                <span
                    style={{
                        userSelect: "text",
                        cursor: "pointer",
                        color: "#888",
                        display: "inline-block",
                        marginBottom: "10px",
                        transition: "color 0.2s",
                    }}
                    onMouseOver={(e) =>
                        (e.currentTarget.style.color = "#007bff")
                    }
                    onMouseOut={(e) => (e.currentTarget.style.color = "#888")}
                    onClick={onGoBack}
                >
                    ← Go Back
                </span>
            )}
            <div id="settings-tile-container">
                {currentPage.pageComponent ? (
                    <currentPage.pageComponent />
                ) : (
                    currentPage.items.map((i) => <SettingsTile {...i} />)
                )}
            </div>
        </div>
    );
}
