'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState, Extension } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import styles from './CodeMirrorEditor.module.sass';

function useCodeMirror(extensions: Extension[]) {
  const [element, setElement] = useState<HTMLElement>();

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const view = new EditorView({
      state: EditorState.create({
        extensions: [basicSetup, javascript(), ...extensions]
      }),
      parent: element
    });

    return () => view?.destroy();
  }, [element, extensions]);

  return { ref };
}

type CodeMirrorProps = {
  extensions: Extension[];
};

const CodeMirror = ({ extensions }: CodeMirrorProps) => {
  const { ref } = useCodeMirror(extensions);

  return <div className={styles.editor} ref={ref} />;
};

export default CodeMirror;
