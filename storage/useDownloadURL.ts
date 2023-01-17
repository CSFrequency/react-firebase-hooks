import {
  getDownloadURL,
  StorageError,
  StorageReference,
} from 'firebase/storage';
import { useEffect } from 'react';
import { LoadingHook, useComparatorRef, useLoadingValue } from '../util';

export type DownloadURLHook = LoadingHook<string, StorageError>;

export default (storageRef?: StorageReference | null): DownloadURLHook => {
  const ref = useComparatorRef(storageRef, isEqual);
  const { error, loading, setError, setValue, value } = useLoadingValue<
    string,
    StorageError
  >(undefined, [ref]);

  useEffect(() => {
    if (!ref) {
      setValue(undefined);
      return;
    }
    getDownloadURL(ref).then(setValue).catch(setError);
  }, [ref]);

  return [value, loading, error];
};

const isEqual = (
  v1: StorageReference | null | undefined,
  v2: StorageReference | null | undefined
): boolean => {
  const bothNull: boolean = !v1 && !v2;
  const equal: boolean = !!v1 && !!v2 && v1.fullPath === v2.fullPath;
  return bothNull || equal;
};
