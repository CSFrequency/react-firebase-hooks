import { firestore } from 'firebase';
import { useEffect, useRef } from 'react';
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
  const { error, loading, reset, setError, setValue, value } = useDataLoader<
    firestore.QuerySnapshot
  >();
  // Set a ref for the query to make sure that `useEffect` doesn't run
  // every time this renders
  const queryRef = useRef(query);
  // If the query has changed, then
  if (!query.isEqual(queryRef.current)) {
    queryRef.current = query;
    reset();
  }

  useEffect(
    () => {
      const listener = options
        ? queryRef.current.onSnapshot(options, setValue, setError)
        : queryRef.current.onSnapshot(setValue, setError);

      return () => {
        listener();
      };
    },
    [queryRef.current]
  );

  return {
    error,
    loading,
    value,
  };
};
