import { h } from "preact";

export function SettingsButton({ onClick }: { onClick: () => void }) {
    // this compoonent has to match buttons on the navbar so needs all these wrappers.

    return (
        <span class="contents">
            <faceplate-tracker class="nd:visible contents" action="click">
                <rpl-tooltip
                    style="--rpl-z-index-tooltip:1001"
                    class="nd:visible contents"
                    placement="bottom"
                    appearance="inverted"
                    trigger="hover focus-visible"
                    distance="8"
                >
                    <a
                        aria-label="ReadIt Settings"
                        class="no-underline hover:no-underline active:no-underline
                                                button-medium px-[var(--rem8)]
                                                button-plain icon items-center justify-center
                                                button inline-flex"
                        id="settings-open"
                        onClick={onClick}
                    >
                        <span class="flex items-center justify-center">
                            <span class="flex">
                                <svg
                                    fill="currentColor"
                                    height="20"
                                    icon-name="settings-outline"
                                    viewBox="0 0 20 20"
                                    width="20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M11.145 18.995h-2.29a1.56 1.56 0 01-1.501-1.134l-.051-.18a2.161 2.161 0 00-2.604-1.504l-.185.046a1.561 1.561 0 01-1.731-.734l-1.146-1.985a1.561 1.561 0 01.229-1.864l.132-.137a2.163 2.163 0 000-3.007l-.13-.135a1.561 1.561 0 01-.23-1.866L2.783 4.51a1.56 1.56 0 011.73-.734l.186.046a2.161 2.161 0 002.603-1.504l.05-.18a1.562 1.562 0 011.503-1.134h2.29c.697 0 1.31.463 1.5 1.133l.053.183a2.157 2.157 0 002.599 1.502l.189-.047a1.561 1.561 0 011.73.734l1.147 1.985a1.561 1.561 0 01-.23 1.864l-.133.14a2.162 2.162 0 000 3.004l.132.137c.485.5.578 1.262.23 1.866l-1.145 1.984a1.56 1.56 0 01-1.731.734l-.187-.047a2.16 2.16 0 00-2.601 1.503l-.052.182a1.562 1.562 0 01-1.502 1.134zm-2.11-1.8l1.933-.01a3.947 3.947 0 014.77-2.754l.01.002.967-1.672-.008-.007a3.943 3.943 0 010-5.508l.007-.007-.966-1.672-.01.002a3.945 3.945 0 01-4.771-2.754l-.003-.01-1.933.009A3.946 3.946 0 014.26 5.569l-.01-.002-.966 1.672.008.007a3.943 3.943 0 010 5.508l-.007.007.966 1.672.01-.002a3.947 3.947 0 014.77 2.754l.004.01zM10 13c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3zm0-4.2c-.661 0-1.2.539-1.2 1.2 0 .66.539 1.2 1.2 1.2.66 0 1.199-.54 1.199-1.2 0-.661-.538-1.2-1.2-1.2z"></path>
                                </svg>
                            </span>
                        </span>
                        <faceplate-screen-reader-content>
                            ReadIt Settings
                        </faceplate-screen-reader-content>
                    </a>
                    <span slot="content">ReadIt Settings</span>
                </rpl-tooltip>
            </faceplate-tracker>
        </span>
    );
}

