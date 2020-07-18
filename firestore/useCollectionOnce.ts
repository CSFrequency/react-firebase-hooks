import { firestore } from "firebase";
import { useEffect } from "react";
import { snapshotToData } from "./helpers";
import { LoadingHook, useIsEqualRef, useLoadingValue } from "../util";

export type CollectionOnceHook<T> = LoadingHook<
  firestore.QuerySnapshot<T>,
  Error
>;
export type CollectionDataOnceHook<T> = LoadingHook<T[], Error>;

export const useCollectionOnce = <T>(
  query?: firestore.Query | null,
  options?: {
    getOptions?: firestore.GetOptions;
  }
): CollectionOnceHook<T> => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    firestore.QuerySnapshot,
    Error
  >();
  const ref = useIsEqualRef(query, reset);

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

  return [value as firestore.QuerySnapshot<T>, loading, error];
};

export const useCollectionDataOnce = <T>(
  query?: firestore.Query | null,
  options?: {
    getOptions?: firestore.GetOptions;
    idField?: string;
  }
): CollectionDataOnceHook<T> => {
  const idField = options ? options.idField : undefined;
  const getOptions = options ? options.getOptions : undefined;
  const [value, loading, error] = useCollectionOnce<T>(query, { getOptions });
  return [
    (value
      ? value.docs.map((doc) => snapshotToData(doc, idField))
      : undefined) as T[],
    loading,
    error,
  ];
};
