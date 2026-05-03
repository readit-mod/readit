import type { LitElement } from "lit";

export type TypedElement<T extends Record<string, any>> = Element & T;

export type TypedLitElement<T extends Record<string, any>> = LitElement & T;
