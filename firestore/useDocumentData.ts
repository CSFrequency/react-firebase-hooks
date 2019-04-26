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
  options?: firestore.SnapshotListenOptions,
  idField?: string
): DocumentDataHook<T> => {
  const { error, loading, value } = useDocument(docRef, options);
  return {
    error,
    loading,
    value: (value ? snapshotToData(value, idField) : undefined) as T,
  };
};
