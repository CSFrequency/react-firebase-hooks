import { firestore } from 'firebase';
import useDocumentOnce from './useDocumentOnce';
import { snapshotToData } from './helpers';
import { DocumentDataHook } from './useDocumentData';

export default <T>(
  docRef?: firestore.DocumentReference | null,
  options?: {
    getOptions?: firestore.GetOptions;
    idField?: string;
  }
): DocumentDataHook<T> => {
  const idField = options ? options.idField : undefined;
  const getOptions = options ? options.getOptions : undefined;
  const { error, loading, value } = useDocumentOnce(docRef, getOptions);
  return {
    error,
    loading,
    value: (value ? snapshotToData(value, idField) : undefined) as T,
  };
};
