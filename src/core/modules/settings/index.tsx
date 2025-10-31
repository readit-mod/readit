import { render } from "preact";
import { SettingsContent } from "@/core/components/SettingsContent";
import { SettingsButton } from "@/core/components/SettingsButton";
import { Modal } from "@/core/components/Modal";
import { ErrorBoundary } from "@/core/components/ErrorBoundary";
import { ReadIt } from "@/core/modules/readit";
import { TileProps, SettingsPage, NavigationTileProps } from "@/lib/types";

export class Settings {
    modalContainer: HTMLElement;
    visible = false;
    title: string;
    tiles: TileProps[] = [];
    pages: Map<string, SettingsPage> = new Map<string, SettingsPage>();
    history: string[] = [];
    activePageId: string = "general";

    get activePage(): SettingsPage | undefined {
        return this.pages.get(this.activePageId);
    }

    constructor(private readit: ReadIt) {
        this.modalContainer = document.createElement("div");
        document.body.appendChild(this.modalContainer);

        this.pages.set("general", {
            id: "general",
            title: "General",
            items: this.tiles,
        });

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
        this.history.push(this.activePageId);
        this.activePageId = id;
        this.render();
    };

    goBack = () => {
        this.activePageId = this.history.pop() || "general";
        this.render();
    };

    // Inject the button into navbar
    injectButton() {
        const container = document.querySelector(
            "body > shreddit-app > reddit-header-large > reddit-header-action-items > header > nav > div.ps-lg.gap-xs.flex.items-center.justify-end ",
        );

        if (!container || this.isSettingsVisible()) return;

        const btnDiv = document.createElement("div");
        container.appendChild(btnDiv);
        render(<SettingsButton onClick={this.open} />, btnDiv);
    }

    // If the user clicks a post, comment, or subreddit link, the navbar re-renders and we lose our button.
    listenForNavigations() {
        (window as any).navigation.onnavigatesuccess = () => {
            if (!this.isSettingsVisible()) {
                this.injectButton();
            }
        };
    }

    setTitle(title: string) {
        this.title = title;
        this.render();
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
        this.pages.set(page.id, page);
        this.render();
        return () => {
            this.pages.delete(page.id);
            this.render();
        };
    }

    registerNavigationTile(tile: NavigationTileProps) {
        this.tiles.push({
            title: tile.title,
            description: tile.description,
            icon: tile.icon,
            onClick: () => {
                this.goToPage(tile.id);
            },
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
        render(
            <Modal
                title={this.activePage.title}
                visible={this.visible}
                onClose={this.close}
            >
                <ErrorBoundary>
                    <SettingsContent
                        items={this.tiles}
                        pages={this.pages}
                        activePage={this.activePage}
                        onGoBack={this.goBack}
                    />
                </ErrorBoundary>
            </Modal>,
            this.modalContainer,
        );
    }
}
