import firebase from 'firebase/app';
import { useEffect, useMemo } from 'react';
import { snapshotToData } from './helpers';
import {
  Data,
  DocumentHook,
  DocumentDataHook,
  OnceOptions,
  OnceDataOptions,
} from './types';
import { LoadingHook, useIsEqualRef, useLoadingValue } from '../util';

export type DocumentDataOnceHook<T> = LoadingHook<T, Error>;

export const useDocumentOnce = <T>(
  docRef?: firebase.firestore.DocumentReference | null,
  options?: OnceOptions
): DocumentHook<T> => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    firebase.firestore.DocumentSnapshot,
    Error
  >();
  const ref = useIsEqualRef(docRef, reset);

  useEffect(() => {
    if (!ref.current) {
      setValue(undefined);
      return;
    }
    ref.current
      .get(options ? options.getOptions : undefined)
      .then(setValue)
      .catch(setError);
  }, [ref.current]);

  const resArray: DocumentHook<T> = [
    value as firebase.firestore.DocumentSnapshot<T>,
    loading,
    error,
  ];
  return useMemo(() => resArray, resArray);
};

export const useDocumentDataOnce = <
  T,
  IDField extends string = '',
  RefField extends string = ''
>(
  docRef?: firebase.firestore.DocumentReference | null,
  options?: OnceDataOptions
): DocumentDataHook<T, IDField, RefField> => {
  const idField = options ? options.idField : undefined;
  const refField = options ? options.refField : undefined;
  const getOptions = options ? options.getOptions : undefined;
  const [snapshot, loading, error] = useDocumentOnce<T>(docRef, { getOptions });
  const value = useMemo(
    () =>
      (snapshot
        ? snapshotToData(snapshot, idField, refField)
        : undefined) as Data<T, IDField, RefField>,
    [snapshot, idField, refField]
  );

  const resArray: DocumentDataHook<T, IDField, RefField> = [
    value,
    loading,
    error,
  ];
  return useMemo(() => resArray, resArray);
};
