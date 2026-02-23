import { expose } from "./expose";

const customCssSheets: Map<string, CSSStyleSheet> = new Map();

export function createCustomCssSheet(id: string, initialCssText: string): CSSStyleSheet {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(initialCssText);

    if (customCssSheets.has(id)) {
        customCssSheets.set(id, sheet);
    } else {
        customCssSheets.set(id, sheet);
    }
    document.adoptedStyleSheets.push(sheet);

    return sheet;
}

export function updateCustomCssSheet(id: string, newCssText: string): void {
    const sheet = customCssSheets.get(id);

    if (sheet) {
        sheet.replaceSync(newCssText);
    } else {
        createCustomCssSheet(id, newCssText);
    }
}

export function removeCustomCssSheet(id: string, destroy = true): void {
    const sheet = customCssSheets.get(id);

    if (sheet) {
        if (destroy) {
            const index = document.adoptedStyleSheets.indexOf(sheet);
            if (index !== -1) {
                const adoptedSheets = Array.from(document.adoptedStyleSheets);
                adoptedSheets.splice(index, 1);
                document.adoptedStyleSheets = adoptedSheets;
            }
            customCssSheets.delete(id);
        } else {
            sheet.replaceSync("");
        }
    }
}

expose(
    {
        createCustomCssSheet,
        updateCustomCssSheet,
        removeCustomCssSheet,
    },
    "readit.api.customcss",
);
