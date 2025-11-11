import { useState } from "preact/hooks";
import { ReadItPlugin } from "@lib/types";
import { readit } from "@modules/readit";
import { SwitchToggle } from "@components/SwitchToggle";
import { PluginSettings } from "@components/PluginSettings";

export default function PluginPage({ plugin }: { plugin: ReadItPlugin }) {
    const [enabled, setEnabled] = useState(plugin.enabled ?? false);

    const handleToggle = (checked: boolean) => {
        setEnabled(checked);
        if (checked) {
            readit.plugins.enablePlugin(plugin);
        } else {
            readit.plugins.disablePlugin(plugin);
        }
    };

    return (
        <div>
            <h2>{plugin.name}</h2>
            <p>{plugin.description}</p>
            <p>Version: {plugin.version ?? "N/A"}</p>
            <p>Plugin ID: {plugin.id}</p>

            <SwitchToggle
                checked={enabled}
                onChange={handleToggle}
                title="Enabled"
            />
            <PluginSettings
                settings={plugin.settings}
                storage={plugin._ctx.storageSync}
            />
        </div>
    );
}
