import { useEffect, useRef } from 'react';

type RefHook<T> = {
  current: T;
};

export const useComparatorRef = <T>(
  value: T | null | undefined,
  isEqual: (v1: T | null | undefined, v2: T | null | undefined) => boolean,
  onChange?: () => void
): RefHook<T | null | undefined> => {
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

const isEqual = <T extends HasIsEqual<T>>(
  v1: T | null | undefined,
  v2: T | null | undefined
): boolean => {
  const bothNull: boolean = !v1 && !v2;
  const equal: boolean = !!v1 && !!v2 && v1.isEqual(v2);
  return bothNull || equal;
};

export const useIsEqualRef = <T extends HasIsEqual<T>>(
  value: T | null | undefined,
  onChange?: () => void
): RefHook<T | null | undefined> => {
  return useComparatorRef(value, isEqual, onChange);
};

export const useIdentifyRef = <T>(
  value: T | null | undefined,
  onChange?: () => void
): RefHook<T | null | undefined> => {
  return useComparatorRef(value, (v1, v2) => v1 === v2, onChange);
};
