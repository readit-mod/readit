import { h, Component } from "preact";
import { ReadItError } from "./ReadItError";
import { readit } from "@/core/modules/readit";

interface ErrorBoundaryState {
    error: unknown | null;
    stack: string | null;
}

export class ErrorBoundary extends Component<{}, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null, stack: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error: error.message, stack: error.stack };
    }

    componentDidCatch(error: Error) {
        readit.logging.error(
            "ErrorBoundary caught an error: " + error.message + error.stack,
        );
        this.setState({ error: error.message });
    }

    handleRetry = () => {
        this.setState({ error: null }, () => {
            readit.settings.render();
        });
    };

    render() {
        if (this.state.error) {
            return (
                <ReadItError
                    error={this.state.error}
                    retry={this.handleRetry}
                    stack={this.state.stack}
                />
            );
        }

        return this.props.children;
    }
}
