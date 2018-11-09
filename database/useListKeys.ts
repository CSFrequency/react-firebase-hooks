import { database } from 'firebase';
import useList from './useList';

export type ListKeysHook<T> = {
  error?: Object;
  loading: boolean;
  value: string[];
};

export default <T>(query: database.Query): ListKeysHook<T> => {
  const { error, loading, value } = useList(query);
  return {
    error,
    loading,
    value: value.map(snapshot => snapshot.key),
  };
};
