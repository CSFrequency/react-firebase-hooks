import { useEffect, useRef } from 'react';

type RefHook<T> = {
  current: T;
};

export const useComparatorRef = <T>(
  value: T,
  isEqual: (v1: T, v2: T) => boolean,
  onChange?: () => void
): RefHook<T> => {
  const ref = useRef(value);
  useEffect(() => {
    if (!isEqual(value, ref.current)) {
      ref.current = value;
      if (onChange) {
        onChange();
      }
    }
  });
  return ref;
};

export interface HasIsEqual<T> {
  isEqual: (value: T) => boolean;
}

export const useIsEqualRef = <T extends HasIsEqual<T>>(
  value: T,
  onChange?: () => void
): RefHook<T> => {
  return useComparatorRef(value, (v1, v2) => v1.isEqual(v2), onChange);
};

export const useIdentifyRef = <T>(
  value: T,
  onChange?: () => void
): RefHook<T> => {
  return useComparatorRef(value, (v1, v2) => v1 === v2, onChange);
};
