
/** 
 * Adds properties to a plugin object that aren't defined.
 * @param {import("./types").ReadItPlugin} config
*/
export function definePlugin(config) {
    return {
        settings: [],
        ...config
    }
}
