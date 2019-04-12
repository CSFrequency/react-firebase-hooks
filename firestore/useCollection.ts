import { firestore } from 'firebase';
import { useEffect } from 'react';
import { useIsEqualRef, useLoadingValue } from '../util';

export type CollectionHook = {
  error?: object;
  loading: boolean;
  value?: firestore.QuerySnapshot;
};

export default (
  query: firestore.Query | null | undefined,
  options?: firestore.SnapshotListenOptions
): CollectionHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    firestore.QuerySnapshot
  >();
  const ref = useIsEqualRef(query, reset);

  useEffect(
    () => {
      if (!ref.current) return;
      const listener = options
        ? ref.current.onSnapshot(options, setValue, setError)
        : ref.current.onSnapshot(setValue, setError);

      return () => {
        listener();
      };
    },
    [ref.current]
  );

  return {
    error,
    loading,
    value,
  };
};
