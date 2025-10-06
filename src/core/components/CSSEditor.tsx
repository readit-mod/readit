import { Component } from "nano-jsx";
import { readit } from "@/core/modules/readit";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { indentUnit } from "@codemirror/language";
import { css } from "@codemirror/lang-css";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

export class CSSEditor extends Component {
  editor: EditorView | null = null;
  containerRef: HTMLDivElement | null = null;
  code: string = "";

  async didMount() {
    this.code = await readit.storage.get("core", "customcss", "");

    const onUpdate = EditorView.updateListener.of((v)=>{
        if(v.docChanged) {
            this.code = v.state.doc.toString();
            readit.customcss.setRootStyle(this.code);
            readit.storage.set("core", "customcss", this.code);
        }
    });

    const state = EditorState.create({
    doc: this.code,
    extensions: [
      vscodeDark,
      basicSetup,
      css(),
      onUpdate,
      indentUnit.of("  "),
      keymap.of([indentWithTab])
    ],
    });

    this.editor = new EditorView({
      state,
      parent: this.containerRef!,
    });

  }

  render() {
    return (
      <div
        ref={(el) => (this.containerRef = el)}
        style={{ width: "100%", height: "300px", border: "1px solid #333" }}
      />
    );
  }
}
