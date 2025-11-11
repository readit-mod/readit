import { ReadIt } from "@modules/readit";
import { withNative } from "@lib/native";

export class Logging {
    constructor(private readit: ReadIt) {}
    info(message: string) {
        withNative(() => {
            window.ReadItNative.logging.log("[READIT Info] " + message);
        });

        console.log("\x1b[33m[READIT Info]\x1b[0m ", message);
    }
    warn(message: string) {
        withNative(() => {
            window.ReadItNative.logging.log("[READIT Warn] " + message);
        });

        console.warn("\x1b[93m[READIT Warn]\x1b[0m ", message);
    }
    error(message: string) {
        withNative(() => {
            window.ReadItNative.logging.log("[READIT Error] " + message);
        });

        console.error("\x1b[31m[READIT Error]\x1b[0m ", message);
    }
}
