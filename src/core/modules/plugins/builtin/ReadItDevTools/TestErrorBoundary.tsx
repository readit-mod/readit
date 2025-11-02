let hasCrashed = false;

export function TestErrorBoundary() {
    if (!hasCrashed) {
        hasCrashed = true;
        throw new Error("Intentional render crash.");
    }

    return <h1>Error Boundary has crashed already!</h1>;
}
