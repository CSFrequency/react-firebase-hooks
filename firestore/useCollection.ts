import { firestore, FirebaseError } from 'firebase';
import { useEffect } from 'react';
import { useIsEqualRef, useLoadingValue } from '../util';

export type CollectionHook = {
  error?: FirebaseError;
  loading: boolean;
  value?: firestore.QuerySnapshot;
};

export default (
  query?: firestore.Query | null,
  options?: firestore.SnapshotListenOptions
): CollectionHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    firestore.QuerySnapshot
  >();
  const ref = useIsEqualRef(query, reset);

  useEffect(
    () => {
      if (!ref.current) {
        setValue(undefined);
        return;
      }
      const listener = options
        ? ref.current.onSnapshot(options, setValue, (error: Error) => setError({
          message: error.message,
          stack: error.stack,
          name: error.name,
          code: ''
        }))
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
