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
  options?: {
    idField?: string;
    snapshotListenOptions?: firestore.SnapshotListenOptions;
  }
): CollectionDataHook<T> => {
  const idField = options ? options.idField : undefined;
  const snapshotListenOptions = options
    ? options.snapshotListenOptions
    : undefined;
  const { error, loading, value } = useCollection(query, snapshotListenOptions);
  return {
    error,
    loading,
    value: (value
      ? value.docs.map(doc => snapshotToData(doc, idField))
      : undefined) as T[],
  };
};
