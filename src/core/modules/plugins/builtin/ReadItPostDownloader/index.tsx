// This plugin is disbled due to some bugs in some modules, it will be brought back when they are fixed.

// import { definePlugin } from "@lib/plugin";
// import { downloadPost, waitForShadowRoot } from "./utils";
// import { DownloadChip } from "./DownloadChip";

// export default definePlugin({
//     name: "ReadIt Post Downloader",
//     description:
//         "Plugin to allow for image and video post downloading (downloaded video posts will not have sound).",
//     id: "readit-post-downloader",
//     version: "1.0.0",
//     async onLoad({ posts, dom }) {
//         posts.registerLoadCallback(async (posts) => {
//             for (const post of posts) {
//                 let shadow = await waitForShadowRoot(
//                     post.element as HTMLElement,
//                 );
//                 if (post.postType != "image" && post.postType != "video")
//                     continue;
//                 let container = document.createElement("div");
//                 dom.render(
//                     <DownloadChip
//                         onClick={() => {
//                             downloadPost(post);
//                         }}
//                     />,
//                     shadow
//                         .querySelector("div.shreddit-post-container")
//                         .appendChild(container),
//                 );
//             }
//         });
//     },
// });
