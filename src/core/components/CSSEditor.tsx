import { useEffect, useRef } from "preact/hooks";
import { readit } from "@modules/readit";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { indentUnit } from "@codemirror/language";
import { css } from "@codemirror/lang-css";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

export function CSSEditor() {
    const containerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<EditorView | null>(null);

    useEffect(() => {
        let editor: EditorView | null = null;
        let disposed = false;

        async function setupEditor() {
            const code = await readit.storage.get("core", "customcss", "");

            if (disposed) return; // avoid setting up if unmounted early

            const onUpdate = EditorView.updateListener.of((v) => {
                if (v.docChanged) {
                    const newCode = v.state.doc.toString();
                    readit.customcss.setRootStyle(newCode);
                    readit.storage.set("core", "customcss", newCode);
                }
            });

            const state = EditorState.create({
                doc: code,
                extensions: [
                    vscodeDark,
                    basicSetup,
                    css(),
                    onUpdate,
                    indentUnit.of("    "),
                    keymap.of([indentWithTab]),
                ],
            });

            editor = new EditorView({
                state,
                parent: containerRef.current!,
            });

            editorRef.current = editor;
        }

        setupEditor();

        return () => {
            disposed = true;
            editor?.destroy();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ width: "100%", height: "300px", border: "1px solid #333" }}
        />
    );
}
