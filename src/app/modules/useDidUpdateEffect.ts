import { useRef, useEffect, EffectCallback, DependencyList } from 'react';

export const useDidUpdateEffect = (fn: EffectCallback, deps?: DependencyList) => {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
    } else {
      fn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
