import { useState } from "preact/hooks";

export function ChangeBundleURL() {
    const [newUrl, setNewUrl] = useState("");

    const changeURL = () => {
        window.ReadItNative.bundle.setBundleURL(newUrl);
        alert("You should restart to apply changes.");
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <input
                type="text"
                onChange={(e) =>
                    setNewUrl((e.target as HTMLInputElement).value)
                }
                style={{ minWidth: "60%" }}
            />
            <br />
            <button onClick={changeURL}>
                <span style={{ padding: "10px 20px" }}>Change URL</span>
            </button>
        </div>
    );
}
