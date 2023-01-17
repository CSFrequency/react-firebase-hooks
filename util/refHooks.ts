import { useEffect, useMemo, useRef } from 'react';

export type RefHook<T> = {
  current: T;
};

export const useComparatorRef = <T>(
  value: T | null | undefined,
  isEqual: (v1: T | null | undefined, v2: T | null | undefined) => boolean,
  onChange?: () => void
): T | null | undefined => {
  const refRef = useRef(value);
  const ref = useMemo(() => {
    if (!isEqual(value, refRef.current)) {
      refRef.current = value;
    }
    return refRef.current;
  }, [value]);

  useEffect(() => {
    if (onChange) {
      onChange();
    }
  }, [ref]);

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
): T | null | undefined => {
  return useComparatorRef(value, isEqual, onChange);
};
