import {
  DocumentData,
  FirestoreError,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  onSnapshot,
  Query,
  QuerySnapshot,
} from 'firebase/firestore';
import { useEffect, useMemo } from 'react';
import { useLoadingValue } from '../util';
import { useIsFirestoreQueryEqual } from './helpers';
import {
  CollectionDataHook,
  CollectionHook,
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
  return useCollectionInternal<T>(true, query, options);
};

export const useCollectionOnce = <T = DocumentData>(
  query?: Query<T> | null,
  options?: OnceOptions
): CollectionHook<T> => {
  return useCollectionInternal<T>(false, query, options);
};

export const useCollectionData = <T = DocumentData>(
  query?: Query<T> | null,
  options?: DataOptions<T>
): CollectionDataHook<T> => {
  return useCollectionDataInternal<T>(true, query, options);
};

export const useCollectionDataOnce = <T = DocumentData>(
  query?: Query<T> | null,
  options?: OnceDataOptions<T>
): CollectionDataHook<T> => {
  return useCollectionDataInternal<T>(false, query, options);
};

const useCollectionInternal = <T = DocumentData>(
  listen: boolean,
  query?: Query<T> | null,
  options?: Options & OnceOptions
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
    if (listen) {
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
    } else {
      let effectActive = true;

      const get = getDocsFnFromGetOptions(options?.getOptions);

      get(ref.current)
        .then((result) => {
          if (effectActive) {
            setValue(result);
          }
        })
        .catch((error) => {
          if (effectActive) {
            setError(error);
          }
        });

      return () => {
        effectActive = false;
      };
    }
  }, [ref.current]);

  const resArray: CollectionHook<T> = [
    value as QuerySnapshot<T>,
    loading,
    error,
  ];
  return useMemo(() => resArray, resArray);
};

const useCollectionDataInternal = <T = DocumentData>(
  listen: boolean,
  query?: Query<T> | null,
  options?: DataOptions<T> & OnceDataOptions<T>
): CollectionDataHook<T> => {
  const snapshotOptions = options?.snapshotOptions;
  const [snapshots, loading, error] = useCollectionInternal<T>(
    listen,
    query,
    options
  );
  const values = useMemo(
    () => snapshots?.docs.map((doc) => doc.data(snapshotOptions)) as T[],
    [snapshots, snapshotOptions]
  );

  const resArray: CollectionDataHook<T> = [values, loading, error];
  return useMemo(() => resArray, resArray);
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
