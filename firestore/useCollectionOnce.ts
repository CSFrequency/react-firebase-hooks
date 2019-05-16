import { firestore, FirebaseError } from 'firebase';
import { useEffect } from 'react';
import { snapshotToData } from './helpers';
import { LoadingHook, useIsEqualRef, useLoadingValue } from '../util';

export type CollectionOnceHook = LoadingHook<
  firestore.QuerySnapshot,
  FirebaseError
>;
export type CollectionDataOnceHook<T> = LoadingHook<T[], FirebaseError>;

export const useCollectionOnce = (
  query?: firestore.Query | null,
  options?: firestore.GetOptions
): CollectionOnceHook => {
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
      ref.current
        .get(options)
        .then(setValue)
        .catch(setError);
    },
    [ref.current]
  );

  return [value, loading, error];
};

export const useCollectionDataOnce = <T>(
  query?: firestore.Query | null,
  options?: {
    getOptions?: firestore.GetOptions;
    idField?: string;
  }
): CollectionDataOnceHook<T> => {
  const idField = options ? options.idField : undefined;
  const getOptions = options ? options.getOptions : undefined;
  const [value, loading, error] = useCollectionOnce(query, getOptions);
  return [
    (value
      ? value.docs.map(doc => snapshotToData(doc, idField))
      : undefined) as T[],
    loading,
    error,
  ];
};
