import { expose } from "@api/expose";
import { chain } from "@modules/filters";
import { mapMangledModule } from "@modules/utils";
import {
    filters as moduleFilters,
    waitForModule,
} from "@modules/loader/lookup";
import { filters as exportFilters } from "@modules/filters";
import { startPluginsFromLifeCycle } from "@api/plugins/manager";
import { PluginLifeCycle } from "@api/plugins";
import { defineElements } from "@api/elements";

type LitExports = {
    html: typeof import("lit").html;
    LitElement: typeof import("lit").LitElement;
    css: typeof import("lit").css;
    noChange: typeof import("lit").noChange;
    nothing: typeof import("lit").nothing;
    render: typeof import("lit").render;
    mangled: {
        [key: string]: any;
    };
};

let lit: LitExports;

export default lit;

export let html: typeof import("lit").html;
export let LitElement: typeof import("lit").LitElement;
export let css: typeof import("lit").css;
export let noChange: typeof import("lit").noChange;
export let nothing: typeof import("lit").nothing;
export let render: typeof import("lit").render;

waitForModule(
    chain.all(
        moduleFilters.byCode(
            // Lit's "nothing" or "noChange" symbols.
            /Symbol\.for\("lit-(?:noChange|nothing)"\)/,
            // Idk but "$lit$" is in the factory.
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
        const resolvedLit: LitExports = mapMangledModule(litMangled, {
            html: chain.all(
                // Rough orginisation of parameters (strings, ...values).
                exportFilters.byCode(/\(\i,(\s?)+\.{3}\i\)/),
                // Make sure to get the html export and not the svg.
                (e) => {
                    try {
                        return (e()._$litType$ ?? 0) == 1;
                    } catch {
                        return false;
                    }
                },
            ),
            LitElement: exportFilters.byPrototypeKeys("render", "update"),
            render: chain.all(
                exportFilters.byCode("_$litPart$", /\i.insertBefore/),
                // (result, container, options)
                exportFilters.byParameterCount(3),
            ),
            // The string used in an error in the css export.
            css: exportFilters.byCode("Value passed to 'css'"),
            // We could directly use Symbol.for(...) but where's the fun in that?
            noChange: (e) => e == Symbol.for("lit-noChange"),
            nothing: (e) => e == Symbol.for("lit-nothing"),
        });

        lit = {
            ...resolvedLit,
            mangled: litMangled.exports,
        };

        ({ html, css, LitElement, noChange, nothing, render } = lit);

        startPluginsFromLifeCycle(PluginLifeCycle.LitReady);
        defineElements();

        expose(lit, "readit.modules.common.lit");
    },
);
