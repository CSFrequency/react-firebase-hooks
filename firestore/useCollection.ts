import {
  DocumentData,
  FirestoreError,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  onSnapshot,
  Query,
  QuerySnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import { useEffect, useMemo } from 'react';
import { useLoadingValue } from '../util';
import { useIsFirestoreQueryEqual } from './helpers';
import {
  CollectionDataHook,
  CollectionDataOnceHook,
  CollectionHook,
  CollectionOnceHook,
  DataOptions,
  GetOptions,
  OnceDataOptions,
  OnceOptions,
  Options,
} from './types';

export const useCollection = <T = DocumentData>(
  query?: Query<T> | null,
  options?: Options
): CollectionHook<T> => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    QuerySnapshot<T>,
    FirestoreError
  >();
  const ref = useIsFirestoreQueryEqual<Query<T>>(query, reset);

  useEffect(() => {
    if (!ref.current) {
      setValue(undefined);
      return;
    }
    const unsubscribe = options?.snapshotListenOptions
      ? onSnapshot(
          ref.current,
          options.snapshotListenOptions,
          setValue,
          setError
        )
      : onSnapshot(ref.current, setValue, setError);

    return () => {
      unsubscribe();
    };
  }, [ref.current]);

  const resArray: CollectionHook<T> = [
    value as QuerySnapshot<T>,
    loading,
    error,
  ];
  return useMemo(() => resArray, resArray);
};

export const useCollectionOnce = <T = DocumentData>(
  query?: Query<T> | null,
  options?: OnceOptions
): CollectionOnceHook<T> => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    QuerySnapshot<T>,
    FirestoreError
  >();
  let effectActive = true;
  const ref = useIsFirestoreQueryEqual<Query<T>>(query, reset);

  const loadData = async (
    query?: Query<T> | null,
    options?: Options & OnceOptions
  ) => {
    if (!query) {
      setValue(undefined);
      return;
    }
    const get = getDocsFnFromGetOptions(options?.getOptions);

    try {
      const result = await get(query);
      if (effectActive) {
        setValue(result);
      }
    } catch (error) {
      if (effectActive) {
        setError(error as FirestoreError);
      }
    }
  };

  useEffect(() => {
    loadData(ref.current, options);

    return () => {
      effectActive = false;
    };
  }, [ref.current]);

  const resArray: CollectionOnceHook<T> = [
    value as QuerySnapshot<T>,
    loading,
    error,
    () => loadData(ref.current, options),
  ];
  return useMemo(() => resArray, resArray);
};

export const useCollectionData = <T = DocumentData>(
  query?: Query<T> | null,
  options?: DataOptions<T>
): CollectionDataHook<T> => {
  const snapshotOptions = options?.snapshotOptions;
  const [snapshots, loading, error] = useCollection<T>(query, options);
  const values = getValuesFromSnapshots<T>(snapshots, snapshotOptions);
  const resArray: CollectionDataHook<T> = [values, loading, error, snapshots];
  return useMemo(() => resArray, resArray);
};

export const useCollectionDataOnce = <T = DocumentData>(
  query?: Query<T> | null,
  options?: OnceDataOptions<T>
): CollectionDataOnceHook<T> => {
  const snapshotOptions = options?.snapshotOptions;
  const [snapshots, loading, error, loadData] = useCollectionOnce<T>(
    query,
    options
  );
  const values = getValuesFromSnapshots<T>(snapshots, snapshotOptions);
  const resArray: CollectionDataOnceHook<T> = [
    values,
    loading,
    error,
    snapshots,
    loadData,
  ];
  return useMemo(() => resArray, resArray);
};

const getValuesFromSnapshots = <T>(
  snapshots?: QuerySnapshot<T>,
  options?: SnapshotOptions
) => {
  return useMemo(() => snapshots?.docs.map((doc) => doc.data(options)) as T[], [
    snapshots,
    options,
  ]);
};

const getDocsFnFromGetOptions = (
  { source }: GetOptions = { source: 'default' }
) => {
  switch (source) {
    default:
    case 'default':
      return getDocs;
    case 'cache':
      return getDocsFromCache;
    case 'server':
      return getDocsFromServer;
  }
};
