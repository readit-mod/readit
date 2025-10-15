import { useState } from 'preact/hooks';
import { ReadItPlugin } from '@/lib/types';
import { readit } from '@/core/modules/readit';
import { SwitchToggle } from '@/core/components/SwitchToggle';

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
            <p>Version: {plugin.version ?? 'N/A'}</p>
            <p>Plugin ID: {plugin.id}</p>

            <SwitchToggle checked={enabled} onChange={handleToggle} />
        </div>
    );
}
