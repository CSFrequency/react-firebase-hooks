import firebase from 'firebase/app';
import { useEffect, useMemo } from 'react';
import { snapshotToData } from './helpers';
import {
  Data,
  DataOptions,
  DocumentHook,
  DocumentDataHook,
  Options,
} from './types';
import { useIsEqualRef, useLoadingValue } from '../util';

export const useDocument = <T>(
  docRef?: firebase.firestore.DocumentReference | null,
  options?: Options
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
  }, [ref.current]);

  const resArray: DocumentHook<T> = [
    value as firebase.firestore.DocumentSnapshot<T>,
    loading,
    error,
  ];
  return useMemo(() => resArray, resArray);
};

export const useDocumentData = <
  T,
  IDField extends string = '',
  RefField extends string = ''
>(
  docRef?: firebase.firestore.DocumentReference | null,
  options?: DataOptions
): DocumentDataHook<T, IDField, RefField> => {
  const idField = options ? options.idField : undefined;
  const refField = options ? options.refField : undefined;
  const snapshotListenOptions = options
    ? options.snapshotListenOptions
    : undefined;
  const [snapshot, loading, error] = useDocument<T>(docRef, {
    snapshotListenOptions,
  });
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
