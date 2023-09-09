"use client";

import fetchUrlFromText from "@/app/modules/fetchUrlFromText";
import { TextField, Button } from "@mui/material";
import { EditorView } from "codemirror";
import { DOMEventMap } from "@codemirror/view";
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import styles from "./TopPage.module.sass";
import CodeMirrorEditor from "@/app/components/atoms/CodeMirrorEditor/CodeMirrorEditor";
import { useLocalStorageInputElementRef, useLocalStorageState} from "@/app/modules/useLocalStorage";


const TopPage = () => {
  const [importSourceUrlElementRef, setimportSourceUrlElementRef, setImportSourceUrl] = useLocalStorageInputElementRef("importSourceUrl", "");
  const [typingSourceCodeString, setTypingSourceCodeString] = useLocalStorageState("typingSourceCodeString", "");
  const [answerSourceCodeString, setAnswerSourceCodeString] = useState("");

  const importSourceCode = useCallback(async () => {
    const url = importSourceUrlElementRef.current.value;
    if (url) {
      try{
        const text = await fetchUrlFromText(url);
        setImportSourceUrl(url);
        setAnswerSourceCodeString(text);
      }
      catch(e){
        console.error(e);
      }
    }
  }, [importSourceUrlElementRef, setImportSourceUrl, setAnswerSourceCodeString]);

  
  const editorOnInput = useCallback(
    (event: DOMEventMap["input"], updateView: EditorView) => {
      const codeString = updateView.state.doc.toString();
      setTypingSourceCodeString(codeString);
    },
    [setTypingSourceCodeString]
  );

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
    
    useLayoutEffect(() => {
      (async () => {
        const text = await fetchUrlFromText(importSourceUrlElementRef.current.value);
        setAnswerSourceCodeString(text);
      })();
    },[setAnswerSourceCodeString, importSourceUrlElementRef]);

  useEffect(() => {
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
  }, [typingSourceCodeString, answerSourceCodeString, setTypingSourceCodeString]);

  useEffect(() => {
    setTypingSourceCodeString("");
  },[answerSourceCodeString, setTypingSourceCodeString]);

  return (
    <main className={styles.main}>
      <h1>Sourcecode Shakyo Typing</h1>
      <h2>(means to copy sutras by hand on paper)</h2>
      <div className={styles.github_url_wrapper}>
        <TextField
          fullWidth
          placeholder="GitHub sourcecode raw URL"
          inputRef={setimportSourceUrlElementRef}
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
