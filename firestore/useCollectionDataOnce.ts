import { firestore } from 'firebase';
import useCollectionOnce from './useCollectionOnce';
import { snapshotToData } from './helpers';
import { CollectionDataHook } from './useCollectionData';

export default <T>(
  query?: firestore.Query | null,
  options?: firestore.GetOptions,
  idField?: string
): CollectionDataHook<T> => {
  const { error, loading, value } = useCollectionOnce(query, options);
  return {
    error,
    loading,
    value: (value
      ? value.docs.map(doc => snapshotToData(doc, idField))
      : undefined) as T[],
  };
};
