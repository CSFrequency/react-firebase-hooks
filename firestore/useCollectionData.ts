import { firestore, FirebaseError } from 'firebase';
import useCollection from './useCollection';
import { snapshotToData } from './helpers';

export type CollectionDataHook<T> = {
  error?: FirebaseError;
  loading: boolean;
  value?: T[];
};

export default <T>(
  query?: firestore.Query | null,
  options?: firestore.SnapshotListenOptions,
  idField?: string
): CollectionDataHook<T> => {
  const { error, loading, value } = useCollection(query, options);
  return {
    error,
    loading,
    value: (value
      ? value.docs.map(doc => snapshotToData(doc, idField))
      : undefined) as T[],
  };
};
