import { firestore } from 'firebase';
import { useEffect } from 'react';
import { snapshotToData } from './helpers';
import { LoadingHook, useIsEqualRef, useLoadingValue } from '../util';

export type DocumentOnceHook = LoadingHook<firestore.DocumentSnapshot, Error>;
export type DocumentDataOnceHook<T> = LoadingHook<T, Error>;

export const useDocumentOnce = (
  docRef?: firestore.DocumentReference | null,
  options?: {
    getOptions?: firestore.GetOptions;
  }
): DocumentOnceHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    firestore.DocumentSnapshot,
    Error
  >();
  const ref = useIsEqualRef(docRef, reset);

  useEffect(
    () => {
      if (!ref.current) {
        setValue(undefined);
        return;
      }
      ref.current
        .get(options ? options.getOptions : undefined)
        .then(setValue)
        .catch(setError);
    },
    [ref.current]
  );

  return [value, loading, error];
};

export const useDocumentDataOnce = <T>(
  docRef?: firestore.DocumentReference | null,
  options?: {
    getOptions?: firestore.GetOptions;
    idField?: string;
    refField?: string;
  }
): DocumentDataOnceHook<T> => {
  const idField = options ? options.idField : undefined;
  const refField = options ? options.refField : undefined;
  const getOptions = options ? options.getOptions : undefined;
  const [value, loading, error] = useDocumentOnce(docRef, { getOptions });
  return [
    (value ? snapshotToData(value, idField, refField) : undefined) as T,
    loading,
    error,
  ];
};
