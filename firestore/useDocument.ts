import { firestore } from "firebase";
import { useEffect, useMemo } from "react";
import { snapshotToData } from "./helpers";
import { LoadingHook, useIsEqualRef, useLoadingValue } from "../util";

export type DocumentHook<T> = LoadingHook<firestore.DocumentSnapshot<T>, Error>;
export type DocumentDataHook<T> = LoadingHook<T, Error>;

export const useDocument = <T>(
  docRef?: firestore.DocumentReference | null,
  options?: {
    snapshotListenOptions?: firestore.SnapshotListenOptions;
  }
): DocumentHook<T> => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    firestore.DocumentSnapshot,
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

  return [value as firestore.DocumentSnapshot<T>, loading, error];
};

export const useDocumentData = <T>(
  docRef?: firestore.DocumentReference | null,
  options?: {
    idField?: string;
    snapshotListenOptions?: firestore.SnapshotListenOptions;
  }
): DocumentDataHook<T> => {
  const idField = options ? options.idField : undefined;
  const snapshotListenOptions = options
    ? options.snapshotListenOptions
    : undefined;
  const [snapshot, loading, error] = useDocument<T>(docRef, {
    snapshotListenOptions,
  });
  const value = useMemo(
    () => (snapshot ? snapshotToData(snapshot, idField) : undefined) as T,
    [snapshot, idField]
  );
  return [value, loading, error];
};
