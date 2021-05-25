import firebase from 'firebase/compat/app';
import { useEffect, useMemo } from 'react';
import { snapshotToData } from './helpers';
import {
  Data,
  DataOptions,
  DocumentHook,
  DocumentDataHook,
  OnceOptions,
  OnceDataOptions,
  Options,
} from './types';
import { useIsEqualRef, useLoadingValue } from '../util';

export const useDocument = <T = firebase.firestore.DocumentData>(
  docRef?: firebase.firestore.DocumentReference | null,
  options?: Options
): DocumentHook<T> => {
  return useDocumentInternal<T>(true, docRef, options);
};

export const useDocumentOnce = <T = firebase.firestore.DocumentData>(
  docRef?: firebase.firestore.DocumentReference | null,
  options?: OnceOptions
): DocumentHook<T> => {
  return useDocumentInternal<T>(false, docRef, options);
};

export const useDocumentData = <
  T = firebase.firestore.DocumentData,
  IDField extends string = '',
  RefField extends string = ''
>(
  docRef?: firebase.firestore.DocumentReference | null,
  options?: DataOptions<T>
): DocumentDataHook<T, IDField, RefField> => {
  return useDocumentDataInternal<T, IDField, RefField>(true, docRef, options);
};

export const useDocumentDataOnce = <
  T = firebase.firestore.DocumentData,
  IDField extends string = '',
  RefField extends string = ''
>(
  docRef?: firebase.firestore.DocumentReference | null,
  options?: OnceDataOptions<T>
): DocumentDataHook<T, IDField, RefField> => {
  return useDocumentDataInternal<T, IDField, RefField>(false, docRef, options);
};

const useDocumentInternal = <T = firebase.firestore.DocumentData>(
  listen: boolean,
  docRef?: firebase.firestore.DocumentReference | null,
  options?: Options & OnceOptions
): DocumentHook<T> => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    firebase.firestore.DocumentSnapshot,
    firebase.firestore.FirestoreError
  >();
  const ref = useIsEqualRef(docRef, reset);

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

  const resArray: DocumentHook<T> = [
    value as firebase.firestore.DocumentSnapshot<T>,
    loading,
    error,
  ];
  return useMemo(() => resArray, resArray);
};

const useDocumentDataInternal = <
  T = firebase.firestore.DocumentData,
  IDField extends string = '',
  RefField extends string = ''
>(
  listen: boolean,
  docRef?: firebase.firestore.DocumentReference | null,
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
