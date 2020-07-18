import { firestore } from "firebase";
import { useEffect, useMemo } from "react";
import { snapshotToData } from "./helpers";
import { LoadingHook, useIsEqualRef, useLoadingValue } from "../util";

export type CollectionHook<T> = LoadingHook<firestore.QuerySnapshot<T>, Error>;
export type CollectionDataHook<T> = LoadingHook<T[], Error>;

export const useCollection = <T>(
  query?: firestore.Query | null,
  options?: {
    snapshotListenOptions?: firestore.SnapshotListenOptions;
  }
): CollectionHook<T> => {
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

  return [value as firestore.QuerySnapshot<T>, loading, error];
};

export const useCollectionData = <T>(
  query?: firestore.Query | null,
  options?: {
    idField?: string;
    snapshotListenOptions?: firestore.SnapshotListenOptions;
  }
): CollectionDataHook<T> => {
  const idField = options ? options.idField : undefined;
  const snapshotListenOptions = options
    ? options.snapshotListenOptions
    : undefined;
  const [snapshot, loading, error] = useCollection<T>(query, {
    snapshotListenOptions,
  });
  const values = useMemo(
    () =>
      (snapshot
        ? snapshot.docs.map((doc) => snapshotToData(doc, idField))
        : undefined) as T[],
    [snapshot, idField]
  );
  return [values, loading, error];
};
