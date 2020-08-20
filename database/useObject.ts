import { database, FirebaseError } from 'firebase';
import { useEffect, useMemo } from 'react';
import { snapshotToData } from './helpers';
import { LoadingHook, useIsEqualRef, useLoadingValue } from '../util';

export type ObjectHook = LoadingHook<database.DataSnapshot, FirebaseError>;
export type ObjectValHook<T> = LoadingHook<T, FirebaseError>;

export const useObject = (query?: database.Query | null): ObjectHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    database.DataSnapshot,
    FirebaseError
  >();
  const ref = useIsEqualRef(query, reset);

  useEffect(
    () => {
      const query = ref.current;
      if (!query) {
        setValue(undefined);
        return;
      }

      query.on('value', setValue, setError);

      return () => {
        query.off('value', setValue);
      };
    },
    [ref.current]
  );

  const resArray: ObjectHook = [value, loading, error];
  return useMemo(
    () => resArray,
    resArray,
  );
};

export const useObjectVal = <T>(
  query?: database.Query | null,
  options?: {
    keyField?: string;
  }
): ObjectValHook<T> => {
  const [snapshot, loading, error] = useObject(query);
  const value = useMemo(
    () =>
      snapshot
        ? snapshotToData(snapshot, options ? options.keyField : undefined)
        : undefined,
    [snapshot, options && options.keyField]
  );

  const resArray: ObjectValHook<T> = [value, loading, error];
  return useMemo(
    () => resArray,
    resArray,
  );
};
