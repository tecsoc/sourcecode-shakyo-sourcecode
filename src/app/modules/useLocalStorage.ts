import isClientSide from "@/app/modules/isClientSide";
import { useCallback, useState } from "react";

const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState(() =>
    JSON.parse((isClientSide() ? localStorage?.getItem(key) : null) ?? JSON.stringify(initialValue))
  );

  const setLocalStorageAndSetValue = useCallback(
    (value: T) => {
      if (isClientSide()) localStorage.setItem(key, JSON.stringify(value));
      setValue(value);
    },
    [key]
  );

  return [value, setLocalStorageAndSetValue] as const;
};

export default useLocalStorage;
