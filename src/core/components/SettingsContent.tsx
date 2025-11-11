import { useEffect, useState } from "preact/hooks";
import { SettingsTile } from "@components/SettingsTile";
import { TileProps, SettingsPage } from "@lib/types";
import { readit } from "@modules/readit";

interface SettingsProps {
    pages?: Map<string, SettingsPage>;
    items?: TileProps[];
    activePage?: SettingsPage;
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

    const isFirstPage = activePage.id === "general";

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
                {activePage.pageComponent ? (
                    <activePage.pageComponent />
                ) : (
                    activePage.items.map((i) => <SettingsTile {...i} />)
                )}
            </div>
        </div>
    );
}
