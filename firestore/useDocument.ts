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
import { snapshotToData, useIsFirestoreRefEqual } from './helpers';
import {
  Data,
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

export const useDocumentData = <
  T = DocumentData,
  IDField extends string = '',
  RefField extends string = ''
>(
  docRef?: DocumentReference<T> | null,
  options?: DataOptions<T>
): DocumentDataHook<T, IDField, RefField> => {
  return useDocumentDataInternal<T, IDField, RefField>(true, docRef, options);
};

export const useDocumentDataOnce = <
  T = DocumentData,
  IDField extends string = '',
  RefField extends string = ''
>(
  docRef?: DocumentReference<T> | null,
  options?: OnceDataOptions<T>
): DocumentDataHook<T, IDField, RefField> => {
  return useDocumentDataInternal<T, IDField, RefField>(false, docRef, options);
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

const useDocumentDataInternal = <
  T = DocumentData,
  IDField extends string = '',
  RefField extends string = ''
>(
  listen: boolean,
  docRef?: DocumentReference<T> | null,
  options?: DataOptions<T>
): DocumentDataHook<T, IDField, RefField> => {
  const idField = options ? options.idField : undefined;
  const refField = options ? options.refField : undefined;
  const snapshotOptions = options ? options.snapshotOptions : undefined;
  const transform = options ? options.transform : undefined;
  const [snapshot, loading, error] = useDocumentInternal<T>(
    listen,
    docRef,
    options
  );
  const value = useMemo(
    () =>
      (snapshot
        ? snapshotToData<T>(
            snapshot,
            snapshotOptions,
            idField,
            refField,
            transform
          )
        : undefined) as Data<T, IDField, RefField>,
    [snapshot, snapshotOptions, idField, refField, transform]
  );

  const resArray: DocumentDataHook<T, IDField, RefField> = [
    value,
    loading,
    error,
  ];
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
