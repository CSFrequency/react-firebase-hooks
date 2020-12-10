import firebase from 'firebase/app';
import { useEffect, useMemo } from 'react';
import { snapshotToData } from './helpers';
import { LoadingHook, useIsEqualRef, useLoadingValue } from '../util';

export type DocumentHook = LoadingHook<firebase.firestore.DocumentSnapshot, Error>;
export type DocumentDataHook<T> = LoadingHook<T, Error>;

export const useDocument = (
  docRef?: firebase.firestore.DocumentReference | null,
  options?: {
    snapshotListenOptions?: firebase.firestore.SnapshotListenOptions;
  }
): DocumentHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    firebase.firestore.DocumentSnapshot,
    Error
  >();
  const ref = useIsEqualRef(docRef, reset);

  useEffect(
    () => {
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
    },
    [ref.current]
  );

  return [value, loading, error];
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
  const [snapshot, loading, error] = useDocument(docRef, {
    snapshotListenOptions,
  });
  const value = useMemo(
    () => (snapshot ? snapshotToData(snapshot, idField) : undefined) as T,
    [snapshot, idField]
  );
  return [value, loading, error];
};
