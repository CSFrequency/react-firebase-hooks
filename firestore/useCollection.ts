import firebase from 'firebase/app';
import { useEffect, useMemo } from 'react';
import { snapshotToData } from './helpers';
import { LoadingHook, useIsEqualRef, useLoadingValue } from '../util';

export type CollectionHook<T> = LoadingHook<
  firebase.firestore.QuerySnapshot<T>,
  Error
>;
export type CollectionDataHook<T> = LoadingHook<T[], Error>;

export const useCollection = <T>(
  query?: firebase.firestore.Query | null,
  options?: {
    snapshotListenOptions?: firebase.firestore.SnapshotListenOptions;
  }
): CollectionHook<T> => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    firebase.firestore.QuerySnapshot,
    Error
  >();
  const ref = useIsEqualRef(query, reset);

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

  const resArray: CollectionHook<T> = [
    value as firebase.firestore.QuerySnapshot<T>,
    loading,
    error,
  ];
  return useMemo(() => resArray, resArray);
};

export const useCollectionData = <T>(
  query?: firebase.firestore.Query | null,
  options?: {
    idField?: string;
    snapshotListenOptions?: firebase.firestore.SnapshotListenOptions;
  }
): CollectionDataHook<T> => {
  const idField = options ? options.idField : undefined;
  const snapshotListenOptions = options
    ? options.snapshotListenOptions
    : undefined;
  const [snapshots, loading, error] = useCollection<T>(query, {
    snapshotListenOptions,
  });
  const values = useMemo(
    () =>
      (snapshots
        ? snapshots.docs.map((doc) => snapshotToData(doc, idField))
        : undefined) as T[],
    [snapshots, idField]
  );

  const resArray: CollectionDataHook<T> = [values, loading, error];
  return useMemo(() => resArray, resArray);
};
