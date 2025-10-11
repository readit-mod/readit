import { ReadItPlugin } from "@/lib/types";
import { SettingsTile } from "@/core/components/SettingsTile"
import { readit } from "@/core/modules/readit";
import { Component } from "nano-jsx";
import { SwitchToggle } from "@/core/components/SwitchToggle";

export default class PluginPage extends Component<{ plugin: ReadItPlugin }> {
    willMount() {
        this.initState = {
            enabled: this.props.plugin.enabled ?? false
        }
    }

    render() {
        const { plugin } = this.props;

        return (
            <div>
                <h2>{plugin.name}</h2>
                <p>{plugin.description}</p>
                <p>Version: {plugin.version ?? "N/A"}</p>
                <p>Plugin ID: {plugin.id}</p>
                <SwitchToggle
                    checked={this.state.enabled}
                    onChange={(checked) => {
                        this.setState({ enabled: checked });
                        checked ? readit.plugins.enablePlugin(plugin) : readit.plugins.disablePlugin(plugin);
                    }}
                />
            </div>
        );
    }
}