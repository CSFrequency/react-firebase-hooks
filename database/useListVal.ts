import { database } from 'firebase';
import useList from './useList';

export type ListValHook<T> = {
  error?: Object;
  loading: boolean;
  value: T[];
};

export default <T>(
  query: database.Query,
  keyField?: string
): ListValHook<T> => {
  const { error, loading, value } = useList(query);
  return {
    error,
    loading,
    value: value.map(snapshot => {
      return keyField
        ? {
            ...snapshot.val(),
            [keyField]: snapshot.key,
          }
        : snapshot.val();
    }),
  };
};
