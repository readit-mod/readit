import type { ReactiveController, ReactiveControllerHost } from "lit";
import type { Store } from ".";
import "./settings";
import type { StoreInstance, StoreMethods } from "./types";

class StoreController implements ReactiveController {
    private unsubscribe?: () => void;

    constructor(
        private host: ReactiveControllerHost,
        private store: Store<any>,
    ) {
        host.addController(this);
    }

    hostConnected(): void {
        const listener = () => {
            this.host.requestUpdate();
        };

        this.store.addGlobalListener(listener);

        this.unsubscribe = () => {
            this.store.removeGlobalListener(listener);
        };
    }

    hostDisconnected(): void {
        this.unsubscribe?.();
        this.unsubscribe = undefined;
    }

    get value() {
        return this.store.store;
    }
}

export function makeReactiveStore<T = any, M extends StoreMethods<T> = any>(
    store: StoreInstance<T, M>,
    host: ReactiveControllerHost,
): T & M {
    const controller = new StoreController(host, store);

    return controller.value;
}
