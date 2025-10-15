import { Fragment } from "preact";

export function SwitchToggle({checked, onChange}: { checked: boolean, onChange?: (checked: boolean) => void} ){
    return (
        <Fragment>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px" }}>
                <span>Enabled</span>
                <span style={{ position: "relative", display: "inline-block", width: "40px", height: "22px" }}>
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={e => onChange?.((e.target as HTMLInputElement).checked)}
                        style={{
                                opacity: 0,
                                width: 0,
                                height: 0,
                        }}
                    />
                    <span
                        style={{
                            position: "absolute",
                            cursor: "pointer",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "#ccc",
                            borderRadius: "22px",
                            transition: ".4s",
                        }}
                    ></span>
                    <span
                        style={{
                            position: "absolute",
                            content: '""',
                            height: "16px",
                            width: "16px",
                            left: "3px",
                            bottom: "3px",
                            backgroundColor: "white",
                            borderRadius: "50%",
                            transition: ".4s",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                        }}
                    ></span>
                </span>
            </label>
            <style>{`
                input[type="checkbox"]:checked + span {
                    background-color: #4caf50 !important;
                }
                input[type="checkbox"]:checked + span + span {
                    transform: translateX(18px);
                }
            `}</style>
        </Fragment>
    )
}