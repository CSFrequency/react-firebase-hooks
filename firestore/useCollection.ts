import { firestore, FirebaseError } from 'firebase';
import { useEffect } from 'react';
import { useIsEqualRef, useLoadingValue } from '../util';
import { transformError } from '../util/transformError';

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
        ? ref.current.onSnapshot(options, setValue, (error: Error) => setError(transformError(error)))
        : ref.current.onSnapshot({}, setValue, (error: Error) => setError(transformError(error)));

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
