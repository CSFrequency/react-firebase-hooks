import { firestore } from 'firebase';
import { useEffect, useMemo } from 'react';
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

  const resArray: DocumentOnceHook = [value, loading, error]
  return useMemo(
    () => resArray,
    resArray,
  );
};

export const useDocumentDataOnce = <T>(
  docRef?: firestore.DocumentReference | null,
  options?: {
    getOptions?: firestore.GetOptions;
    idField?: string;
  }
): DocumentDataOnceHook<T> => {
  const idField = options ? options.idField : undefined;
  const getOptions = options ? options.getOptions : undefined;
  const [snapshot, loading, error] = useDocumentOnce(docRef, { getOptions });
  const value = useMemo(
    () => (snapshot ? snapshotToData(snapshot, idField) : undefined) as T,
    [snapshot, idField]
  );

  const resArray: DocumentDataOnceHook<T> = [value, loading, error]
  return useMemo(
    () => resArray,
    resArray,
  );
};
