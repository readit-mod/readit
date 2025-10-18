export function ReadItError({
    error,
    retry,
    stack,
}: {
    error: unknown;
    retry: () => void;
    stack: string;
}) {
    const reload = () => {
        window.location.reload();
    };

    return (
        <div>
            <h1>Oops, an error occured while rendering.</h1>
            <p>
                Error message:{" "}
                {typeof error == "string" ? error : "Unknown Error."}
            </p>
            <p>Stack: {stack ? stack : "No stack available."}</p>
            <button onClick={retry} style={{ marginRight: "7.5px" }}>
                <span style={{ padding: "10px 20px" }}>Retry Render</span>
            </button>
            <button
                onClick={reload}
                style={{ marginLeft: "7.5px", background: "red" }}
            >
                <span style={{ padding: "10px 20px" }}>Reload Reddit</span>
            </button>
        </div>
    );
}
