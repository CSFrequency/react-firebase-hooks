import { firestore, FirebaseError } from 'firebase';
import { useEffect } from 'react';
import { snapshotToData, transformError } from './helpers';
import { LoadingHook, useIsEqualRef, useLoadingValue } from '../util';

export type CollectionHook = LoadingHook<
  firestore.QuerySnapshot,
  FirebaseError
>;
export type CollectionDataHook<T> = LoadingHook<T[], FirebaseError>;

export const useCollection = (
  query?: firestore.Query | null,
  options?: firestore.SnapshotListenOptions
): CollectionHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    firestore.QuerySnapshot
  >();
  const ref = useIsEqualRef(query, reset);

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

export const useCollectionData = <T>(
  query?: firestore.Query | null,
  options?: {
    idField?: string;
    snapshotListenOptions?: firestore.SnapshotListenOptions;
  }
): CollectionDataHook<T> => {
  const idField = options ? options.idField : undefined;
  const snapshotListenOptions = options
    ? options.snapshotListenOptions
    : undefined;
  const [value, loading, error] = useCollection(query, snapshotListenOptions);
  return [
    (value
      ? value.docs.map(doc => snapshotToData(doc, idField))
      : undefined) as T[],
    loading,
    error,
  ];
};
