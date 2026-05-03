import { expose } from "@api/expose";
import ReadItIconSvg from "@assets/svg/ReadItIcon.svg?raw";
import { svgToIcon } from "./nodes";

export const InfoIcon: IconDefinition = {
    viewBox: "0 -960 960 960",
    nodes: [
        {
            tag: "path",
            attrs: {
                d: "M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z",
            },
        },
    ],
};

export const CloseIcon: IconDefinition = {
    viewBox: "0 0 20 20",
    nodes: [
        {
            tag: "path",
            attrs: {
                d: "M11.273 10l5.363-5.363a.9.9 0 10-1.273-1.273L10 8.727 4.637 3.364a.9.9 0 10-1.273 1.273L8.727 10l-5.363 5.363a.9.9 0 101.274 1.273L10 11.273l5.363 5.363a.897.897 0 001.274 0 .9.9 0 000-1.273L11.275 10h-.002z",
            },
        },
    ],
};

export const ReadItIcon: IconDefinition = svgToIcon(ReadItIconSvg);

export const ErrorIcon: IconDefinition = {
    viewBox: "0 -960 960 960",
    nodes: [
        {
            tag: "path",
            attrs: {
                d: "M508.5-291.5Q520-303 520-320t-11.5-28.5Q497-360 480-360t-28.5 11.5Q440-337 440-320t11.5 28.5Q463-280 480-280t28.5-11.5ZM440-440h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z",
            },
        },
    ],
};
export const WarningIcon: IconDefinition = {
    viewBox: "0 0 1024 1024",
    nodes: [
        {
            tag: "path",
            attrs: {
                d: "m955.7 856l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48M480 416c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v184c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8zm32 352a48.01 48.01 0 0 1 0-96a48.01 48.01 0 0 1 0 96",
            },
        },
    ],
};
export const CheckIcon: IconDefinition = {
    viewBox: "0 0 1024 1024",
    nodes: [
        {
            tag: "path",
            attrs: {
                d: "M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5L207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8",
            },
        },
    ],
};

export const Icons = {
    Info: InfoIcon,
    Close: CloseIcon,
    Check: CheckIcon,
    ReadIt: ReadItIcon,

    Error: ErrorIcon,
    Warning: WarningIcon,
    Success: CheckIcon,
};

expose(Icons, "readit.assets.icons");
