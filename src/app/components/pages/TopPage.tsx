"use client";

import fetchUrlFromText from "@/app/modules/fetchUrlFromText";
import { TextField, Button } from "@mui/material";
import { EditorView } from "codemirror";
import { DOMEventMap } from "@codemirror/view";
import React, { useCallback, useMemo, useRef } from "react";
import styles from "./TopPage.module.sass";
import CodeMirrorEditor from "@/app/components/atoms/CodeMirrorEditor/CodeMirrorEditor";
import { useDidUpdateEffect } from "@/app/modules/useDidUpdateEffect";
import useLocalStorage from "@/app/modules/useLocalStorage";

const TopPage = () => {
  const importSourceUrlRef = useRef<HTMLInputElement | null>(null);
  const [typingSourceCodeString, setTypingSourceCodeString] = useLocalStorage<string>("typingSourceCodeString", "");
  const [answerSourceCodeString, setAnswerSourceCodeString] = useLocalStorage<string>("answerSourceCodeString", "");

  const importSourceCode = useCallback(async () => {
    const url = importSourceUrlRef.current?.value;
    if (url) {
      setAnswerSourceCodeString(await fetchUrlFromText(url));
      setTypingSourceCodeString("");
    }
  }, [setAnswerSourceCodeString, setTypingSourceCodeString]);

  const editorOnInput = useCallback(
    (event: DOMEventMap["input"], updateView: EditorView) => {
      const codeString = updateView.state.doc.toString();
      setTypingSourceCodeString(codeString);
    },
    [setTypingSourceCodeString]
  );

  useDidUpdateEffect(() => {
    let updateString = "";
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

  const editorOnPaste = useCallback((event: DOMEventMap["paste"], _updateView: EditorView) => {
    event.preventDefault();
  }, []);
  const domEventHandlers = useMemo(
    () => ({
      paste: editorOnPaste,
      input: editorOnInput
    }),
    [editorOnPaste, editorOnInput]
  );

  return (
    <main className={styles.main}>
      <h1>Sourcecode Shakyo Typing</h1>
      <h2>(means to copy sutras by hand on paper)</h2>
      <div className={styles.github_url_wrapper}>
        <TextField
          fullWidth
          defaultValue="https://raw.githubusercontent.com/mui/material-ui/master/scripts/build.mjs"
          placeholder="GitHub Sourcecode raw URL"
          inputRef={importSourceUrlRef}
        />
        <Button variant="contained" onClick={importSourceCode}>Import</Button>
      </div>
      <div className={styles.editor_wrapper}>
        <CodeMirrorEditor value={typingSourceCodeString} domEventHandlers={domEventHandlers} />
        <CodeMirrorEditor value={answerSourceCodeString} enable={false} />
      </div>
    </main>
  );
};
export default TopPage;
