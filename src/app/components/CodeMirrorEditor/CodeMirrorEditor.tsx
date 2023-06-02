'use client';

import React, { useCallback, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState, Extension } from '@codemirror/state';
import { DOMEventHandlers, ViewUpdate } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { defaultKeymap } from '@codemirror/commands';
import { autocompletion } from '@codemirror/autocomplete';
import styles from './CodeMirrorEditor.module.sass';

type EventHandlerReturnValueType = boolean | void;
type CodeMirrorProps = {
  extensions?: Extension[];
  value?: string;
  enable?: boolean;
  onChange?: (updateView: EditorView) => EventHandlerReturnValueType;
  domEventHandlers?: DOMEventHandlers<any>;
};

const CodeMirror = ({
  extensions = [],
  value = '',
  enable = true,
  onChange = () => {},
  domEventHandlers = {}
}: CodeMirrorProps) => {
  const editView = useRef<EditorView | null>(null);

  const ref = useCallback((node: HTMLDivElement) => {
    console.log(defaultKeymap);
    editView.current = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          javascript(),
          EditorView.editable.of(enable),
          EditorView.updateListener.of((update: ViewUpdate) => {
            if (onChange) onChange(update.view);
          }),
          EditorView.domEventHandlers(domEventHandlers),
          autocompletion({
            activateOnTyping: false,
            defaultKeymap: false
          }),
          ...extensions
        ]
      }),
      parent: node
    });
    return () => {
      editView.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (editView.current && editView.current.state.doc.toString() !== value) {
    editView.current?.dispatch({
      changes: {
        from: 0,
        to: editView.current?.state.doc.length,
        insert: value
      }
    });
  }

  return <div className={styles.editor} ref={ref} />;
};

export default React.memo(CodeMirror);
