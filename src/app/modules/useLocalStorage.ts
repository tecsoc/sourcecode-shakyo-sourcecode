import isClientSide from "@/app/modules/isClientSide";
import React, { useCallback, useMemo, useRef, useState } from "react";

export const getInitialLocalStorageValue = <T>(key: string, initialValue: T): T =>
  JSON.parse((isClientSide() && localStorage?.getItem(key)) || JSON.stringify(initialValue));
export const setLocalStorageValue = <T>(key: string, value: T) => localStorage.setItem(key, JSON.stringify(value));

export const useLocalStorageState = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState(() => getInitialLocalStorageValue(key, initialValue));

  const setLocalStorageAndSetValue = useCallback(
    (value: T) => {
      try {
        setLocalStorageValue(key, value);
        setValue(value);
      } catch (error) {
        console.error(error);
      }
    },
    [key]
  );

  const returnValues = useMemo(
    () => [value, setLocalStorageAndSetValue] as [T, React.Dispatch<React.SetStateAction<T>>],
    [value, setLocalStorageAndSetValue]
  );
  return returnValues;
};

export const useLocalStorageInputElementRef = <T extends HTMLInputElement>(key: string, initialValue: string) => {
  const updateRef = useCallback(
    (value: string) => {
      try {
        setLocalStorageValue(key, value);
        if (ref.current) ref.current.value = value;
      } catch (error) {
        console.error(error);
      }
    },
    [key]
  ); 
  
  const ref = useRef<T>(null!);
  const setRef = useCallback(
    (node: T) => {
      if (!node) return;
      const value = getInitialLocalStorageValue(key, initialValue);
      ref.current = node;
      updateRef(value);
    },
    [key, initialValue, updateRef]
  );


  const returnValues = useMemo(
    () =>
      [ref, setRef, updateRef] as [
        React.MutableRefObject<T>,
        (node: T) => void,
        React.Dispatch<React.SetStateAction<string>>
      ],
    [ref, setRef, updateRef]
  );
  return returnValues;
};
