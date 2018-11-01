import { storage } from 'firebase';
import { useEffect, useRef } from 'react';
import { useLoadingValue } from '../util';

export type DownloadURLHook = {
  error?: object;
  loading: boolean;
  url?: string;
};

export default (ref: storage.Reference): DownloadURLHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    string
  >();
  // Set a ref for the query to make sure that `useEffect` doesn't run
  // every time this renders
  const refRef = useRef(ref);
  // If the query has changed, then
  if (ref.fullPath !== refRef.current.fullPath) {
    refRef.current = ref;
    reset();
  }

  useEffect(
    () => {
      refRef.current
        .getDownloadURL()
        .then(setValue)
        .catch(setError);
    },
    [refRef.current]
  );

  return {
    error,
    loading,
    url: value,
  };
};
