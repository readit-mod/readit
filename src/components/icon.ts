import { defineSafeElement } from "@api/elements";
import { Icon, Icons } from "@assets/icons";
import { LitElement, nothing } from "@modules/common/lit";
import { property } from "lit/decorators.js";

defineSafeElement("readit-icon", () => {
    class ReadItIcon extends LitElement {
        @property({
            type: String,
        })
        icon = null;

        @property({
            type: Number,
        })
        size = 24;

        @property({
            type: String,
        })
        color = "currentColor";

        protected render(): unknown {
            return this.icon
                ? Icon(Icons[this.icon], {
                      size: this.size,
                      color: this.color,
                  })
                : nothing;
        }
    }

    return ReadItIcon;
});
