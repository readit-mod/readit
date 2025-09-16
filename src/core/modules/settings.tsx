import Nano from "nano-jsx";
import { SettingsModal } from "@/core/components/SettingsModal";
import { SettingsButton } from "@/core/components/SettingsButton";
import { readit } from "./readit";

export class Settings {
  modalContainer: HTMLElement;
  visible = false;
  tiles: string[] = [];

  constructor() {
    this.modalContainer = document.createElement("div");
    document.body.appendChild(this.modalContainer);

    this.injectButton();
    this.patchRenderMethod();
    this.render();
  }

  // Check if button exists
  isSettingsVisible = () => document.getElementById("settings-open") !== null;

  open = () => {
    this.visible = true;
    this.render();
  };

  close = () => {
    this.visible = false;
    this.render();
  };

  toggle = () => {
    this.visible = !this.visible;
    this.render();
  };

  // Inject the button into navbar
  injectButton() {
    const container = document.querySelector(
      "body > shreddit-app > reddit-header-large > reddit-header-action-items > header > nav > div.ps-lg.gap-xs.flex.items-center.justify-end > div:nth-child(2)"
    );

    if (!container || this.isSettingsVisible()) return;

    const btnDiv = document.createElement("div");
    container.appendChild(btnDiv);
    Nano.render(<SettingsButton onClick={this.open} />, btnDiv);
  }

  // Patch Lit render to survive rerenders
  patchRenderMethod() {
    const app = document.querySelector("shreddit-app") as any; // TS complains __proto__ doesn't exist on Element
    if (!app) return;
    const proto = app.__proto__;
    if (proto.__readitPatched) return;

    const originalRender = proto.render;
    proto.render = function (...args) {
      const result = originalRender.call(this, ...args);
      readit?.settings?.injectButton?.(); // re-inject after Lit render
      return result;
    };
    proto.__readitPatched = true;
  }

  addTile(content: string) {
    this.tiles.push(content);
    this.render();
  }

  render() {
    Nano.render(
      <SettingsModal
        visible={this.visible}
        onClose={this.close}
        items={this.tiles}
      />,
      this.modalContainer
    );
  }
}
