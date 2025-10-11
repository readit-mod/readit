import { PluginContext } from "@/core/modules/plugins/api/types";
import { ReadIt } from "@/core/modules/readit";

export type ReadItPlugin = {
  name: string;
  description: string;
  id: string;
  version?: string;

  enabled?: boolean;
  _ctx?: PluginContext;

  onLoad: (ctx: PluginContext) => Promise<void>;
  onUnload?: (ctx: PluginContext) => Promise<void>;
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
  items?: TileProps[];
  pageComponent?: never
} | {
  id: string;
  title: string;
  items?: never;
  pageComponent?: any;
};

declare global {
  interface Window {
    readit: ReadIt;
  }
}