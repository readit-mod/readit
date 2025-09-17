import { Component } from "nano-jsx";
import type { TileProps } from "@/lib/types";

export class SettingsTile extends Component<TileProps> {
  render() {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          marginBottom: "12px",
          borderRadius: "8px",
          backgroundColor: "var(--color-neutral-background)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {this.props.icon && (
            <span style={{ fontSize: "20px" }}>{this.props.icon}</span>
          )}
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              {this.props.title}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--color-neutral-text)",
                opacity: 0.8,
              }}
            >
              {this.props.description}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
