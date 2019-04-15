import { database } from 'firebase';
import useList from './useList';
import { snapshotToData } from './helpers';

export type ListValsHook<T> = {
  error?: object;
  loading: boolean;
  value?: T[];
};

export default <T>(
  query?: database.Query | null,
  keyField?: string
): ListValsHook<T> => {
  const { error, loading, value } = useList(query);
  return {
    error,
    loading,
    value: value
      ? value.map(snapshot => snapshotToData(snapshot, keyField))
      : undefined,
  };
};
