'use client';

import fetchUrlFromText from '@/app/modules/fetchUrlFromText';
import { TextField, Button } from '@mui/material';
import { EditorView } from 'codemirror';
import { DOMEventMap } from '@codemirror/view';
import React, { useState, useCallback, useMemo, useRef } from 'react';
import styles from './TopPage.module.sass';
import CodeMirrorEditor from '@/app/components/atoms/CodeMirrorEditor/CodeMirrorEditor';
import { useDidUpdateEffect } from '@/app/modules/useDidUpdateEffect';
import CommonHead from '@/app/components/atoms/CommonHead';
import RootLayout from '@/app/layout';

const TopPage = () => {
  const importSourceUrlRef = useRef<HTMLInputElement | null>(null);
  const [typingSourceCodeString, setTypingSourceCodeString] = useState<string>('');
  const [answerSourceCodeString, setAnswerSourceCodeString] = useState<string>('');

  const importSourceCode = useCallback(async () => {
    const url = importSourceUrlRef.current?.value;
    if (url) {
      setAnswerSourceCodeString(await fetchUrlFromText(url));
      setTypingSourceCodeString('');
    }
  }, [setAnswerSourceCodeString]);

  const editorOnInput = useCallback((event: DOMEventMap['input'], updateView: EditorView) => {
    const codeString = updateView.state.doc.toString();
    setTypingSourceCodeString(codeString);
  }, []);

  useDidUpdateEffect(() => {
    let updateString = '';
    const _wrongFlag = ((): boolean => {
      for (let i = 0; i < typingSourceCodeString.length; i++) {
        const char = typingSourceCodeString[i];
        if (char === answerSourceCodeString[i]) {
          updateString += char;
        } else {
          return true;
        }
      }
      return false;
    })();
    if (updateString !== typingSourceCodeString) setTypingSourceCodeString(updateString);
  }, [typingSourceCodeString, answerSourceCodeString]);

  const editorOnPaste = useCallback(() => false, []);
  const domEventHandlers = useMemo(
    () => ({
      paste: editorOnPaste,
      input: editorOnInput
    }),
    [editorOnPaste, editorOnInput]
  );

  return <>
  <RootLayout>
    <CommonHead title='写経タイピング' description='ソースコードを写経しながらタイピングの練習をしましょう。' />
    <main className={styles.main}>
      <h1>写経タイピング</h1>
      <div className={styles.github_url_wrapper}>
        <TextField
          fullWidth
          defaultValue="https://raw.githubusercontent.com/mui/material-ui/master/scripts/build.mjs"
          placeholder="GitHub コードURL"
          inputRef={importSourceUrlRef}
        />
        <Button variant="contained" onClick={importSourceCode}>
          インポート
        </Button>
      </div>
      <div className={styles.editor_wrapper}>
        <CodeMirrorEditor value={typingSourceCodeString} domEventHandlers={domEventHandlers} />
        <CodeMirrorEditor value={answerSourceCodeString} enable={false} />
      </div>
    </main>
  </RootLayout>
  </>;
};
export default TopPage;
