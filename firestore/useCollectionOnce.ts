import firebase from 'firebase/app';
import { useEffect, useMemo } from 'react';
import { snapshotToData } from './helpers';
import { LoadingHook, useIsEqualRef, useLoadingValue } from '../util';

export type CollectionOnceHook<T> = LoadingHook<
  firebase.firestore.QuerySnapshot<T>,
  Error
>;
export type CollectionDataOnceHook<T> = LoadingHook<T[], Error>;

export const useCollectionOnce = <T>(
  query?: firebase.firestore.Query | null,
  options?: {
    getOptions?: firebase.firestore.GetOptions;
  }
): CollectionOnceHook<T> => {
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
    ref.current
      .get(options ? options.getOptions : undefined)
      .then(setValue)
      .catch(setError);
  }, [ref.current]);

  const resArray: CollectionOnceHook<T> = [
    value as firebase.firestore.QuerySnapshot<T>,
    loading,
    error,
  ];
  return useMemo(() => resArray, resArray);
};

export const useCollectionDataOnce = <T>(
  query?: firebase.firestore.Query | null,
  options?: {
    getOptions?: firebase.firestore.GetOptions;
    idField?: string;
    refField?: string;
  }
): CollectionDataOnceHook<T> => {
  const idField = options ? options.idField : undefined;
  const refField = options ? options.refField : undefined;
  const getOptions = options ? options.getOptions : undefined;
  const [snapshots, loading, error] = useCollectionOnce<T>(query, {
    getOptions,
  });
  const values = useMemo(
    () =>
      (snapshots
        ? snapshots.docs.map((doc) => snapshotToData(doc, idField, refField))
        : undefined) as T[],
    [snapshots, idField, refField]
  );
  const resArray: CollectionDataOnceHook<T> = [values, loading, error];
  return useMemo(() => resArray, resArray);
};
