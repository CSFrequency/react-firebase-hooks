import { firestore, FirebaseError } from 'firebase';
import { useEffect } from 'react';
import { snapshotToData, transformError } from './helpers';
import { LoadingHook, useIsEqualRef, useLoadingValue } from '../util';

export type DocumentHook = LoadingHook<
  firestore.DocumentSnapshot,
  FirebaseError
>;
export type DocumentDataHook<T> = LoadingHook<T, FirebaseError>;

export const useDocument = (
  docRef?: firestore.DocumentReference | null,
  options?: firestore.SnapshotListenOptions
): DocumentHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    firestore.DocumentSnapshot
  >();
  const ref = useIsEqualRef(docRef, reset);

  useEffect(
    () => {
      if (!ref.current) {
        setValue(undefined);
        return;
      }
      const listener = options
        ? ref.current.onSnapshot(options, setValue, (error: Error) =>
            setError(transformError(error))
          )
        : ref.current.onSnapshot(setValue, (error: Error) =>
            setError(transformError(error))
          );

      return () => {
        listener();
      };
    },
    [ref.current]
  );

  return [value, loading, error];
};

export const useDocumentData = <T>(
  docRef?: firestore.DocumentReference | null,
  options?: {
    idField?: string;
    snapshotListenOptions?: firestore.SnapshotListenOptions;
  }
): DocumentDataHook<T> => {
  const idField = options ? options.idField : undefined;
  const snapshotListenOptions = options
    ? options.snapshotListenOptions
    : undefined;
  const [value, loading, error] = useDocument(docRef, snapshotListenOptions);
  return [
    (value ? snapshotToData(value, idField) : undefined) as T,
    loading,
    error,
  ];
};
