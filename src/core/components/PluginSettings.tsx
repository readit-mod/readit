import { PluginSettingsTile } from "@components/PluginSettingsTile";
import { StorageSyncAPI } from "@modules/plugins/api/types";
import { PluginSetting } from "@lib/types";

export function PluginSettings({
    settings,
    storage,
}: {
    settings: PluginSetting[];
    storage: StorageSyncAPI;
}) {
    const saveSettings = () => {
        settings.map((s) => {
            storage.set(s.id, s.value);
        });
    };

    return (
        <div>
            {settings.map((setting, index) => {
                let value = storage.get(setting.id, setting.default);
                return (
                    <PluginSettingsTile
                        title={setting.title}
                        description={setting.description}
                        type={setting.type}
                        value={value}
                        onChange={(val) => {
                            settings[index].value = val;
                            saveSettings();
                        }}
                    />
                );
            })}
        </div>
    );
}
