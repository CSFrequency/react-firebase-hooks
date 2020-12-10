import firebase from 'firebase/app';
import { useEffect } from 'react';
import { LoadingHook, useComparatorRef, useLoadingValue } from '../util';

export type DownloadURLHook = LoadingHook<string, firebase.FirebaseError>;

export default (
  storageRef?: firebase.storage.Reference | null
): DownloadURLHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    string,
    firebase.FirebaseError
  >();
  const ref = useComparatorRef(storageRef, isEqual, reset);

  useEffect(() => {
    if (!ref.current) {
      setValue(undefined);
      return;
    }
    ref.current.getDownloadURL().then(setValue).catch(setError);
  }, [ref.current]);

  return [value, loading, error];
};

const isEqual = (
  v1: firebase.storage.Reference | null | undefined,
  v2: firebase.storage.Reference | null | undefined
): boolean => {
  const bothNull: boolean = !v1 && !v2;
  const equal: boolean = !!v1 && !!v2 && v1.fullPath === v2.fullPath;
  return bothNull || equal;
};
