import { expose } from "./expose";

/**
 * Inspired by Vencord's `canonicalizeMatch`.
 *
 * Normalises the RegExp match, replacing `\i` with a match for any JS variable.
 *
 * @example
 * ```ts
 * normaliseMatch(/\i = 5/).test("x = 5")
 * // true
 * ```
 *
 * @param match The RegExp to normalise.
 * @returns The final RegExp.
 */
export function normaliseMatch(match: RegExp): RegExp {
    const str = match.source;

    return new RegExp(
        str.replaceAll(/(\\*)\\i/g, (match, leadingEscapes) =>
            leadingEscapes.length % 2 === 0
                ? `${leadingEscapes}${String.raw`(?:[A-Za-z_$][\w$]*)`}`
                : match.slice(1),
        ),
        match.flags,
    );
}

expose(normaliseMatch, "readit.api.regexp.normaliseMatch");
