import {
  DocumentData,
  FirestoreError,
  getCountFromServer,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  onSnapshot,
  Query,
  QuerySnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import { useCallback, useEffect, useMemo } from 'react';
import { useLoadingValue } from '../util';
import useIsMounted from '../util/useIsMounted';
import { useIsFirestoreQueryEqual } from './helpers';
import {
  CollectionCountOnceHook,
  CollectionDataHook,
  CollectionDataOnceHook,
  CollectionHook,
  CollectionOnceHook,
  DataOptions,
  GetOptions,
  InitialValueOptions,
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

  return [value as QuerySnapshot<T>, loading, error];
};

export const useCollectionOnce = <T = DocumentData>(
  query?: Query<T> | null,
  options?: OnceOptions
): CollectionOnceHook<T> => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    QuerySnapshot<T>,
    FirestoreError
  >();
  const isMounted = useIsMounted();
  const ref = useIsFirestoreQueryEqual<Query<T>>(query, reset);

  const loadData = useCallback(
    async (query?: Query<T> | null, options?: Options & OnceOptions) => {
      if (!query) {
        setValue(undefined);
        return;
      }
      const get = getDocsFnFromGetOptions(options?.getOptions);

      try {
        const result = await get(query);
        if (isMounted) {
          setValue(result);
        }
      } catch (error) {
        if (isMounted) {
          setError(error as FirestoreError);
        }
      }
    },
    []
  );

  const reloadData = useCallback(() => loadData(ref.current, options), [
    loadData,
    ref.current,
  ]);

  useEffect(() => {
    loadData(ref.current, options);
  }, [ref.current]);

  return [value as QuerySnapshot<T>, loading, error, reloadData];
};

export const useCollectionData = <T = DocumentData>(
  query?: Query<T> | null,
  options?: DataOptions<T> & InitialValueOptions<T[]>
): CollectionDataHook<T> => {
  const [snapshots, loading, error] = useCollection<T>(query, options);

  const values = getValuesFromSnapshots<T>(
    snapshots,
    options?.snapshotOptions,
    options?.initialValue
  );

  return [values, loading, error, snapshots];
};

export const useCollectionDataOnce = <T = DocumentData>(
  query?: Query<T> | null,
  options?: OnceDataOptions<T> & InitialValueOptions<T[]>
): CollectionDataOnceHook<T> => {
  const [snapshots, loading, error, reloadData] = useCollectionOnce<T>(
    query,
    options
  );

  const values = getValuesFromSnapshots<T>(
    snapshots,
    options?.snapshotOptions,
    options?.initialValue
  );

  return [values, loading, error, snapshots, reloadData];
};

export const useCollectioCountOnce = <T = DocumentData>(
  query?: Query<T> | null
): CollectionCountOnceHook<T> => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    number,
    FirestoreError
  >();
  const isMounted = useIsMounted();
  const ref = useIsFirestoreQueryEqual<Query<T>>(query, reset);

  const loadData = useCallback(
    async (query?: Query<T> | null) => {
      if (!query) {
        setValue(undefined);
        return;
      }

      try {
        const result = await getCountFromServer(query);
        if (isMounted) {
          setValue(result?.data()?.count);
        }
      } catch (error) {
        if (isMounted) {
          setError(error as FirestoreError);
        }
      }
    },
    []
  );

  const reloadData = useCallback(() => loadData(ref.current), [
    loadData,
    ref.current,
  ]);

  useEffect(() => {
    loadData(ref.current);
  }, [ref.current]);

  return [value, loading, error, reloadData];
};

const getValuesFromSnapshots = <T>(
  snapshots: QuerySnapshot<T> | undefined,
  options?: SnapshotOptions,
  initialValue?: T[]
): T[] | undefined => {
  return useMemo(
    () =>
      (snapshots?.docs.map((doc) => doc.data(options)) ?? initialValue) as
        | T[]
        | undefined,
    [snapshots, options]
  );
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
