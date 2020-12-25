import firebase from 'firebase/app';
import { useEffect, useMemo } from 'react';
import { snapshotToData, ValOptions } from './helpers';
import { LoadingHook, useIsEqualRef, useLoadingValue } from '../util';

export type ObjectHook = LoadingHook<
  firebase.database.DataSnapshot,
  firebase.FirebaseError
>;
export type ObjectValHook<T> = LoadingHook<T, firebase.FirebaseError>;

export const useObject = (
  query?: firebase.database.Query | null
): ObjectHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    firebase.database.DataSnapshot,
    firebase.FirebaseError
  >();
  const ref = useIsEqualRef(query, reset);

  useEffect(() => {
    const query = ref.current;
    if (!query) {
      setValue(undefined);
      return;
    }

    query.on('value', setValue, setError);

    return () => {
      query.off('value', setValue);
    };
  }, [ref.current]);

  const resArray: ObjectHook = [value, loading, error];
  return useMemo(() => resArray, resArray);
};

export const useObjectVal = <T>(
  query?: firebase.database.Query | null,
  options?: ValOptions
): ObjectValHook<T> => {
  const keyField = options ? options.keyField : undefined;
  const refField = options ? options.refField : undefined;
  const [snapshot, loading, error] = useObject(query);
  const value = useMemo(
    () => (snapshot ? snapshotToData(snapshot, keyField, refField) : undefined),
    [snapshot, keyField, refField]
  );

  const resArray: ObjectValHook<T> = [value, loading, error];
  return useMemo(() => resArray, resArray);
};
