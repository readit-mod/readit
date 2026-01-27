import { expose } from "@api/expose";
import { chain } from "@modules/filters";
import { filters, waitForModule } from "@modules/loader/lookup";

export let Matrix: Partial<typeof import("matrix-js-sdk")>;
export let MatrixModule: string;

// We don't use it but oh well.
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
        MatrixModule = matrix.id;
        Matrix = matrix.exports;

        expose(Matrix, "readit.modules.common.matrix");
    },
);
