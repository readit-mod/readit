import { defineElements } from "@api/elements";
import { expose } from "@api/expose";
import { chain, filters as exportFilters } from "@api/filters";
import { PluginLifeCycle } from "@api/plugins";
import { startPluginsFromLifeCycle } from "@api/plugins/manager";
import { filters as moduleFilters, waitForModule } from "@modules/loader/lookup";
import { mapMangledModule } from "@modules/utils";

type LitExports = {
    html: typeof import("lit").html;
    svg: typeof import("lit").svg;
    LitElement: typeof import("lit").LitElement;
    css: typeof import("lit").css;
    noChange: typeof import("lit").noChange;
    nothing: typeof import("lit").nothing;
    render: typeof import("lit").render;
    Directive?: typeof import("lit/directive.js").Directive;
    directive?: typeof import("lit/directive.js").directive;
    mangled: {
        [key: string]: unknown;
    };
};

type OtherExports = {
    Directive: typeof import("lit/directive.js").Directive;
    directive: typeof import("lit/directive.js").directive;
};

let Lit: LitExports;

export default Lit;
export let LitModuleID: string;

export let html: typeof import("lit").html;
export let svg: typeof import("lit").svg;
export let LitElement: typeof import("lit").LitElement;
export let css: typeof import("lit").css;
export let noChange: typeof import("lit").noChange;
export let nothing: typeof import("lit").nothing;
export let render: typeof import("lit").render;

export let directive: typeof import("lit/directive.js").directive;
export let Directive: typeof import("lit/directive.js").Directive;

function byLitType(type: number): (fn: Fn) => boolean {
    return (e) => {
        try {
            return (e()._$litType$ ?? 0) === type;
        } catch {
            return false;
        }
    };
}

Promise.all([
    new Promise<void>((resolve) => {
        waitForModule(
            chain.all(
                moduleFilters.byCode(
                    // Lit's "nothing" or "noChange" symbols.
                    /Symbol\.for\("lit-(?:noChange|nothing)"\)/,
                    "$lit$",
                ),
                /*
                Another module matches the same strings above
                but it has dependencies and no exports, so we
                make sure the module we're looking for has no
                dependencies and has exports.
            */
                moduleFilters.byDepsCount(0),
                moduleFilters.byHasExports(true),
            ),
            (litMangled) => {
                LitModuleID = litMangled.id;

                const litModule: LitExports = mapMangledModule(litMangled, {
                    html: chain.all(exportFilters.byCode(/\(\i,(\s?)+\.{3}\i\)/), byLitType(1)),
                    svg: chain.all(exportFilters.byCode(/\(\i,(\s?)+\.{3}\i\)/), byLitType(2)),
                    LitElement: exportFilters.byPrototypeKeys("render", "update"),
                    render: chain.all(
                        exportFilters.byCode("_$litPart$", /\i\.insertBefore/),
                        exportFilters.byParameterCount(3),
                    ),
                    css: exportFilters.byCode("Value passed to 'css'"),
                    // We could directly use Symbol.for(...) but where's the fun in that?
                    noChange: (e) => e === Symbol.for("lit-noChange"),
                    nothing: (e) => e === Symbol.for("lit-nothing"),
                });

                Lit = {
                    ...litModule,
                    mangled: litMangled.exports,
                };

                ({ html, svg, css, LitElement, noChange, nothing, render } = Lit);

                resolve();
            },
        );
    }),
    new Promise<void>((resolve) => {
        waitForModule(
            chain.all(
                moduleFilters.byCode("attrs directive", "_$litDirective$"),
                moduleFilters.byDepsCount(1),
            ),
            (mangled) => {
                const otherExports = mapMangledModule<OtherExports>(mangled, {
                    Directive: chain.all(
                        exportFilters.byPrototypeKeys("update"),
                        chain.none(
                            exportFilters.byProps("elementProperties"),
                            exportFilters.byPrototypeKeys("disconnected"),
                        ),
                    ),
                    directive: chain.all(
                        exportFilters.byCode(/\i(\s?)+=>(\s?)+\(\.{3}\i\)/),
                        exportFilters.byParameterCount(1),
                    ),
                });

                Lit.Directive = otherExports.Directive;
                Lit.directive = otherExports.directive;

                ({ directive, Directive } = otherExports);
                resolve();
            },
        );
    }),
]).then(() => {
    startPluginsFromLifeCycle(PluginLifeCycle.LitReady);
    defineElements();
    expose(Lit, "readit.modules.common.lit");
});
