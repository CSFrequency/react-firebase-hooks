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
  DocumentHook,
  GetOptions,
  OnceDataOptions,
  OnceOptions,
  Options,
} from './types';
export const useDocument = <T = DocumentData>(
  docRef?: DocumentReference<T> | null,
  options?: Options
): DocumentHook<T> => {
  return useDocumentInternal<T>(true, docRef, options);
};

export const useDocumentOnce = <T = DocumentData>(
  docRef?: DocumentReference<T> | null,
  options?: OnceOptions
): DocumentHook<T> => {
  return useDocumentInternal<T>(false, docRef, options);
};

export const useDocumentData = <T = DocumentData>(
  docRef?: DocumentReference<T> | null,
  options?: DataOptions<T>
): DocumentDataHook<T> => {
  return useDocumentDataInternal<T>(true, docRef, options);
};

export const useDocumentDataOnce = <T = DocumentData>(
  docRef?: DocumentReference<T> | null,
  options?: OnceDataOptions<T>
): DocumentDataHook<T> => {
  return useDocumentDataInternal<T>(false, docRef, options);
};

const useDocumentInternal = <T = DocumentData>(
  listen: boolean,
  docRef?: DocumentReference<T> | null,
  options?: Options & OnceOptions
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
    if (listen) {
      const listener =
        options && options.snapshotListenOptions
          ? onSnapshot(
              ref.current,
              options.snapshotListenOptions,
              setValue,
              setError
            )
          : onSnapshot(ref.current, setValue, setError);

      return () => {
        listener();
      };
    } else {
      const get = getDocFnFromGetOptions(
        options ? options.getOptions : undefined
      );

      get(ref.current).then(setValue).catch(setError);
    }
  }, [ref.current]);

  const resArray: DocumentHook<T> = [
    value as DocumentSnapshot<T>,
    loading,
    error,
  ];
  return useMemo(() => resArray, resArray);
};

const useDocumentDataInternal = <T = DocumentData>(
  listen: boolean,
  docRef?: DocumentReference<T> | null,
  options?: DataOptions<T>
): DocumentDataHook<T> => {
  const snapshotOptions = options ? options.snapshotOptions : undefined;
  const [snapshot, loading, error] = useDocumentInternal<T>(
    listen,
    docRef,
    options
  );
  const value = useMemo(
    () => (snapshot ? snapshot.data(snapshotOptions) : undefined) as T,
    [snapshot, snapshotOptions]
  );

  const resArray: DocumentDataHook<T> = [value, loading, error];
  return useMemo(() => resArray, resArray);
};

function getDocFnFromGetOptions(
  { source }: GetOptions = { source: 'default' }
) {
  switch (source) {
    default:
    case 'default':
      return getDoc;
    case 'cache':
      return getDocFromCache;
    case 'server':
      return getDocFromServer;
  }
}
