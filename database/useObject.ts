import { DataSnapshot, off, onValue, Query } from 'firebase/database';
import { useEffect, useMemo } from 'react';
import { useIsEqualRef, useLoadingValue } from '../util';
import { snapshotToData, ValOptions } from './helpers';
import { ObjectHook, ObjectValHook, Val } from './types';

export const useObject = (query?: Query | null): ObjectHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    DataSnapshot,
    Error
  >();
  const ref = useIsEqualRef(query, reset);

  useEffect(() => {
    const query = ref.current;
    if (!query) {
      setValue(undefined);
      return;
    }

    onValue(query, setValue, setError);

    return () => {
      off(query, 'value', setValue);
    };
  }, [ref.current]);

  return [value, loading, error];
};

export const useObjectVal = <
  T,
  KeyField extends string = '',
  RefField extends string = ''
>(
  query?: Query | null,
  options?: ValOptions<T>
): ObjectValHook<T, KeyField, RefField> => {
  // Breaking this out in both `useList` and `useObject` rather than
  // within the `snapshotToData` prevents the developer needing to ensure
  // that `options` is memoized. If `options` was passed directly then it
  // would cause the values to be recalculated every time the whole
  // `options object changed
  const { keyField, refField, transform } = options ?? {};

  const [snapshot, loading, error] = useObject(query);
  const value = useMemo(
    () =>
      (snapshot
        ? snapshotToData(snapshot, keyField, refField, transform)
        : undefined) as Val<T, KeyField, RefField>,
    [snapshot, keyField, refField, transform]
  );

  return [value, loading, error];
};
