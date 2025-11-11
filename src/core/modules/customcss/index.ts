import { ReadIt } from "@modules/readit";

export class CustomCss {
    rootStyleSheet: CSSStyleSheet;
    styleSheets: CSSStyleSheet[] = [];

    constructor(private readit: ReadIt) {
        this.rootStyleSheet = new CSSStyleSheet();
        document.adoptedStyleSheets.push(this.rootStyleSheet);
    }

    addRule(rule: string) {
        this.rootStyleSheet.insertRule(rule, 0);
    }

    setRootStyle(css: string) {
        this.rootStyleSheet.replaceSync(css);
    }

    createStyleSheet(): CSSStyleSheet {
        const sheet = new CSSStyleSheet();
        this.styleSheets.push(sheet);
        document.adoptedStyleSheets.push(sheet);
        return sheet;
    }
}
