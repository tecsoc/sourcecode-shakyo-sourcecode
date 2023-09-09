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
import { javascript } from "@codemirror/lang-javascript";
import { highlightSelectionMatches } from "@codemirror/search";
import { foldGutter, defaultHighlightStyle, syntaxHighlighting, foldKeymap } from "@codemirror/language";
import { autocompletion } from "@codemirror/autocomplete";
import styles from "./CodeMirrorEditor.module.sass";

type CodeMirrorProps = {
  extensions?: Extension[];
  value?: string;
  editable?: boolean;
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
  javascript(),
  autocompletion({
    activateOnTyping: false,
    defaultKeymap: false
  })
];

const CodeMirror = ({ extensions = [], value = "", editable = true }: CodeMirrorProps) => {
  const editView = useRef<EditorView>(null!);

  const ref = useCallback(
    (node: HTMLDivElement) => {
      if (editView.current) return;
      editView.current = new EditorView({
        state: EditorState.create({
          doc: value,
          extensions: [...defaultExtensions, EditorView.editable.of(editable), ...extensions]
        }),
        parent: node
      });
    },
    [editable, extensions, value]
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
    //estensionを取得して、domEventHandlersを上書き更新するトランザクションを作成
    editView.current.dispatch({
      effects: StateEffect.reconfigure.of([...defaultExtensions, EditorView.editable.of(editable), ...extensions])
    });
  }, [editable, extensions]);

  return <div className={styles.editor} ref={ref} />;
};

export default React.memo(CodeMirror);
