import { expose } from "@api/expose";
import info from "./info";
import settings from "./settings";

const platform = {
    ...info,
    ...settings,
} satisfies ReadItPlatform;

export function exposePlatform() {
    expose(platform, "readit.platform");
}
