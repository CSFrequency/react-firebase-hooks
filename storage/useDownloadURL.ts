import { storage } from 'firebase';
import { useEffect } from 'react';
import { useComparatorRef, useLoadingValue } from '../util';

export type DownloadURLHook = {
  error?: object;
  loading: boolean;
  value?: string;
};

export default (storageRef: storage.Reference): DownloadURLHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    string
  >();
  const ref = useComparatorRef(
    storageRef,
    (v1, v2) => v1.fullPath === v2.fullPath,
    reset
  );

  useEffect(
    () => {
      ref.current
        .getDownloadURL()
        .then(setValue)
        .catch(setError);
    },
    [ref.current]
  );

  return {
    error,
    loading,
    value,
  };
};
