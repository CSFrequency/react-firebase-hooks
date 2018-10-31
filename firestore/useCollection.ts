import { firestore } from 'firebase';
import { useEffect } from 'react';
import { useDataLoader } from '../util';

export type CollectionHook = {
  error?: object;
  loading: boolean;
  value?: firestore.QuerySnapshot;
};

export default (
  query: firestore.Query,
  options?: firestore.SnapshotListenOptions
): CollectionHook => {
  const { error, loading, setError, setValue, value } = useDataLoader<
    firestore.QuerySnapshot
  >();

  useEffect(
    () => {
      const listener = options
        ? query.onSnapshot(options, setValue, setError)
        : query.onSnapshot(setValue, setError);

      return () => {
        listener();
      };
    },
    // TODO: Check if this works suitably for 'query' parameters
    [query]
  );

  return {
    error,
    loading,
    value,
  };
};
