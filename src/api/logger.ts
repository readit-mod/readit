import { expose } from "@api/expose";
import { capitaliseFirstLetter } from "./utils/string";

type LogLevel = "info" | "log" | "warn" | "error";

export class Logger {
    constructor(private name) {}

    private levelColors = {
        info: "#7eed6f",
        log: "#7eed6f",
        warn: "#d8f56e",
        error: "#ff3b3b",
    };

    private _log(args: any[], level: LogLevel) {
        console[level](
            `%cReadIt > ${this.name} - ${capitaliseFirstLetter(level)}%c`,
            `background: ${this.levelColors[level]} ; color: black; font-weight: bold; padding: 2px 4px; border-radius: 4px;`,
            "",
            ...args,
        );
    }

    log(...args: any[]) {
        this._log(args, "log");
    }

    info(...args: any[]) {
        this._log(args, "info");
    }

    warn(...args: any[]) {
        this._log(args, "warn");
    }

    error(...args: any[]) {
        this._log(args, "error");
    }
}

export const logger = new Logger("Core");
expose(Logger, "readit.api.Logger");
expose(logger, "readit.api.logger");
