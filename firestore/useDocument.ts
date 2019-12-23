import { firestore } from 'firebase';
import { useEffect } from 'react';
import { snapshotToData } from './helpers';
import { LoadingHook, useIsEqualRef, useLoadingValue } from '../util';

export type DocumentHook = LoadingHook<firestore.DocumentSnapshot, Error>;
export type DocumentDataHook<T> = LoadingHook<T, Error>;

export const useDocument = (
  docRef?: firestore.DocumentReference | null,
  options?: {
    snapshotListenOptions?: firestore.SnapshotListenOptions;
  }
): DocumentHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    firestore.DocumentSnapshot,
    Error
  >();
  const ref = useIsEqualRef(docRef, reset);

  useEffect(() => {
    if (!ref.current) {
      reset();
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
  const [value, loading, error] = useDocument(docRef, {
    snapshotListenOptions,
  });
  return [
    (value ? snapshotToData(value, idField) : undefined) as T,
    loading,
    error,
  ];
};
