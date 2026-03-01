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

export const Icons = {
    Info: InfoIcon,
    Close: CloseIcon,
    ReadIt: ReadItIcon,
};

expose(Icons, "readit.assets.icons");
