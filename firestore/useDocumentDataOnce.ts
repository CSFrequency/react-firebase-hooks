import { firestore } from 'firebase';
import useDocumentOnce from './useDocumentOnce';
import { snapshotToData } from './helpers';
import { DocumentDataHook } from './useDocumentData';

export default <T>(
  docRef?: firestore.DocumentReference | null,
  idField?: string
): DocumentDataHook<T> => {
  const { error, loading, value } = useDocumentOnce(docRef);
  return {
    error,
    loading,
    value: (value ? snapshotToData(value, idField) : undefined) as T,
  };
};
