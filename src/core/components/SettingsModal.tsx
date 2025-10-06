import { Component } from "nano-jsx";
import { SettingsTile } from "@/core/components/SettingsTile";
import { TileProps, SettingsPage } from "@/lib/types";

export class SettingsModal extends Component<{
  visible: boolean;
  onClose: () => void;
  pages?: SettingsPage[];
  items?: TileProps[];
  activePage?: string;
  onGoBack?: () => void;
}> {
  render() {
    const { visible, onClose, pages, items, activePage, onGoBack } = this.props;
    pages.unshift(
      {
        id: "general",
        title: "General",
        items: items || [],
      }
    );

    const currentPage =
      pages.find((p) => p.id === activePage) || pages[0];
    const isFirstPage = currentPage.id === "general";

    return (
      <div
        style={{
          display: visible ? "flex" : "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.5)",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            background: "var(--color-neutral-background)",
            padding: "20px",
            borderRadius: "8px",
            position: "relative",
            color: "var(--color-neutral-content-strong)",
            height: "85%",
            width: "85%",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "5px",
              right: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={onClose}
          >
            x
          </span>

          <h2>ReadIt Settings - {currentPage.title}</h2>
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
              onMouseOver={e => (e.currentTarget.style.color = "#007bff")}
              onMouseOut={e => (e.currentTarget.style.color = "#888")}
              onClick={onGoBack}
            >
              ← Go Back
            </span>
          )}
          <div id="settings-tile-container">
            {currentPage.pageComponent ?
              (typeof currentPage.pageComponent === "function" ?
                currentPage.pageComponent() :
                <currentPage.pageComponent />)
              :
                currentPage.items.map((i) => (
                  <SettingsTile {...i} />
                ))
              }
            
          </div>
        </div>
      </div>
    );
  }
}