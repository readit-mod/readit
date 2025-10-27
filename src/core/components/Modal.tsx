import { FunctionalComponent, h } from "preact";
import { useEffect } from "preact/hooks";

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    children: preact.ComponentChildren;
    title?: string;
    width?: string;
    height?: string;
    showBackdrop?: boolean;
}

export function Modal({
    visible,
    onClose,
    children,
    title,
    width = "85%",
    height = "85%",
}: ModalProps) {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (visible) window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [visible]);

    if (!visible) return null;

    return (
        <div
            style={{
                display: "flex",
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                background: visible ? "rgba(0,0,0,0.5)" : "transparent",
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
                    width,
                    height,
                    overflowY: "auto",
                }}
            >
                {title && <h2>{title}</h2>}

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

                <div
                    style={{
                        maxHeight: "-webkit-fill-available",
                        overflowY: "auto",
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
