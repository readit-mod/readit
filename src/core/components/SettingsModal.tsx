import { Component } from "nano-jsx";

export class SettingsModal extends Component<{
  visible: boolean;
  onClose: () => void;
  items: string[];
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
            minWidth: "400px",
            minHeight: "300px",
            position: "relative",
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
              <p>{i}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
