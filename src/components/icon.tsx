import { defineSafeElement } from "@api/elements";
import { Icons, Icon as renderIcon } from "@assets/icons";
import { LitElement, nothing } from "@modules/common/lit";
import { property } from "lit/decorators.js";

export function Icon({
    icon,
    size = 24,
    color = "currentColor",
}: {
    icon: keyof typeof Icons;
    size?: number;
    color?: string;
}) {
    return renderIcon(Icons[icon], {
        size,
        color,
    });
}

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
                ? renderIcon(Icons[this.icon], {
                      size: this.size,
                      color: this.color,
                  })
                : nothing;
        }
    }

    return ReadItIcon;
});
