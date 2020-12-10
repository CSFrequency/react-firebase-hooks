import firebase from 'firebase/app';
import { useEffect, useMemo } from 'react';
import { snapshotToData } from './helpers';
import { LoadingHook, useIsEqualRef, useLoadingValue } from '../util';

export type DocumentHook<T> = LoadingHook<
  firebase.firestore.DocumentSnapshot<T>,
  Error
>;
export type DocumentDataHook<T> = LoadingHook<T, Error>;

export const useDocument = <T>(
  docRef?: firebase.firestore.DocumentReference | null,
  options?: {
    snapshotListenOptions?: firebase.firestore.SnapshotListenOptions;
  }
): DocumentHook<T> => {
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
    const listener =
      options && options.snapshotListenOptions
        ? ref.current.onSnapshot(
            options.snapshotListenOptions,
            setValue,
            setError
          )
        : ref.current.onSnapshot(setValue, setError);

    return () => {
      listener();
    };
  }, [ref.current]);

  const resArray: DocumentHook<T> = [
    value as firebase.firestore.DocumentSnapshot<T>,
    loading,
    error,
  ];
  return useMemo(() => resArray, resArray);
};

export const useDocumentData = <T>(
  docRef?: firebase.firestore.DocumentReference | null,
  options?: {
    idField?: string;
    snapshotListenOptions?: firebase.firestore.SnapshotListenOptions;
  }
): DocumentDataHook<T> => {
  const idField = options ? options.idField : undefined;
  const snapshotListenOptions = options
    ? options.snapshotListenOptions
    : undefined;
  const [snapshot, loading, error] = useDocument<T>(docRef, {
    snapshotListenOptions,
  });
  const value = useMemo(
    () => (snapshot ? snapshotToData(snapshot, idField) : undefined) as T,
    [snapshot, idField]
  );

  const resArray: DocumentDataHook<T> = [value, loading, error];
  return useMemo(() => resArray, resArray);
};
