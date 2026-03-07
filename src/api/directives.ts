import { lazyDirective } from "@api/utils/lazy";
import { Directive, noChange, nothing } from "@modules/common/lit";
import type { ElementPart } from "lit";

export const unsafeSvg = lazyDirective(
    () =>
        class extends Directive {
            render(value: string | typeof nothing | typeof noChange | undefined | null) {
                if (!value || value === nothing || value === noChange) {
                    return value;
                }

                const strings = [
                    value,
                ] as unknown as TemplateStringsArray;
                (strings as any).raw = value;

                return {
                    _$litType$: 2,
                    strings,
                    values: [],
                };
            }
        },
);

export const unsafeHtml = lazyDirective(
    () =>
        class extends Directive {
            render(value: string | typeof nothing | typeof noChange | undefined | null) {
                if (!value || value === nothing || value === noChange) {
                    return value;
                }

                const strings = [
                    value,
                ] as unknown as TemplateStringsArray;

                (strings as any).raw = value;

                return {
                    _$litType$: 1,
                    strings,
                    values: [],
                };
            }
        },
);

type Ref<T = Element> = {
    value?: T;
};

export function createRef<T = Element>(): Ref<T> {
    return {
        value: undefined,
    };
}

export const ref = lazyDirective(
    () =>
        class extends Directive {
            private _element?: Element;

            render(_ref: Ref) {
                return;
            }

            update(
                part: ElementPart,
                [ref]: [
                    Ref,
                ],
            ) {
                const element = part.element;

                if (this._element === element) return;
                this._element = element;

                ref.value = element;

                return;
            }
        },
);
