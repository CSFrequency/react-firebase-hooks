import { database } from 'firebase';
import useObject from './useObject';

export type ObjectValHook<T> = {
  error?: object;
  loading: boolean;
  value?: T;
};

export default <T>(query: database.Query | null | undefined): ObjectValHook<T> => {
  const { error, loading, value } = useObject(query);
  return {
    error,
    loading,
    value: value ? value.val() : undefined,
  };
};
