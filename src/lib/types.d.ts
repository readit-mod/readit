import { PluginContext } from "@/core/modules/plugins/api/types";

export type ReadItPlugin = {
  name: string;
  description: string;
  version?: string;

  onLoad: (ctx: PluginContext) => void;
};

export type TileProps = {
  title: string;
  description: string;
  icon?: string;
}

export const definePlugin: (config: ReadItPlugin) => ReadItPlugin;