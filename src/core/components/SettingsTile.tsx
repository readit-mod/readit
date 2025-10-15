import { useState } from "preact/hooks";
import type { TileProps } from "@/lib/types";

export function SettingsTile({ onClick, icon, title, description }: TileProps){
    const [isPressed, setIsPressed] = useState(false);

    const activeBoxShadow = isPressed
            ? "inset 0 1px 3px rgba(0,0,0,0.15)"
            : "0 1px 3px rgba(0,0,0,0.1)";

        const activeTransform = isPressed ? "scale(0.98)" : "scale(1)";

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
                    boxShadow: activeBoxShadow,
                    cursor: "pointer",
                    transform: activeTransform,
                    transition: "box-shadow 0.2s ease, transform 0.1s ease",
                }}
                onClick={onClick? onClick : undefined}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--color-neutral-background-hover)";
                    e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--color-neutral-background)";
                    if (!isPressed) {
                        e.currentTarget.style.boxShadow = activeBoxShadow;
                    }
                    setIsPressed(false);
                }}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {icon && (
                        <span style={{ fontSize: "20px" }}>{icon}</span>
                    )}
                    <div>
                        <div
                            style={{
                                fontWeight: 600,
                                fontSize: "14px",
                                marginBottom: "4px",
                            }}
                        >
                            {title}
                        </div>
                        <div
                            style={{
                                fontSize: "12px",
                                color: "var(--color-neutral-text)",
                                opacity: 0.8,
                            }}
                        >
                            {description}
                        </div>
                    </div>
                </div>
            </div>
        );
}