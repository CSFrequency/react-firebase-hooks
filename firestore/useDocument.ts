import { firestore } from 'firebase';
import { useEffect, useRef } from 'react';
import { useDataLoader } from '../util';

export type DocumentHook = {
  error?: object;
  loading: boolean;
  value?: firestore.DocumentSnapshot;
};

export default (
  doc: firestore.DocumentReference,
  options?: firestore.SnapshotListenOptions
): DocumentHook => {
  const { error, loading, reset, setError, setValue, value } = useDataLoader<
    firestore.DocumentSnapshot
  >();
  // Set a ref for the query to make sure that `useEffect` doesn't run
  // every time this renders
  const docRef = useRef(doc);
  // If the query has changed, then
  if (!doc.isEqual(docRef.current)) {
    docRef.current = doc;
    reset();
  }

  useEffect(
    () => {
      const listener = options
        ? docRef.current.onSnapshot(options, setValue, setError)
        : docRef.current.onSnapshot(setValue, setError);

      return () => {
        listener();
      };
    },
    // TODO: Check if this works suitably for 'ref' parameters
    [docRef.current]
  );

  return {
    error,
    loading,
    value,
  };
};
