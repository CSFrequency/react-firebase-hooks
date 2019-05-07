import { firestore, FirebaseError } from 'firebase';
import useDocument from './useDocument';
import { snapshotToData } from './helpers';

export type DocumentDataHook<T> = {
  error?: FirebaseError;
  loading: boolean;
  value?: T;
};

export default <T>(
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
  const { error, loading, value } = useDocument(docRef, snapshotListenOptions);
  return {
    error,
    loading,
    value: (value ? snapshotToData(value, idField) : undefined) as T,
  };
};
