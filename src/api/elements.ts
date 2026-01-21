const elementFactoryMap = new Map<string, () => LitElementCtor>();

/**
 * A way to defer defining the element until Lit is initialised.
 * @param name The name to register the element with.
 * @param factory The factory which returns the element.
 */
export function defineSafeElement(name: string, factory: () => LitElementCtor) {
    if (!elementFactoryMap.has(name)) elementFactoryMap.set(name, factory);
}

export function defineElements() {
    for (const [name, elementFactory] of elementFactoryMap) {
        const element = elementFactory();

        customElements.define(name, element);
    }
}
