import firebase from 'firebase/compat/app';
import { useEffect, useMemo } from 'react';
import { snapshotToData } from './helpers';
import {
  CollectionHook,
  CollectionDataHook,
  Data,
  DataOptions,
  OnceOptions,
  OnceDataOptions,
  Options,
} from './types';
import { useIsEqualRef, useLoadingValue } from '../util';

export const useCollection = <T = firebase.firestore.DocumentData>(
  query?: firebase.firestore.Query | null,
  options?: Options
): CollectionHook<T> => {
  return useCollectionInternal<T>(true, query, options);
};

export const useCollectionOnce = <T = firebase.firestore.DocumentData>(
  query?: firebase.firestore.Query<T> | null,
  options?: OnceOptions
): CollectionHook<T> => {
  return useCollectionInternal<T>(false, query, options);
};

export const useCollectionData = <
  T = firebase.firestore.DocumentData,
  IDField extends string = '',
  RefField extends string = ''
>(
  query?: firebase.firestore.Query | null,
  options?: DataOptions<T>
): CollectionDataHook<T, IDField, RefField> => {
  return useCollectionDataInternal<T, IDField, RefField>(true, query, options);
};

export const useCollectionDataOnce = <
  T = firebase.firestore.DocumentData,
  IDField extends string = '',
  RefField extends string = ''
>(
  query?: firebase.firestore.Query | null,
  options?: OnceDataOptions<T>
): CollectionDataHook<T, IDField, RefField> => {
  return useCollectionDataInternal<T, IDField, RefField>(false, query, options);
};

const useCollectionInternal = <T = firebase.firestore.DocumentData>(
  listen: boolean,
  query?: firebase.firestore.Query | null,
  options?: Options & OnceOptions
) => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    firebase.firestore.QuerySnapshot,
    firebase.firestore.FirestoreError
  >();
  const ref = useIsEqualRef(query, reset);

  useEffect(() => {
    if (!ref.current) {
      setValue(undefined);
      return;
    }
    if (listen) {
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
    } else {
      ref.current
        .get(options ? options.getOptions : undefined)
        .then(setValue)
        .catch(setError);
    }
  }, [ref.current]);

  const resArray: CollectionHook<T> = [
    value as firebase.firestore.QuerySnapshot<T>,
    loading,
    error,
  ];
  return useMemo(() => resArray, resArray);
};

const useCollectionDataInternal = <
  T = firebase.firestore.DocumentData,
  IDField extends string = '',
  RefField extends string = ''
>(
  listen: boolean,
  query?: firebase.firestore.Query | null,
  options?: DataOptions<T> & OnceDataOptions<T>
): CollectionDataHook<T, IDField, RefField> => {
  const idField = options ? options.idField : undefined;
  const refField = options ? options.refField : undefined;
  const snapshotOptions = options ? options.snapshotOptions : undefined;
  const transform = options ? options.transform : undefined;
  const [snapshots, loading, error] = useCollectionInternal<T>(
    listen,
    query,
    options
  );
  const values = useMemo(
    () =>
      (snapshots
        ? snapshots.docs.map((doc) =>
            snapshotToData<T>(
              doc,
              snapshotOptions,
              idField,
              refField,
              transform
            )
          )
        : undefined) as Data<T, IDField, RefField>[],
    [snapshots, snapshotOptions, idField, refField, transform]
  );

  const resArray: CollectionDataHook<T, IDField, RefField> = [
    values,
    loading,
    error,
  ];
  return useMemo(() => resArray, resArray);
};
