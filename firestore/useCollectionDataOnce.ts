import { firestore } from 'firebase';
import useCollectionOnce from './useCollectionOnce';
import { snapshotToData } from './helpers';
import { CollectionDataHook } from './useCollectionData';

export default <T>(
  query?: firestore.Query | null,
  options?: {
    getOptions?: firestore.GetOptions;
    idField?: string;
  }
): CollectionDataHook<T> => {
  const idField = options ? options.idField : undefined;
  const getOptions = options ? options.getOptions : undefined;
  const { error, loading, value } = useCollectionOnce(query, getOptions);
  return {
    error,
    loading,
    value: (value
      ? value.docs.map(doc => snapshotToData(doc, idField))
      : undefined) as T[],
  };
};
