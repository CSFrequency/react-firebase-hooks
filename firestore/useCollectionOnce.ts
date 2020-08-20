import { firestore } from 'firebase';
import { useEffect, useMemo } from 'react';
import { snapshotToData } from './helpers';
import { LoadingHook, useIsEqualRef, useLoadingValue } from '../util';

export type CollectionOnceHook = LoadingHook<firestore.QuerySnapshot, Error>;
export type CollectionDataOnceHook<T> = LoadingHook<T[], Error>;

export const useCollectionOnce = (
  query?: firestore.Query | null,
  options?: {
    getOptions?: firestore.GetOptions;
  }
): CollectionOnceHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    firestore.QuerySnapshot,
    Error
  >();
  const ref = useIsEqualRef(query, reset);

  useEffect(
    () => {
      if (!ref.current) {
        setValue(undefined);
        return;
      }
      ref.current
        .get(options ? options.getOptions : undefined)
        .then(setValue)
        .catch(setError);
    },
    [ref.current]
  );

  const resArray: CollectionOnceHook = [value, loading, error];
  return useMemo(
    () => resArray,
    resArray,
  );
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
  const [value, loading, error] = useCollectionOnce(query, { getOptions });
  const resArray: CollectionDataOnceHook<T> = [
    (value
      ? value.docs.map(doc => snapshotToData(doc, idField))
      : undefined) as T[],
    loading,
    error,
  ];
  return useMemo(
    () => resArray,
    resArray,
  );
};
