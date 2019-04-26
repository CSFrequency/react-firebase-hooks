import { database, FirebaseError } from 'firebase';
import useObject from './useObject';
import { snapshotToData } from './helpers';

export type ObjectValHook<T> = {
  error?: FirebaseError;
  loading: boolean;
  value?: T;
};

export default <T>(
  query?: database.Query | null,
  keyField?: string
): ObjectValHook<T> => {
  const { error, loading, value } = useObject(query);
  return {
    error,
    loading,
    value: value ? snapshotToData(value, keyField) : undefined,
  };
};
