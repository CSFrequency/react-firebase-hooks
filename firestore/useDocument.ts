import { firestore } from 'firebase';
import { useEffect } from 'react';
import { useDataLoader } from '../util';

export type DocumentHook = {
  error?: object;
  loading: boolean;
  value?: firestore.DocumentSnapshot;
};

export default (
  ref: firestore.DocumentReference,
  options?: firestore.SnapshotListenOptions
): DocumentHook => {
  const { error, loading, setError, setValue, value } = useDataLoader<
    firestore.DocumentSnapshot
  >();

  useEffect(
    () => {
      const listener = options
        ? ref.onSnapshot(options, setValue, setError)
        : ref.onSnapshot(setValue, setError);

      return () => {
        listener();
      };
    },
    // TODO: Check if this works suitably for 'ref' parameters
    [ref]
  );

  return {
    error,
    loading,
    value,
  };
};
