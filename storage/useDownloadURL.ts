import { storage } from 'firebase';
import { useEffect } from 'react';
import { useDataLoader } from '../util';

export type DownloadURLHook = {
  error?: object;
  loading: boolean;
  url?: string;
};

export default (ref: storage.Reference): DownloadURLHook => {
  const { error, loading, setError, setValue, value } = useDataLoader<string>();

  useEffect(
    () => {
      ref
        .getDownloadURL()
        .then(setValue)
        .catch(setError);
    },
    // TODO: Check if this works suitably for 'ref' parameters
    [ref]
  );

  return {
    error,
    loading,
    url: value,
  };
};
