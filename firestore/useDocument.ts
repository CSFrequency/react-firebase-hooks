import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FirestoreError,
  getDoc,
  getDocFromCache,
  getDocFromServer,
  onSnapshot,
} from 'firebase/firestore';
import { useEffect, useMemo } from 'react';
import { useLoadingValue } from '../util';
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

  const resArray: DocumentHook<T> = [
    value as DocumentSnapshot<T>,
    loading,
    error,
  ];
  return useMemo(() => resArray, resArray);
};

export const useDocumentOnce = <T = DocumentData>(
  docRef?: DocumentReference<T> | null,
  options?: OnceOptions
): DocumentOnceHook<T> => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    DocumentSnapshot<T>,
    FirestoreError
  >();
  let effectActive = true;
  const ref = useIsFirestoreRefEqual<DocumentReference<T>>(docRef, reset);

  const loadData = async (
    reference?: DocumentReference<T> | null,
    options?: OnceOptions
  ) => {
    if (!reference) {
      setValue(undefined);
      return;
    }
    const get = getDocFnFromGetOptions(options?.getOptions);

    try {
      const result = await get(reference);
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
    if (!ref.current) {
      setValue(undefined);
      return;
    }

    loadData(ref.current, options);

    return () => {
      effectActive = false;
    };
  }, [ref.current]);

  const resArray: DocumentOnceHook<T> = [
    value as DocumentSnapshot<T>,
    loading,
    error,
    () => loadData(ref.current, options),
  ];
  return useMemo(() => resArray, resArray);
};

export const useDocumentData = <T = DocumentData>(
  docRef?: DocumentReference<T> | null,
  options?: DataOptions<T> & InitialValueOptions<T>
): DocumentDataHook<T> => {
  const snapshotOptions = options?.snapshotOptions;
  const [snapshot, loading, error] = useDocument<T>(docRef, options);

  const initialValue = options?.initialValue;
  const value = useMemo(
    () => (snapshot?.data(snapshotOptions) ?? initialValue) as T | undefined,
    [snapshot, snapshotOptions, initialValue]
  );

  const resArray: DocumentDataHook<T> = [value, loading, error, snapshot];
  return useMemo(() => resArray, resArray);
};

export const useDocumentDataOnce = <T = DocumentData>(
  docRef?: DocumentReference<T> | null,
  options?: OnceDataOptions<T> & InitialValueOptions<T>
): DocumentDataOnceHook<T> => {
  const snapshotOptions = options?.snapshotOptions;
  const [snapshot, loading, error, loadData] = useDocumentOnce<T>(
    docRef,
    options
  );

  const initialValue = options?.initialValue;
  const value = useMemo(
    () => (snapshot?.data(snapshotOptions) ?? initialValue) as T | undefined,
    [snapshot, snapshotOptions, initialValue]
  );

  const resArray: DocumentDataOnceHook<T> = [
    value,
    loading,
    error,
    snapshot,
    loadData,
  ];
  return useMemo(() => resArray, resArray);
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
