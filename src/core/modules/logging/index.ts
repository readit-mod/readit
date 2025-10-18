import { ReadIt } from "@/core/modules/readit";

export class Logging {
    constructor(private readit: ReadIt) {}
    info(message: string) {
        console.log("\x1b[33m[READIT Info]\x1b[0m ", message);
    }
    warn(message: string) {
        console.warn("\x1b[93m[READIT Warn]\x1b[0m", message);
    }
    error(message: string) {
        console.error("\x1b[31m[READIT Error]\x1b[0m ", message);
    }
}
