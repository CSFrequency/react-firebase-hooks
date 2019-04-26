import { firestore, FirebaseError } from 'firebase';
import { useEffect } from 'react';
import { useIsEqualRef, useLoadingValue } from '../util';

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
