"use client";

import fetchUrlFromText from "@/app/modules/fetchUrlFromText";
import { TextField, Button } from "@mui/material";
import { EditorView } from "codemirror";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./TopPage.module.sass";
import CodeMirrorEditor from "@/app/components/atoms/CodeMirrorEditor/CodeMirrorEditor";
import { useLocalStorageInputElementRef, useLocalStorageState } from "@/app/modules/useLocalStorage";

const TopPage = () => {
  const [importSourceUrlElementRef, setimportSourceUrlElementRef, setImportSourceUrl] = useLocalStorageInputElementRef(
    "importSourceUrl",
    ""
  );
  const [typingSourceCodeString, setTypingSourceCodeString] = useLocalStorageState("typingSourceCodeString", "");
  const [answerSourceCodeString, setAnswerSourceCodeString] = useState("");

  const importSourceCode = useCallback(async () => {
    const url = importSourceUrlElementRef.current.value;
    if (url) {
      try {
        const text = await fetchUrlFromText(url);
        setImportSourceUrl(url);
        setAnswerSourceCodeString(text);
      } catch (e) {
        console.error(e);
      }
    }
  }, [importSourceUrlElementRef, setImportSourceUrl, setAnswerSourceCodeString]);

  const editorOnInput = useCallback(
    (e: Event, updateView: EditorView) => {
      const codeString = updateView.state.doc.toString();
      const [_isCorrect, updateString] = codeString.split("").reduce(
        ([currntIsCollect, prevStr], currentStr) => {
          if (!currntIsCollect) return [currntIsCollect, prevStr];
          const concatStr = prevStr + currentStr;
          const nextIsCollect = concatStr === answerSourceCodeString.slice(0, concatStr.length);
          const nextStr = nextIsCollect ? concatStr : prevStr;
          return [nextIsCollect, nextStr];
        },
        [true, ""]
      );
      updateView.dispatch({
        changes: {
          from: 0,
          to: codeString.length,
          insert: updateString
        }
      });
    },
    [answerSourceCodeString]
  );

  const editorOnPaste = useCallback((event: ClipboardEvent, _updateView: EditorView) => {
    event.preventDefault();
  }, []);

  const extensions = useMemo(
    () => [
      EditorView.domEventHandlers({
        paste: editorOnPaste,
        input: editorOnInput
      })
    ],
    [editorOnPaste, editorOnInput]
  );

  useEffect(() => {
    (async () => {
      const text = await fetchUrlFromText(importSourceUrlElementRef.current.value);
      setAnswerSourceCodeString(text);
    })();
  }, [setAnswerSourceCodeString, importSourceUrlElementRef]);

  useEffect(() => {
    setTypingSourceCodeString("");
  }, [answerSourceCodeString, setTypingSourceCodeString]);

  return (
    <main className={styles.main}>
      <h1>Sourcecode Shakyo Typing</h1>
      <h2>(means to copy sutras by hand on paper)</h2>
      <div className={styles.github_url_wrapper}>
        <TextField fullWidth placeholder="GitHub sourcecode raw URL" inputRef={setimportSourceUrlElementRef} />
        <Button variant="contained" onClick={importSourceCode}>
          Import
        </Button>
      </div>
      <div className={styles.editor_wrapper}>
        <CodeMirrorEditor value={typingSourceCodeString} extensions={extensions} />
        <CodeMirrorEditor value={answerSourceCodeString} editable={false} />
      </div>
    </main>
  );
};
export default TopPage;
