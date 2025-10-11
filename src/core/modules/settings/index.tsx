import Nano from "nano-jsx";
import { SettingsModal } from "@/core/components/SettingsModal";
import { SettingsButton } from "@/core/components/SettingsButton";
import { ReadIt } from "@/core/modules/readit";
import { TileProps, SettingsPage, NavigationTileProps } from "@/lib/types";

export class Settings {
  modalContainer: HTMLElement;
  visible = false;
  tiles: TileProps[] = [];
  pages: SettingsPage[] = [];
  history: string[] = [];
  activePage: string = "general";

  constructor(private readit: ReadIt) {
      this.modalContainer = document.createElement("div");
      document.body.appendChild(this.modalContainer);

      this.injectButton();
      this.listenForNavigations();
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

  goToPage = (id: string) => {
    this.history.push(this.activePage);
    this.activePage = id;
    this.render();
  }

  goBack() {
    this.activePage = this.history.pop() || "general";
    this.render();
  }

  // Inject the button into navbar
  injectButton() {
    const container = document.querySelector(
      "body > shreddit-app > reddit-header-large > reddit-header-action-items > header > nav > div.ps-lg.gap-xs.flex.items-center.justify-end "
    );

    if (!container || this.isSettingsVisible()) return;

    const btnDiv = document.createElement("div");
    container.appendChild(btnDiv);
    Nano.render(<SettingsButton onClick={this.open} />, btnDiv);
  }

  // If the user clicks a post, comment, or subreddit link, the navbar re-renders and we lose our button.
  listenForNavigations() {
    (unsafeWindow as any).navigation.onnavigatesuccess = () => {
      if (!this.isSettingsVisible()) {
        this.injectButton();
      }
    }
  }

  registerSettingsTile(content: TileProps) {
    this.tiles.push(content);
    this.render();
    return () => {
      const idx = this.tiles.indexOf(content);
      if (idx !== -1) {
        this.tiles.splice(idx, 1);
        this.render();
      }
    };
  }

  registerSettingsPage(page: SettingsPage) {
    this.pages.push(page);
    this.render();
    return () => {
      const idx = this.pages.indexOf(page);
      if (idx !== -1) {
        this.pages.splice(idx, 1);
        this.render();
      }
    };
  }

  registerNavigationTile(tile: NavigationTileProps){
    this.tiles.push({
      title: tile.title,
      description: tile.description,
      icon: tile.icon,
      onClick: () => {
        this.goToPage(tile.id);
      }
    });
    this.render();
    return () => {
      const idx = this.tiles.indexOf(tile);
      if (idx !== -1) {
        this.tiles.splice(idx, 1);
        this.render();
      }
    };
  }

  render() {
    Nano.render(
      <SettingsModal
        visible={this.visible}
        onClose={this.close}
        items={this.tiles}
        pages={this.pages}
        activePage={this.activePage}
        onGoBack={()=> this.goBack()}
      />,
      this.modalContainer
    );
  }
}
