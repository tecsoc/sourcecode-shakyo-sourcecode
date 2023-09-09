"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { EditorView } from "codemirror";
import { EditorState, Extension, StateEffect } from "@codemirror/state";
import {
  lineNumbers,
  highlightActiveLineGutter,
  highlightSpecialChars,
  highlightActiveLine,
  dropCursor,
  drawSelection,
  keymap
} from "@codemirror/view";
import { highlightSelectionMatches } from "@codemirror/search";
import {
  foldGutter,
  defaultHighlightStyle,
  syntaxHighlighting,
  foldKeymap,
  LanguageDescription
} from "@codemirror/language";
import { autocompletion } from "@codemirror/autocomplete";
import styles from "./CodeMirrorEditor.module.sass";
import { languages } from "@codemirror/language-data";

type CodeMirrorProps = {
  extensions?: Extension[];
  value?: string;
  editable?: boolean;
  fileName: string;
};

const customBasicSetup = [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  foldGutter(),
  drawSelection(),
  dropCursor(),
  syntaxHighlighting(defaultHighlightStyle),
  autocompletion(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([...foldKeymap])
];

const defaultExtensions = [
  customBasicSetup,
  autocompletion({
    activateOnTyping: false,
    defaultKeymap: false
  })
];

const CodeMirror = ({ extensions = [], value = "", editable = true, fileName }: CodeMirrorProps) => {
  const editView = useRef<EditorView>(null!);

  const ref = useCallback(
    async (node: HTMLDivElement) => {
      const lang = await LanguageDescription.matchFilename(languages, fileName)?.load();
      if (editView.current) return;
      editView.current = new EditorView({
        state: EditorState.create({
          doc: value,
          extensions: [
            ...defaultExtensions,
            EditorView.editable.of(editable),
            ...extensions,
            ...(lang?.extension ? [lang.extension] : [])
          ]
        }),
        parent: node
      });
    },
    [editable, extensions, fileName, value]
  );

  useEffect(() => {
    editView.current.dispatch({
      changes: {
        from: 0,
        to: editView.current?.state.doc.length,
        insert: value
      }
    });
  }, [value]);

  useEffect(() => {
    (async () => {
      const lang = await LanguageDescription.matchFilename(languages, fileName)?.load();
      editView.current.dispatch({
        effects: StateEffect.reconfigure.of([
          ...defaultExtensions,
          EditorView.editable.of(editable),
          ...(lang?.extension ? [lang.extension] : []),
          ...extensions
        ])
      });
    })();
  }, [editable, extensions, fileName]);

  return <div className={styles.editor} ref={ref} />;
};

export default React.memo(CodeMirror);
