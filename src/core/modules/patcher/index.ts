import * as strawberry from "@marshift/strawberry";
import { ReadIt } from "@/core/modules/readit";

export class Patcher {
    constructor(private readit: ReadIt) {}

    before: typeof strawberry.before = strawberry.before;
    instead: typeof strawberry.instead = strawberry.instead;
    after: typeof strawberry.after = strawberry.after;
    unpatchAll: typeof strawberry.unpatchAll = strawberry.unpatchAll;

    scopedPatcher(): strawberry.Patcher {
        return new strawberry.Patcher();
    }
}
