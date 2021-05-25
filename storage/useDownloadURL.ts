import { FirebaseStorageError, StorageReference, getDownloadURL } from 'firebase/storage';
import { useEffect } from 'react';
import { LoadingHook, useComparatorRef, useLoadingValue } from '../util';

export type DownloadURLHook = LoadingHook<string, FirebaseStorageError>;

export default (
  storageRef?: StorageReference | null
): DownloadURLHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    string,
    FirebaseStorageError
  >();
  const ref = useComparatorRef(storageRef, isEqual, reset);

  useEffect(() => {
    if (!ref.current) {
      setValue(undefined);
      return;
    }
    getDownloadURL(ref.current).then(setValue).catch(setError);
  }, [ref.current]);

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
