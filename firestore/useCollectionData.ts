import { firestore } from 'firebase';
import useCollection from './useCollection';
import { snapshotToData } from './helpers';

export type CollectionDataHook<T> = {
  error?: object;
  loading: boolean;
  value?: T[];
};

export default <T>(
  query?: firestore.Query | null,
  idField?: string
): CollectionDataHook<T> => {
  const { error, loading, value } = useCollection(query);
  return {
    error,
    loading,
    value: (value
      ? value.docs.map(doc => snapshotToData(doc, idField))
      : undefined) as T[],
  };
};
