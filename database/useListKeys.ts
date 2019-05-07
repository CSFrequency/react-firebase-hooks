import { database, FirebaseError } from 'firebase';
import useList from './useList';

export type ListKeysHook = {
  error?: FirebaseError;
  loading: boolean;
  value?: string[];
};

export default (query?: database.Query | null): ListKeysHook => {
  const { error, loading, value } = useList(query);
  return {
    error,
    loading,
    value: value ? value.map(snapshot => snapshot.key as string) : undefined,
  };
};
