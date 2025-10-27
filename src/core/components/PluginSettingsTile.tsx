import { useEffect, useState } from "preact/hooks";
import { SwitchToggle } from "@/core/components/SwitchToggle";

type SettingsTileProps = {
    title: string;
    description: string;
    type: "input" | "toggle";
    value: string | boolean;
    onChange: (value: string | boolean) => void;
};

export function PluginSettingsTile({
    title,
    description,
    type,
    value,
    onChange,
}: SettingsTileProps) {
    const [isPressed, setIsPressed] = useState(false);
    const [val, setVal] = useState(type == "input" ? "" : false);

    useEffect(() => {
        setVal(value);
    }, [value]);

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
                cursor: type === "toggle" ? "pointer" : "default",
                transform: activeTransform,
                transition: "box-shadow 0.2s ease, transform 0.1s ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                    "var(--color-neutral-background-hover)";
                e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                    "var(--color-neutral-background)";
                if (!isPressed) {
                    e.currentTarget.style.boxShadow = activeBoxShadow;
                }
                setIsPressed(false);
            }}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onClick={() => {
                if (type === "toggle" && typeof value === "boolean") {
                    onChange(!value);
                }
            }}
        >
            <div
                style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
                <div style={{ fontWeight: 600, fontSize: "14px" }}>{title}</div>
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

            {type === "toggle" && typeof val === "boolean" && (
                <SwitchToggle
                    checked={val}
                    onChange={(v) => {
                        setVal(v);
                        onChange(v);
                    }}
                />
            )}

            {type === "input" && typeof val === "string" && (
                <input
                    type="text"
                    value={val}
                    onInput={(e: any) => {
                        const newValue = e.currentTarget.value;
                        setVal(newValue);
                        onChange(newValue);
                    }}
                    style={{
                        padding: "6px 8px",
                        borderRadius: "6px",
                        border: "1px solid var(--color-border)",
                        fontSize: "14px",
                        minWidth: "120px",
                    }}
                />
            )}
        </div>
    );
}
