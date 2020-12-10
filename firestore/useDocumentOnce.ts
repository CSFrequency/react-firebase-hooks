import firebase from 'firebase/app';
import { useEffect } from 'react';
import { snapshotToData } from './helpers';
import { LoadingHook, useIsEqualRef, useLoadingValue } from '../util';

export type DocumentOnceHook = LoadingHook<
  firebase.firestore.DocumentSnapshot,
  Error
>;
export type DocumentDataOnceHook<T> = LoadingHook<T, Error>;

export const useDocumentOnce = (
  docRef?: firebase.firestore.DocumentReference | null,
  options?: {
    getOptions?: firebase.firestore.GetOptions;
  }
): DocumentOnceHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    firebase.firestore.DocumentSnapshot,
    Error
  >();
  const ref = useIsEqualRef(docRef, reset);

  useEffect(() => {
    if (!ref.current) {
      setValue(undefined);
      return;
    }
    ref.current
      .get(options ? options.getOptions : undefined)
      .then(setValue)
      .catch(setError);
  }, [ref.current]);

  return [value, loading, error];
};

export const useDocumentDataOnce = <T>(
  docRef?: firebase.firestore.DocumentReference | null,
  options?: {
    getOptions?: firebase.firestore.GetOptions;
    idField?: string;
  }
): DocumentDataOnceHook<T> => {
  const idField = options ? options.idField : undefined;
  const getOptions = options ? options.getOptions : undefined;
  const [value, loading, error] = useDocumentOnce(docRef, { getOptions });
  return [
    (value ? snapshotToData(value, idField) : undefined) as T,
    loading,
    error,
  ];
};
