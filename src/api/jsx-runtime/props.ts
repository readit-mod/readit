import { lazyDirective } from "@api/utils/lazy";
import { Directive } from "@modules/common/lit";
import type { ElementPart } from "lit";

export const spreadProps = lazyDirective(
    () =>
        class extends Directive {
            element!: Element;
            prevData: Record<string, any> = {};
            listeners: Record<string, any> = {};

            render(_data: Record<string, any>) {
                return null;
            }

            update(
                part: ElementPart,
                [data]: [
                    Record<string, any>,
                ],
            ) {
                const el = part.element;

                if (this.element !== el) {
                    this.element = el;
                    this.prevData = {};
                    this.listeners = {};
                }

                this.apply(data);
                this.cleanup(data);

                this.prevData = {
                    ...data,
                };
                return null;
            }

            apply(data: Record<string, any>) {
                const el = this.element;

                if (!el) return;

                for (const key in data) {
                    const value = data[key];
                    const prev = this.prevData[key];

                    if (value === prev) continue;

                    if (key.startsWith("on:")) {
                        const name = key.slice(3);

                        if (this.listeners[name]) {
                            el.removeEventListener(name, this.listeners[name]);
                        }

                        el.addEventListener(name, value);
                        this.listeners[name] = value;
                    } else if (key.startsWith("bool:")) {
                        const name = key.slice(5);

                        if (value) el.setAttribute(name, "");
                        else el.removeAttribute(name);
                    } else if (key.startsWith("attr:")) {
                        const name = key.slice(5);

                        if (value != null) el.setAttribute(name, value);
                        else el.removeAttribute(name);
                    } else {
                        (el as any)[key] = value;
                    }
                }
            }

            cleanup(data: Record<string, any>) {
                const el = this.element;

                for (const key in this.prevData) {
                    if (key in data) continue;

                    if (key.startsWith("on:")) {
                        const name = key.slice(3);

                        el.removeEventListener(name, this.listeners[name]);
                        delete this.listeners[name];
                    } else if (key.startsWith("bool:")) {
                        el.removeAttribute(key.slice(5));
                    } else if (key.startsWith("attr:")) {
                        el.removeAttribute(key.slice(5));
                    } else {
                        (el as any)[key] = undefined;
                    }
                }
            }
        },
);
