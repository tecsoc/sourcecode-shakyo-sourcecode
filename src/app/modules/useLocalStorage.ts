import { useCallback, useState } from "react";

const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState(() => JSON.parse(localStorage?.getItem(key) ?? JSON.stringify(initialValue)));

  const setLocalStorageAndSetValue = useCallback(
    (value: T) => {
      localStorage?.setItem(key, JSON.stringify(value));
      setValue(value);
    },
    [key]
  );

  return [value, setLocalStorageAndSetValue] as const;
};

export default useLocalStorage;
