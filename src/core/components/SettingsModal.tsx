import { Component } from "nano-jsx";
import { SettingsTile } from "@/core/components/SettingsTile"
import { TileProps } from "@/lib/types";

export class SettingsModal extends Component<{
  visible: boolean;
  onClose: () => void;
  items: TileProps[];
}> {
  render() {
    const { visible, onClose, items } = this.props;

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
            width: "85%"
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
            ×
          </span>

          <h2>ReadIt Settings</h2>
          <div id="settings-tile-container">
            {items.map((i) => (
              <SettingsTile title={i.title} description={i.description} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
