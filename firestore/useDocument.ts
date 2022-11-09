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
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    DocumentSnapshot<T>,
    FirestoreError
  >();
  const ref = useIsFirestoreRefEqual<DocumentReference<T>>(docRef, reset);

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

  return [value as DocumentSnapshot<T>, loading, error];
};

export const useDocumentOnce = <T = DocumentData>(
  docRef?: DocumentReference<T> | null,
  options?: OnceOptions
): DocumentOnceHook<T> => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    DocumentSnapshot<T>,
    FirestoreError
  >();
  const isMounted = useIsMounted();
  const ref = useIsFirestoreRefEqual<DocumentReference<T>>(docRef, reset);

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

  const reloadData = useCallback(() => loadData(ref.current, options), [
    loadData,
    ref.current,
  ]);

  useEffect(() => {
    if (!ref.current) {
      setValue(undefined);
      return;
    }

    loadData(ref.current, options);
  }, [ref.current]);

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
