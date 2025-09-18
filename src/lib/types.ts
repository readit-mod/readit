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

// This acts as type safety for plugins.
export const definePlugin = (config: ReadItPlugin) => config;