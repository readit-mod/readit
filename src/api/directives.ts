import { lazyDirective } from "@api/utils/lazy";
import { Directive, noChange, nothing } from "@modules/common/lit";

export const unsafeSvg = lazyDirective(
    () =>
        class extends Directive {
            render(
                value:
                    | string
                    | typeof nothing
                    | typeof noChange
                    | undefined
                    | null,
            ) {
                if (!value || value == nothing || value == noChange) {
                    return value;
                }

                const strings = [value] as unknown as TemplateStringsArray;
                (strings as any).raw = value;

                return {
                    _$litType$: 2,
                    strings,
                    values: [],
                };
            }
        },
);
