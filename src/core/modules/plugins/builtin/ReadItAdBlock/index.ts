import { definePlugin } from "@/lib/plugin"

let unsubscribe: (() => void) | null = null;

export default definePlugin({
    name: "ReadIt Adblock",
    description: "Builtin plugin to remove ads from the website.",
    id: "readit-adblock",
    version: "1.0.0",
    onLoad: async (api) => {
        let blocked = await api.storage.get<number>("ads-blocked", 0);

        
        let unsubLoadCallback = api.posts.registerLoadCallback(async (posts) => {
            posts.forEach((post) => {
                if(post.matches("shreddit-ad-post")) {
                    blocked++;
                    post.remove();
                }
            })
            await api.storage.set("ads-blocked", blocked);
        })
        let removeTile = api.settings.registerSettingsTile({
            title: "Ads Blocked",
            description: `Total ads blocked: ${blocked}`,
            icon: "🚫",
        });
        unsubscribe = () => {
            unsubLoadCallback();
            removeTile();
        } 
        
        api.logging.info("Loaded successfully...");
    },

    onUnload: async (api) => {
        unsubscribe?.();
    }
})