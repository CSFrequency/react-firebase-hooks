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
import { useCallback, useEffect, useMemo } from 'react';
import { useLoadingValue } from '../util';
import useIsMounted from '../util/useIsMounted';
import { useIsFirestoreQueryEqual } from './helpers';
import {
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
  const ref = useIsFirestoreQueryEqual<Query<T>>(query);
  const { error, loading, setError, setValue, value } = useLoadingValue<
    QuerySnapshot<T>,
    FirestoreError
  >(undefined, [ref]);

  useEffect(() => {
    if (!ref) {
      setValue(undefined);
      return;
    }
    const unsubscribe = options?.snapshotListenOptions
      ? onSnapshot(ref, options.snapshotListenOptions, setValue, setError)
      : onSnapshot(ref, setValue, setError);

    return () => {
      unsubscribe();
    };
  }, [ref]);

  return [value as QuerySnapshot<T>, loading, error];
};

export const useCollectionOnce = <T = DocumentData>(
  query?: Query<T> | null,
  options?: OnceOptions
): CollectionOnceHook<T> => {
  const ref = useIsFirestoreQueryEqual<Query<T>>(query);
  const { error, loading, setError, setValue, value } = useLoadingValue<
    QuerySnapshot<T>,
    FirestoreError
  >(undefined, [ref]);
  const isMounted = useIsMounted();

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

  const reloadData = useCallback(() => loadData(ref, options), [loadData, ref]);

  useEffect(() => {
    loadData(ref, options);
  }, [ref]);

  return [value as QuerySnapshot<T>, loading, error, reloadData];
};

export const useCollectionData = <T = DocumentData>(
  query?: Query<T> | null,
  options?: DataOptions<T> & InitialValueOptions<T[]>
): CollectionDataHook<T> => {
  const ref = useIsFirestoreQueryEqual<Query<T>>(query);
  const { error, loading, setError, setValue, value } = useLoadingValue<
    {
      collectionData: T[];
      snapshot: QuerySnapshot<T>;
    },
    FirestoreError
  >(undefined, [ref]);

  useEffect(() => {
    if (!ref) {
      setValue(undefined);
      return;
    }
    const handleChangeSnapshot = (snapshot: QuerySnapshot<T>) => {
      setValue((previousValue) => {
        const collectionData = previousValue?.collectionData ?? [];
        snapshot
          .docChanges(options?.snapshotListenOptions)
          .forEach((docChange) => {
            switch (docChange.type) {
              case 'added': {
                collectionData.push(
                  docChange.doc.data(options?.snapshotOptions)
                );
                break;
              }
              case 'removed': {
                collectionData.splice(docChange.oldIndex, 1);
                break;
              }
              case 'modified': {
                collectionData.splice(docChange.oldIndex, 1);
                collectionData.splice(
                  docChange.newIndex,
                  0,
                  docChange.doc.data(options?.snapshotOptions)
                );
                break;
              }
            }
          });
        return {
          collectionData,
          snapshot: snapshot,
        };
      });
    };
    const unsubscribe = options?.snapshotListenOptions
      ? onSnapshot(
          ref,
          options.snapshotListenOptions,
          handleChangeSnapshot,
          setError
        )
      : onSnapshot(ref, handleChangeSnapshot, setError);

    return () => {
      unsubscribe();
    };
  }, [ref]);

  return [value?.collectionData, loading, error, value?.snapshot];
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
