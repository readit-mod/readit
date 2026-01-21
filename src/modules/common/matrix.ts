import { chain } from "@modules/filters";
import { filters, waitForModule } from "@modules/loader/lookup";

export let Matrix: Partial<typeof import("matrix-js-sdk")>;

// Matrix is one of the last modules to be ready.
// So this promise resolves once it's module is registered.
export const matrixReady: Promise<void> = new Promise((resolve) => {
    waitForModule(
        /*
            For whatever reason, Matrix exports are unmangled,
            but just in case, we'll add a fallback. 
        */
        chain.any(
            filters.byProps("User", "Room"),
            filters.byCode("org.matrix", "reEmitter"),
        ),
        (matrix) => {
            Matrix = matrix.exports;
            resolve();
        },
    );
});
