import { firestore, FirebaseError } from 'firebase';
import { useEffect } from 'react';
import { useIsEqualRef, useLoadingValue } from '../util';
import { transformError } from '../util/transformError';

export type DocumentHook = {
  error?: FirebaseError;
  loading: boolean;
  value?: firestore.DocumentSnapshot;
};

export default (
  docRef?: firestore.DocumentReference | null,
  options?: firestore.SnapshotListenOptions
): DocumentHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    firestore.DocumentSnapshot
  >();
  const ref = useIsEqualRef(docRef, reset);

  useEffect(
    () => {
      if (!ref.current) {
        setValue(undefined);
        return;
      }
      const listener = options
        ? ref.current.onSnapshot(options, setValue, (error: Error) => setError(transformError(error)))
        : ref.current.onSnapshot(setValue, (error: Error) => setError(transformError(error)));

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
