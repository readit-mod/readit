import { expose } from "@api/expose";
import { chain } from "@api/filters";
import { mapMangledModule } from "@modules/utils";
import {
    filters as moduleFilters,
    waitForModule,
} from "@modules/loader/lookup";
import { filters as exportFilters } from "@api/filters";
import { startPluginsFromLifeCycle } from "@api/plugins/manager";
import { PluginLifeCycle } from "@api/plugins";
import { defineElements } from "@api/elements";

type LitExports = {
    html: typeof import("lit").html;
    svg: typeof import("lit").svg;
    LitElement: typeof import("lit").LitElement;
    css: typeof import("lit").css;
    noChange: typeof import("lit").noChange;
    nothing: typeof import("lit").nothing;
    render: typeof import("lit").render;
    mangled: {
        [key: string]: any;
    };
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

function byLitType(type: number): (fn: Fn) => boolean {
    return (e) => {
        try {
            return (e()._$litType$ ?? 0) == type;
        } catch {
            return false;
        }
    };
}

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

        const resolvedLit: LitExports = mapMangledModule(litMangled, {
            html: chain.all(
                exportFilters.byCode(/\(\i,(\s?)+\.{3}\i\)/),
                byLitType(1),
            ),
            svg: chain.all(
                exportFilters.byCode(/\(\i,(\s?)+\.{3}\i\)/),
                byLitType(2),
            ),
            LitElement: exportFilters.byPrototypeKeys("render", "update"),
            render: chain.all(
                exportFilters.byCode("_$litPart$", /\i\.insertBefore/),
                exportFilters.byParameterCount(3),
            ),
            css: exportFilters.byCode("Value passed to 'css'"),
            // We could directly use Symbol.for(...) but where's the fun in that?
            noChange: (e) => e == Symbol.for("lit-noChange"),
            nothing: (e) => e == Symbol.for("lit-nothing"),
        });

        Lit = {
            ...resolvedLit,
            mangled: litMangled.exports,
        };

        ({ html, svg, css, LitElement, noChange, nothing, render } = Lit);

        startPluginsFromLifeCycle(PluginLifeCycle.LitReady);
        defineElements();

        expose(Lit, "readit.modules.common.lit");
    },
);
