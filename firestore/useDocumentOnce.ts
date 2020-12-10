import firebase from 'firebase/app';
import { useEffect, useMemo } from 'react';
import { snapshotToData } from './helpers';
import { LoadingHook, useIsEqualRef, useLoadingValue } from '../util';

export type DocumentOnceHook<T> = LoadingHook<
  firebase.firestore.DocumentSnapshot<T>,
  Error
>;
export type DocumentDataOnceHook<T> = LoadingHook<T, Error>;

export const useDocumentOnce = <T>(
  docRef?: firebase.firestore.DocumentReference | null,
  options?: {
    getOptions?: firebase.firestore.GetOptions;
  }
): DocumentOnceHook<T> => {
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

  const resArray: DocumentOnceHook<T> = [
    value as firebase.firestore.DocumentSnapshot<T>,
    loading,
    error,
  ];
  return useMemo(() => resArray, resArray);
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
  const [snapshot, loading, error] = useDocumentOnce<T>(docRef, { getOptions });
  const value = useMemo(
    () => (snapshot ? snapshotToData(snapshot, idField) : undefined) as T,
    [snapshot, idField]
  );

  const resArray: DocumentDataOnceHook<T> = [value, loading, error];
  return useMemo(() => resArray, resArray);
};
