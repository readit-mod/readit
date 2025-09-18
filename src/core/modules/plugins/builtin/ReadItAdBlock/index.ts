import { definePlugin } from "@/lib/types"

export default definePlugin({
    name: "ReadIt Adblock",
    description: "Builtin plugin to remove ads from the website.",
    version: "1.0.0",
    onLoad: (api) => {
        api.posts.registerLoadCallback((posts) => {
            posts.forEach((post) => {
                if(post.matches("shreddit-ad-post")) {
                    post.remove();
                }
            })
        })
    }
})