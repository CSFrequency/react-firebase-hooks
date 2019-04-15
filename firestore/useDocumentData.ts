import { firestore } from 'firebase';
import useDocument from './useDocument';
import { snapshotToData } from './helpers';

export type DocumentDataHook<T> = {
  error?: object;
  loading: boolean;
  value?: T;
};

export default <T>(
  docRef?: firestore.DocumentReference | null,
  idField?: string
): DocumentDataHook<T> => {
  const { error, loading, value } = useDocument(docRef);
  return {
    error,
    loading,
    value: (value ? snapshotToData(value, idField) : undefined) as T,
  };
};
