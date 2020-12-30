import firebase from 'firebase/app';
import { useEffect, useMemo } from 'react';
import { snapshotToData } from './helpers';
import {
  CollectionHook,
  CollectionDataHook,
  Data,
  DataOptions,
  Options,
} from './types';
import { useIsEqualRef, useLoadingValue } from '../util';

export const useCollection = <T = firebase.firestore.DocumentData>(
  query?: firebase.firestore.Query<T> | null,
  options?: Options
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

export const useCollectionData = <
  T = firebase.firestore.DocumentData,
  IDField extends string = '',
  RefField extends string = ''
>(
  query?: firebase.firestore.Query<T> | null,
  options?: DataOptions
): CollectionDataHook<T, IDField, RefField> => {
  const idField = options ? options.idField : undefined;
  const refField = options ? options.refField : undefined;
  const snapshotListenOptions = options
    ? options.snapshotListenOptions
    : undefined;
  const [snapshots, loading, error] = useCollection<T>(query, {
    snapshotListenOptions,
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
