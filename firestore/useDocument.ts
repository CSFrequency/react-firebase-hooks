import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FirestoreError,
  getDoc,
  getDocFromCache,
  getDocFromServer,
  onSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import { useCallback, useEffect, useMemo } from 'react';
import { useLoadingValue } from '../util';
import useIsMounted from '../util/useIsMounted';
import { useIsFirestoreRefEqual } from './helpers';
import {
  DataOptions,
  DocumentDataHook,
  DocumentDataOnceHook,
  DocumentHook,
  DocumentOnceHook,
  GetOptions,
  InitialValueOptions,
  OnceDataOptions,
  OnceOptions,
  Options,
} from './types';

export const useDocument = <T = DocumentData>(
  docRef?: DocumentReference<T> | null,
  options?: Options
): DocumentHook<T> => {
  const ref = useIsFirestoreRefEqual<DocumentReference<T>>(docRef);
  const { error, loading, setError, setValue, value } = useLoadingValue<
    DocumentSnapshot<T>,
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

  return [value as DocumentSnapshot<T>, loading, error];
};

export const useDocumentOnce = <T = DocumentData>(
  docRef?: DocumentReference<T> | null,
  options?: OnceOptions
): DocumentOnceHook<T> => {
  const ref = useIsFirestoreRefEqual<DocumentReference<T>>(docRef);
  const { error, loading, setError, setValue, value } = useLoadingValue<
    DocumentSnapshot<T>,
    FirestoreError
  >(undefined, [ref]);
  const isMounted = useIsMounted();

  const loadData = useCallback(
    async (reference?: DocumentReference<T> | null, options?: OnceOptions) => {
      if (!reference) {
        setValue(undefined);
        return;
      }
      const get = getDocFnFromGetOptions(options?.getOptions);

      try {
        const result = await get(reference);
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
    if (!ref) {
      setValue(undefined);
      return;
    }

    loadData(ref, options);
  }, [ref]);

  return [value as DocumentSnapshot<T>, loading, error, reloadData];
};

export const useDocumentData = <T = DocumentData>(
  docRef?: DocumentReference<T> | null,
  options?: DataOptions<T> & InitialValueOptions<T>
): DocumentDataHook<T> => {
  const [snapshot, loading, error] = useDocument<T>(docRef, options);

  const value = getValueFromSnapshot(
    snapshot,
    options?.snapshotOptions,
    options?.initialValue
  );

  return [value, loading, error, snapshot];
};

export const useDocumentDataOnce = <T = DocumentData>(
  docRef?: DocumentReference<T> | null,
  options?: OnceDataOptions<T> & InitialValueOptions<T>
): DocumentDataOnceHook<T> => {
  const [snapshot, loading, error, reloadData] = useDocumentOnce<T>(
    docRef,
    options
  );

  const value = getValueFromSnapshot(
    snapshot,
    options?.snapshotOptions,
    options?.initialValue
  );

  return [value, loading, error, snapshot, reloadData];
};

const getDocFnFromGetOptions = (
  { source }: GetOptions = { source: 'default' }
) => {
  switch (source) {
    default:
    case 'default':
      return getDoc;
    case 'cache':
      return getDocFromCache;
    case 'server':
      return getDocFromServer;
  }
};

const getValueFromSnapshot = <T>(
  snapshot: DocumentSnapshot<T> | undefined,
  options?: SnapshotOptions,
  initialValue?: T
): T | undefined => {
  return useMemo(
    () => (snapshot?.data(options) ?? initialValue) as T | undefined,
    [snapshot, options, initialValue]
  );
};
