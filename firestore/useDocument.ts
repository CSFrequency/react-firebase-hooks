import { firestore } from 'firebase';
import { useEffect } from 'react';
import { useIsEqualRef, useLoadingValue } from '../util';

export type DocumentHook = {
  error?: object;
  loading: boolean;
  value?: firestore.DocumentSnapshot;
};

export default (
  docRef: firestore.DocumentReference,
  options?: firestore.SnapshotListenOptions
): DocumentHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    firestore.DocumentSnapshot
  >();
  const ref = useIsEqualRef(docRef, reset);

  useEffect(
    () => {
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
