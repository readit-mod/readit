import { PluginContext } from "@/core/modules/plugins/api/types";

export type ReadItPlugin = {
  name: string;
  description: string;
  id: string;
  version?: string;

  onLoad: (ctx: PluginContext) => Promise<void>;
};

export type TileProps = {
  title: string;
  description: string;
  icon?: string;
  onClick?: () => void;
}

export type NavigationTileProps = TileProps & {
  id: string;
}

export const definePlugin: (config: ReadItPlugin) => ReadItPlugin;

export type SettingsPage = {
  id: string;
  title: string;
  items: TileProps[];
};