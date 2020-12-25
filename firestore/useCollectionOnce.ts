import firebase from 'firebase/app';
import { useEffect, useMemo } from 'react';
import { snapshotToData } from './helpers';
import {
  CollectionHook,
  CollectionDataHook,
  Data,
  OnceDataOptions,
  OnceOptions,
} from './types';
import { useIsEqualRef, useLoadingValue } from '../util';

export const useCollectionOnce = <T>(
  query?: firebase.firestore.Query | null,
  options?: OnceOptions
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
    ref.current
      .get(options ? options.getOptions : undefined)
      .then(setValue)
      .catch(setError);
  }, [ref.current]);

  const resArray: CollectionHook<T> = [
    value as firebase.firestore.QuerySnapshot<T>,
    loading,
    error,
  ];
  return useMemo(() => resArray, resArray);
};

export const useCollectionDataOnce = <
  T,
  IDField extends string = '',
  RefField extends string = ''
>(
  query?: firebase.firestore.Query | null,
  options?: OnceDataOptions
): CollectionDataHook<T, IDField, RefField> => {
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
        : undefined) as Data<T, IDField, RefField>[],
    [snapshots, idField, refField]
  );
  const resArray: CollectionDataHook<T, IDField, RefField> = [
    values,
    loading,
    error,
  ];
  return useMemo(() => resArray, resArray);
};
