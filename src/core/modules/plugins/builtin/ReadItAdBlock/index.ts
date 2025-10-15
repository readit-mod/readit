import { definePlugin } from "@/lib/plugin"

export default definePlugin({
        name: "ReadIt Adblock",
        description: "Builtin plugin to remove ads from the website.",
        id: "readit-adblock",
        version: "1.0.0",
        async onLoad({ logging, posts, settings, storage, cleanup }) {
                let blocked = await storage.get<number>("ads-blocked", 0);

                
                let unsubLoadCallback = posts.registerLoadCallback(async (posts) => {
                        posts.forEach((post) => {
                                if(post.matches("shreddit-ad-post")) {
                                        blocked++;
                                        post.remove();
                                }
                        })
                        await storage.set("ads-blocked", blocked);
                })
                let removeTile = settings.registerSettingsTile({
                        title: "Ads Blocked",
                        description: `Total ads blocked: ${blocked}`,
                        icon: "🚫",
                });
                cleanup = () => {
                        unsubLoadCallback();
                        removeTile();
                } 
                
                logging.info("Loaded successfully...");
        },
})