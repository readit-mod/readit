export { jsx, jsxs } from "./runtime";

export const Fragment = ({ children }) =>
    Array.isArray(children)
        ? children
        : [
              children,
          ];
