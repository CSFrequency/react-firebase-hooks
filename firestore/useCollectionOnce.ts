import firebase from 'firebase/app';
import { useEffect, useMemo } from 'react';
import { snapshotToData } from './helpers';
import { LoadingHook, useIsEqualRef, useLoadingValue } from '../util';

export type CollectionOnceHook = LoadingHook<
  firebase.firestore.QuerySnapshot,
  Error
>;
export type CollectionDataOnceHook<T> = LoadingHook<T[], Error>;

export const useCollectionOnce = (
  query?: firebase.firestore.Query | null,
  options?: {
    getOptions?: firebase.firestore.GetOptions;
  }
): CollectionOnceHook => {
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

  const resArray: CollectionOnceHook = [value, loading, error];
  return useMemo(
    () => resArray,
    resArray,
  );
};

export const useCollectionDataOnce = <T>(
  query?: firebase.firestore.Query | null,
  options?: {
    getOptions?: firebase.firestore.GetOptions;
    idField?: string;
  }
): CollectionDataOnceHook<T> => {
  const idField = options ? options.idField : undefined;
  const getOptions = options ? options.getOptions : undefined;
  const [snapshots, loading, error] = useCollectionOnce(query, { getOptions });
  const values = useMemo(
    () => (snapshots
      ? snapshots.docs.map(doc => snapshotToData(doc, idField))
      : undefined) as T[],
    [snapshots, idField]
  );
  const resArray: CollectionDataOnceHook<T> = [
    values,
    loading,
    error,
  ];
  return useMemo(
    () => resArray,
    resArray,
  );
};
