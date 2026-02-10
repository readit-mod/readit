import {
    defineSafeElement,
    findInElementTree,
    filters as elementFilters,
    findChild,
} from "@api/elements";
import { chain } from "@api/filters";
import {
    filters as lazyComponentFilters,
    lazyComponentPatch,
} from "@api/patches/customElements";
import { defineCorePlugin, PluginLifeCycle } from "@api/plugins";
import { showToast } from "@api/toasts";
import { html, LitElement } from "@modules/common/lit";
import type { TemplateResult } from "lit";
import { Icon, InfoIcon } from "@api/icons";

function buildReadItItem() {
    return class extends LitElement {
        protected createRenderRoot(): HTMLElement | DocumentFragment {
            return this;
        }

        protected render(): TemplateResult {
            return html`
                <li
                    rpl=""
                    class="relative list-none mt-0 "
                    id="drafts-list-item"
                    role="presentation"
                >
                    <a
                        class="flex justify-between relative px-md gap-[0.5rem] text-secondary hover:text-secondary-hover active:bg-interactive-pressed hover:bg-neutral-background-hover hover:no-underline cursor-pointer  py-xs  -outline-offset-1   no-underline"
                        @click="${() => {
                            showToast({
                                message: `You're using ReadIt! Version: ${__READIT_VERSION__}`,
                                icon: Icon(InfoIcon, {
                                    // Fix weird icon positioning bug in toasts.
                                    styles: "padding-top: 30%",
                                }),
                            });
                        }}"
                        style="padding-inline-end: 16px"
                    >
                        <span class="flex items-center gap-xs min-w-0 shrink">
                            <span
                                class="flex shrink-0 items-center justify-center h-xl w-xl text-20 leading-4"
                            >
                                ${Icon(InfoIcon, {
                                    size: 20,
                                })}
                            </span>

                            <span
                                class="flex flex-col justify-center min-w-0 shrink py-[var(--rem6)]"
                            >
                                <span class="text-body-2">ReadIt Version</span>
                                <span
                                    class="text-caption-1 text-secondary-weak"
                                >
                                    ${__READIT_VERSION__}
                                </span>
                            </span>
                        </span>
                        <span class="flex items-center shrink-0">
                            <span
                                class="flex items-center justify-center h-lg"
                            ></span>
                        </span>
                    </a>
                </li>
            `;
        }
    };
}

export default defineCorePlugin({
    name: "ReadIt Settings",
    id: "readit.settings",
    version: "1.0.0",
    lifeCycle: PluginLifeCycle.OnInit,
    start() {
        patchUserDrawer();
        patchSidebar();
    },
});

function patchUserDrawer() {
    defineSafeElement("readit-li", () => buildReadItItem());

    lazyComponentPatch(
        lazyComponentFilters.byName("UserDrawerMenu"),
        (menu) => {
            const li = document.createElement("readit-li");

            const profileItemFilter = chain.all(
                elementFilters.byTagName("faceplate-tracker"),
                elementFilters.byAttribute("noun", "profile"),
            );

            const targetSection = findInElementTree(
                menu,
                chain.all(
                    elementFilters.byTagName("ul"),
                    elementFilters.byChild(profileItemFilter),
                ),
            );

            const profileItem =
                targetSection && findChild(targetSection, profileItemFilter);

            if (profileItem) {
                profileItem.after(li);
            } else {
                const list = menu.querySelector("ul");
                list?.appendChild(li);
            }
        },
    );
}

function patchSidebar() {
    lazyComponentPatch(
        lazyComponentFilters.byName("CommonLeftNav"),
        (sidebar) => {
            const info = findInElementTree(
                sidebar,
                chain.all(
                    elementFilters.byTagName("a"),
                    elementFilters.byAttribute("href", "https://redditinc.com"),
                ),
            );

            const readitInfo = info.cloneNode(true) as Element;
            readitInfo.setAttribute("href", "#");
            readitInfo.addEventListener("click", (e) => e.preventDefault());
            readitInfo.classList.add("pointer-events-none");
            readitInfo.textContent = `ReadIt Version: ${__READIT_VERSION__}`;

            info?.before(readitInfo);
        },
    );
}
